import { beforeEach, describe, expect, test } from 'vitest';
import { UserInputService } from '../user-input.service';

describe('UserInputService', () => {
  beforeEach(() => {
    // @ts-ignore
    UserInputService._keylog = {};
  });

  describe('isKeyPressed', () => {
    describe('true when', () => {
      test('key is pressed', () => {
        // @ts-ignore
        UserInputService._keylog['A'] = true;

        expect(UserInputService.isKeyPressed('A')).toBe(true);
      });
    });
    describe('false when', () => {
      test('key is up', () => {
        // @ts-ignore
        UserInputService._keylog['A'] = false;

        expect(UserInputService.isKeyPressed('A')).toBe(false);
        expect(UserInputService.isKeyPressed('C')).toBe(false);
      });
    });
  });

  describe('isKeyUp', () => {
    describe('true when', () => {
      test('key is up', () => {
        // @ts-ignore
        UserInputService._keylog['A'] = true;

        expect(UserInputService.isKeyUp('A')).toBe(false);
      });
    });
    describe('false when', () => {
      test('key is down', () => {
        // @ts-ignore
        UserInputService._keylog['A'] = false;

        expect(UserInputService.isKeyUp('A')).toBe(true);
        expect(UserInputService.isKeyUp('C')).toBe(true);
      });
    });
  });

  describe('isChordPressed', () => {
    describe('true when', () => {
      test('chord is pressed', () => {
        // @ts-ignore
        UserInputService._keylog['A'] = true;
        // @ts-ignore
        UserInputService._keylog['Shift'] = true;

        expect(UserInputService.isChordPressed(['A', 'Shift'])).toBe(true);
      });
      test('chord is pressed among other keys', () => {
        // @ts-ignore
        UserInputService._keylog['A'] = true;
        // @ts-ignore
        UserInputService._keylog['Shift'] = true;
        // @ts-ignore
        UserInputService._keylog['C'] = true;

        expect(UserInputService.isChordPressed(['A', 'Shift'])).toBe(true);
      });
    });
    describe('false when', () => {
      test('no keys are pressed', () => {
        expect(UserInputService.isChordPressed(['A', 'Shift'])).toBe(false);
      });
      test('not all keys are pressed', () => {
        // @ts-ignore
        UserInputService._keylog['A'] = true;
        // @ts-ignore
        UserInputService._keylog['C'] = true;

        expect(UserInputService.isChordPressed(['A', 'Shift'])).toBe(false);
      });
    });
  });

  describe('isChordPressedExclusively', () => {
    describe('true when', () => {
      test('chord is pressed', () => {
        // @ts-ignore
        UserInputService._keylog['A'] = true;
        // @ts-ignore
        UserInputService._keylog['Shift'] = true;

        expect(UserInputService.isChordPressedExclusively(['A', 'Shift'])).toBe(true);
      });
    });
    describe('false when', () => {
      test('no keys are pressed', () => {
        expect(UserInputService.isChordPressedExclusively(['A', 'Shift'])).toBe(false);
      });
      test('not all keys are pressed', () => {
        // @ts-ignore
        UserInputService._keylog['A'] = true;
        // @ts-ignore
        UserInputService._keylog['C'] = true;

        expect(UserInputService.isChordPressedExclusively(['A', 'Shift'])).toBe(false);
      });
      test('chord is pressed among other keys', () => {
        // @ts-ignore
        UserInputService._keylog['A'] = true;
        // @ts-ignore
        UserInputService._keylog['Shift'] = true;
        // @ts-ignore
        UserInputService._keylog['C'] = true;

        expect(UserInputService.isChordPressedExclusively(['A', 'Shift'])).toBe(false);
      });
    });
  });
});
