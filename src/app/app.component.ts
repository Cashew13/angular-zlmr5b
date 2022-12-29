import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTable, MatTableDataSource } from '@angular/material/table';
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
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('originalTable') originalTablePaginator: MatPaginator;
  @ViewChild('updatedTable') updatedTablePaginator: MatPaginator;

  showUpdatedDimensionsTable: boolean = false;
  readonly originalTableDataSource = new MatTableDataSource<
    Updatable<Dimension>
  >([]);
  readonly updatedTableDataSource = new MatTableDataSource<
    Updatable<Dimension>
  >([]);
  readonly displayedColumns: string[] = [
    'key',
    'value',
    'riskScore',
    'active',
    'visible',
    'action',
  ];

  private dialRefSub: Subscription;
  private originalTableSub: Subscription;

  constructor(
    public dialog: MatDialog,
    public dimensionDialogService: DimensionDialogService,
    private dimensionService: DimensionService
  ) {}

  ngAfterViewInit(): void {
    this.originalTableDataSource.paginator = this.originalTablePaginator;
    this.updatedTableDataSource.paginator = this.updatedTablePaginator;
  }

  ngOnInit() {
    this.originalTableSub = this.dimensionService
      .fetchDimensions()
      .pipe(map((dms) => dms.map((d) => new Updatable(d))))
      .subscribe((dms) => {
        this.originalTableDataSource.data = dms;
      });
  }

  ngOnDestroy() {
    this.originalTableSub?.unsubscribe();
    this.dialRefSub?.unsubscribe();
  }

  openCreateDialog() {
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
    this.dialRefSub?.unsubscribe();

    const ref = this.dimensionDialogService.openUpdateDialog(
      dimension.updatedData.value ?? dimension.originalData.value
    );

    this.dialRefSub = ref.subscribe((d) => {
      if (!d) {
        return;
      }

      dimension.updatedData.next(d);
      const ups = this.updatedTableDataSource.data;

      if (!ups.find((d) => d === dimension)) {
        ups.push(dimension);
        this.updatedTableDataSource.data = [...ups];
        return;
      }

      if (this.isDimensionReverted(dimension)) {
        dimension.updatedData.next(null);
        this.updatedTableDataSource.data = ups.filter((d) => d !== dimension);

        if (this.updatedTableDataSource.data.length === 0) {
          this.showUpdatedDimensionsTable = false;
        }
        return;
      }
    });
  }

  revertChanges(dimension: Updatable<Dimension>): void {
    dimension.updatedData.next(null);
    const ups = this.updatedTableDataSource.data;
    this.updatedTableDataSource.data = ups.filter((d) => d !== dimension);

    if (this.updatedTableDataSource.data.length === 0) {
      this.showUpdatedDimensionsTable = false;
    }
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
