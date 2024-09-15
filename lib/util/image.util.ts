export enum ImageConversionType {
  Webp = 'image/webp',
  Jpg = 'image/jpg',
  Png = 'image/png',
}

export class ImageUtil {
  static async convert(imgFile: File, typ: ImageConversionType): Promise<File> {
    if (!imgFile.type.startsWith('image')) {
      return imgFile;
    }

    const currentExtension = ImageUtil.#getFileExtension(imgFile);
    const targetExtension = ImageUtil.#getImageExtensionFromConversionType(typ);

    const isConversionNecessary = currentExtension !== targetExtension;

    return isConversionNecessary
      ? ImageUtil.#getConvertedFileFromImage(
          await ImageUtil.#getImageFromFile(imgFile),
          typ,
          imgFile.name.substring(0, imgFile.name.lastIndexOf('.'))
        )
      : imgFile;
  }

  static async #getConvertedFileFromImage(
    image: HTMLImageElement,
    typ: ImageConversionType,
    fileName = 'converted'
  ): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext('2d')?.drawImage(image, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const convertedImgFile = new File(
            [blob],
            `${fileName}.${ImageUtil.#getImageExtensionFromConversionType(typ)}`,
            {
              type: blob.type,
            }
          );

          resolve(convertedImgFile);
        }
      }, typ);
    });
  }

  static async #getImageFromFile(imgFile: File): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();

      img.addEventListener('load', () => {
        resolve(img);
      });

      img.src = URL.createObjectURL(imgFile);
    });
  }

  static #getImageExtensionFromConversionType(typ: ImageConversionType): string {
    const conversionTypeToExtensionMapping: Record<ImageConversionType, string> = {
      [ImageConversionType.Jpg]: 'jpg',
      [ImageConversionType.Png]: 'png',
      [ImageConversionType.Webp]: 'webp',
    };

    return conversionTypeToExtensionMapping[typ];
  }

  static #getFileExtension(file: File): string {
    return file.name.substring(file.name.lastIndexOf('.') + 1);
  }
}
