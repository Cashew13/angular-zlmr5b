import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, tap, of } from 'rxjs';
import { Dimension } from '../dimension';
import { DimensionService } from '../dimension.service';

@Component({
  selector: 'app-dimension-form',
  templateUrl: './dimension-form.component.html',
  styleUrls: ['./dimension-form.component.css'],
})
export class DimensionFormComponent implements OnInit {
  title: string = 'Create dimension';
  dimension: Dimension = {
    key: '',
    value: null,
    riskScore: null,
    active: false,
    visible: false,
  };
  form$: Observable<FormGroup>;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DimensionFormComponent>,
    private dimensionService: DimensionService,
    @Inject(MAT_DIALOG_DATA) private dm: Dimension
  ) {}

  ngOnInit() {
    // Dialog is for create.
    if (!this.dm) {
      this.form$ = of(
        this.formBuilder.group({
          key: [this.dimension.key],
          value: [this.dimension.value, [Validators.required]],
          riskScore: [this.dimension.riskScore, [Validators.required]],
          active: [this.dimension.active],
          visible: [this.dimension.visible],
        })
      );
      return;
    }

    this.title = `Update dimension: ${this.dm.key}`;
    this.form$ = of(this.dm).pipe(
      tap((d) => {
        this.dimension = d;
      }),
      map((d) => {
        return this.formBuilder.group({
          key: [d.key],
          value: [d.value, [Validators.required]],
          riskScore: [d.riskScore, [Validators.required]],
          active: [d.active],
          visible: [d.visible],
        });
      })
    );
  }

  save(o: FormGroup) {
    this.dialogRef.close(o.value);
  }

  close() {
    this.dialogRef.close();
  }
}
