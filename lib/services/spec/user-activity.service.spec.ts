import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UserActivityService } from '../user-activity.service';

const handleActivity = vi.fn();
const handleChangeActivityState = vi.fn();

UserActivityService.activityTimeoutDuration = 100000;

describe('UserActivityService', () => {
  describe('onActivity', () => {
    beforeEach(() => {
      vi.clearAllMocks();

      UserActivityService.onActivity.subscribe(handleActivity);
    });
    afterEach(() => {
      UserActivityService.onActivity.unsubscribe(handleActivity);
    });

    it('triggers on mousedown', () => {
      window.dispatchEvent(new Event('mousedown'));

      expect(handleActivity).toHaveBeenCalledTimes(1);
    });
    it('triggers on keyup', () => {
      window.dispatchEvent(new Event('keyup'));

      expect(handleActivity).toHaveBeenCalledTimes(1);
    });
    it('triggers on mousemove', () => {
      window.dispatchEvent(new Event('mousemove'));

      expect(handleActivity).toHaveBeenCalledTimes(1);
    });
  });
  describe('onChangeActivityState', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      UserActivityService.onChangeActivityState.subscribe(handleChangeActivityState);
    });
    afterEach(() => {
      UserActivityService.onChangeActivityState.unsubscribe(handleChangeActivityState);
    });

    it('triggers after the appropriate amount of time for user inactivity', async () => {
      UserActivityService.activityTimeoutDuration = 2000;
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(handleChangeActivityState).toHaveBeenCalledTimes(1);

          resolve(undefined);
        }, UserActivityService.activityTimeoutDuration + 10);
      });
    });
    it('does not trigger if you do not wait long enough', async () => {
      UserActivityService.activityTimeoutDuration = 2000;
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(handleChangeActivityState).not.toHaveBeenCalled();

          resolve(undefined);
        }, 500);
      });
    });
  });
});
