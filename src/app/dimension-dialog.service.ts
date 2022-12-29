import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Dimension } from './dimension';
import { DimensionFormComponent } from './dimension-form/dimension-form.component';

@Injectable({ providedIn: 'root' })
export class DimensionDialogService {
  constructor(private dialog: MatDialog) {}

  openUpdateDialog(dimension: Dimension): Observable<Dimension> {
    const dialogRef = this.dialog.open(DimensionFormComponent, {
      data: dimension,
    });
    return dialogRef.afterClosed();
  }

  openCreateDialog(): Observable<Dimension> {
    const dialogRef = this.dialog.open(DimensionFormComponent);
    return dialogRef.afterClosed();
  }
}
