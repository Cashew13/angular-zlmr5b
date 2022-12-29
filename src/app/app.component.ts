import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {
  Observable,
  map,
  of,
  tap,
  Subscription,
  filter,
  BehaviorSubject,
} from 'rxjs';
import { Dimension } from './dimension';
import { DimensionDialogService } from './dimension-dialog.service';
import { DimensionFormComponent } from './dimension-form/dimension-form.component';
import { DimensionService } from './dimension.service';
import { StatefulDecorator, Updatable } from './interfaces/stateful-decorator';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  tableDimensions$: Observable<StatefulDecorator<Dimension>[]> = of([]);
  ss: string[] = [];
  createdDimensions$: Observable<string[]> = of([]);

  updatedDimensions: BehaviorSubject<Updatable<Dimension>[]> =
    new BehaviorSubject([]);
  originalDimensions$: Observable<Updatable<Dimension>[]>;

  showUpdatedDimensionsTable: boolean = false;

  displayedColumns: string[] = [
    'key',
    'value',
    'riskScore',
    'active',
    'visible',
    'action',
  ];

  private sub: Subscription;

  constructor(
    public dialog: MatDialog,
    public dimensionDialogService: DimensionDialogService,
    private dimensionService: DimensionService
  ) {}

  ngOnInit() {
    this.tableDimensions$ = this.dimensionService
      .fetchDimensions()
      .pipe(map((dms) => dms.map((d) => new StatefulDecorator(d))));

    this.originalDimensions$ = this.dimensionService
      .fetchDimensions()
      .pipe(map((dms) => dms.map((d) => new Updatable(d))));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  openCreateDialog() {
    this.ss.push('123');
    // this.sub?.unsubscribe();
    // const ref = this.dimensionDialogService.openCreateDialog();
    // this.sub = ref.subscribe((d) => {
    //   // The dialog was closed.
    //   if (!d) {
    //     return;
    //   }

    //   // The save button was clicked.
    //   if (!this.createdDimensions$) {
    //     this.createdDimensions$ = of([JSON.stringify(d)]);
    //     return;
    //   }

    //   this.createdDimensions$ = this.createdDimensions$.pipe(
    //     map((dms) => dms.concat([JSON.stringify(d)]))
    //   );
    // });
  }

  openUpdateDialog(dimension: Updatable<Dimension>) {
    this.sub?.unsubscribe();

    const ref = this.dimensionDialogService.openUpdateDialog(
      dimension.updatedData.value ?? dimension.originalData.value
    );

    this.sub = ref.subscribe((d) => {
      if (!d) {
        return;
      }

      dimension.updatedData.next(d);
      const ups = this.updatedDimensions.value;
      
      if (!ups.find((d) => d === dimension)) {
        ups.push(dimension);
        this.updatedDimensions.next([...ups]);
        return;
      }

      if (this.isDimensionReverted(dimension)) {
        dimension.updatedData.next(null);
        this.updatedDimensions.next(ups.filter((d) => d !== dimension));
        this.showUpdatedDimensionsTable = this.updatedDimensions.value.length > 0;
        return;
      }
    });
  }

  revertChanges(dimension: Updatable<Dimension>): void {
    dimension.updatedData.next(null);
    const ups = this.updatedDimensions.value;
    this.updatedDimensions.next(ups.filter((d) => d !== dimension));
    this.showUpdatedDimensionsTable = this.updatedDimensions.value.length > 0;
  }

  private isDimensionReverted(dimension: Updatable<Dimension>): boolean {
    const original = dimension.originalData.value;
    const updated = dimension.updatedData.value;
    return (
      updated &&
      original &&
      updated.value === original.value &&
      updated.riskScore === original.riskScore &&
      updated.active === original.active &&
      updated.visible === original.visible
    );
  }
}
