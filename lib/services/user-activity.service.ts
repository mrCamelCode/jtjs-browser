import { Event } from '@jtjs/event';

export enum ActivityState {
  ACTIVE,
  INACTIVE,
}

export type OnActivityListener = () => void;
export type OnChangeActivityStateListener = (newState: ActivityState) => void;

/**
 * Provides tracking and listening for user activity. Useful for detecting when the
 * user isn't actively doing something on the page.
 */
export class UserActivityService {
  /**
   * Event that is invoked whenever user activity is detected. Note that any subscribers
   * to this event will be triggered every single time there's activity. So, should the user
   * move their mouse, subscribers will be triggered for every move detected by the browser
   * along the user's mouse's path.
   *
   * Activity is triggered when the user moves their mouse, clicks their mouse, or upon releasing a keypress.
   */
  static onActivity = new Event<OnActivityListener>();
  /**
   * Event that is invoked when the user's activity changes from being active to inactive, or
   * vice versa.
   */
  static onChangeActivityState = new Event<OnChangeActivityStateListener>();

  private static _activityTimeout = -1;

  private static _activityTimeoutDuration = 3000;
  /**
   * The time in milliseconds it takes for the user to be considered inactive. Default is 3000ms (3 seconds).
   */
  public static get activityTimeoutDuration() {
    return this._activityTimeoutDuration;
  }
  public static set activityTimeoutDuration(newDuration: number) {
    clearTimeout(this._activityTimeout);

    this._activityTimeoutDuration = newDuration;

    this.replaceActivityTimeout();
  }

  private static _activityState: ActivityState;
  /**
   * The current state of user activity.
   */
  public static get activityState() {
    return this._activityState;
  }
  private static set activityState(newState: ActivityState) {
    const prevState = this._activityState;
    this._activityState = newState;

    if (newState !== prevState) {
      this.onChangeActivityState.trigger(newState);
    }

    if (newState === ActivityState.ACTIVE) {
      this.replaceActivityTimeout();
    }
  }

  private static replaceActivityTimeout() {
    clearTimeout(this._activityTimeout);

    this._activityTimeout = window.setTimeout(() => {
      this.activityState = ActivityState.INACTIVE;
    }, this._activityTimeoutDuration);
  }

  // TS refuses to compile a static class block for some reason, so we do this.
  private static _constructor = (() => {
    // Having this method be a method on the class results in it not having references.
    const handleActivity = () => {
      UserActivityService.activityState = ActivityState.ACTIVE;

      UserActivityService.onActivity.trigger();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    // Both keydown and keypress will continue to invoke as long as the key is held down,
    // which seems like an unnecessary amount of calls.
    window.addEventListener('keyup', handleActivity);
  })();
}
