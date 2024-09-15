import { Event } from '@jtjs/event';

type KeyName = KeyboardEvent['key'];

export type UserInputKeyEventHandler = (key: KeyName) => void;

export class UserInputService {
  /**
   * Triggered on the single instance where a key goes from being up to
   * being down.
   *
   * By the time this is triggered, the service has been updated to reflect
   * the new key event.
   */
  public static onKeyDown = new Event<UserInputKeyEventHandler>();
  /**
   * Triggered on the single instance where a key goes from being down to being
   * up.
   *
   * By the time this is triggered, the service has been updated to reflect
   * the new key event.
   */
  public static onKeyUp = new Event<UserInputKeyEventHandler>();
  /**
   * Triggered continuously so long as a key is pressed.
   *
   * By the time this is triggered, the service has been updated to reflect
   * the new key event.
   */
  public static onKeyPressed = new Event<UserInputKeyEventHandler>();

  private static _keylog: Record<string, boolean> = {};

  /**
   * @param key - The key to check for. The same name as what comes from a
   * {@link KeyboardEvent}.
   *
   * @returns Whether the specified key is currently pressed.
   */
  public static isKeyPressed(key: KeyName): boolean {
    return !!UserInputService._keylog[key];
  }

  /**
   * @param key - The key to check for. The same name as what comes from a
   * {@link KeyboardEvent}.
   *
   * @returns Whether the specified key is currently released.
   */
  public static isKeyUp(key: KeyName): boolean {
    return !UserInputService._keylog[key];
  }

  /**
   * @param keys - The keys to check for. The same names as what comes from a
   * {@link KeyboardEvent}.
   *
   * @returns Whether the specified chord is currently pressed. Note that other
   * keys could also be pressed. If you want to know if _only_ the keys necessary
   * for this chord are pressed, use {@link UserInputService.isChordPressedExclusively}.
   */
  public static isChordPressed(keys: KeyName[]): boolean {
    return keys.every(UserInputService.isKeyPressed);
  }

  /**
   * @param keys - The keys to check for. The same names as what comes from a
   * {@link KeyboardEvent}.
   *
   * @returns Whether only the keys necessary for the specified chord are pressed.
   */
  public static isChordPressedExclusively(keys: KeyName[]): boolean {
    return (
      UserInputService.isChordPressed(keys) &&
      Object.values(UserInputService._keylog).filter(Boolean).length ===
        keys.length
    );
  }

  private static startKeyListener() {
    const onKeyHandler = (event: KeyboardEvent) => {
      const key = event.key;
      const prevIsDown = UserInputService._keylog[event.key];
      const newIsDown = event.type === 'keydown';

      UserInputService._keylog[event.key] = newIsDown;

      if (prevIsDown && !newIsDown) {
        UserInputService.onKeyUp.trigger(key);
      } else if (!prevIsDown && newIsDown) {
        UserInputService.onKeyDown.trigger(key);
      } else if (newIsDown) {
        UserInputService.onKeyPressed.trigger(key);
      }
    };

    document.removeEventListener('keydown', onKeyHandler);
    document.removeEventListener('keyup', onKeyHandler);

    document.addEventListener('keydown', onKeyHandler);
    document.addEventListener('keyup', onKeyHandler);
  }

  private static _constructor = (() => {
    UserInputService.startKeyListener();
  })();
}
