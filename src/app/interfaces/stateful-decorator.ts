import { BehaviorSubject } from 'rxjs';

export class Updatable<T> {
  readonly updatedData: BehaviorSubject<T | null>;
  readonly originalData: BehaviorSubject<T>;

  constructor(data: T) {
    this.updatedData = new BehaviorSubject<T>(null);
    this.originalData = new BehaviorSubject(data);
  }
}
