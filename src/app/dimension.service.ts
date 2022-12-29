import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Dimension } from './dimension';

@Injectable({
  providedIn: 'root',
})
export class DimensionService {
  private readonly dimensions: Dimension[] = [];

  constructor() {
    for (let i = 1; i <= 5000; i++) {
      this.dimensions.push({
        key: `DM_0000${i}`,
        value: `value/${i}`,
        riskScore: `${i}.00`,
        visible: true,
        active: true,
      });
    }
  }

  fetchDimensions(): Observable<Dimension[]> {
    return of(this.dimensions);
  }
}
