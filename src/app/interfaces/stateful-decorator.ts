import { BehaviorSubject, Observable, of } from 'rxjs';

export class StatefulDecorator<T> {
  updatedData: T;
  constructor(public data: T) {}
}

export class Updatable<T> {
  readonly updatedData: BehaviorSubject<T>;
  readonly originalData: BehaviorSubject<T>;

  constructor(data: T) {
    this.updatedData = new BehaviorSubject<T>(null);
    this.originalData = new BehaviorSubject(data);
  }
}
