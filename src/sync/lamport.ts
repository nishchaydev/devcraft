/**
 * Lamport Clock & Device Identity Manager
 */

export class LamportClock {
  private static clock = 0;
  private static deviceId = '';

  public static getDeviceId(): string {
    if (!this.deviceId) {
      if (typeof window !== 'undefined' && window.localStorage) {
        let stored = localStorage.getItem('devcraft_device_id');
        if (!stored) {
          stored = 'device_' + Math.random().toString(36).substring(2, 9);
          localStorage.setItem('devcraft_device_id', stored);
        }
        this.deviceId = stored;
      } else {
        this.deviceId = 'device_node_' + Math.random().toString(36).substring(2, 7);
      }
    }
    return this.deviceId;
  }

  public static setDeviceId(id: string): void {
    this.deviceId = id;
  }

  public static tick(): number {
    this.clock += 1;
    return this.clock;
  }

  public static update(remoteClock: number): number {
    this.clock = Math.max(this.clock, remoteClock) + 1;
    return this.clock;
  }

  public static getClock(): number {
    return this.clock;
  }

  public static reset(val = 0): void {
    this.clock = val;
  }
}
