import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Dimension } from '../dimension';
import { Updatable } from '../interfaces/stateful-decorator';

@Component({
  selector: 'app-dimension-table',
  templateUrl: './dimension-table.component.html',
  styleUrls: ['./dimension-table.component.css'],
})
export class DimensionTableComponent implements OnInit {
  @Input()
  dataSource: MatTableDataSource<Updatable<Dimension>>;

  @Output()
  updateActionClick = new EventEmitter<Updatable<Dimension>>();

  @Output()
  revertActionClick = new EventEmitter<Updatable<Dimension>>();

  readonly displayedColumns: string[] = [
    'key',
    'value',
    'riskScore',
    'active',
    'visible',
    'action',
  ];

  constructor() {}

  ngOnInit() {}

  emitUpdateActionClick(arg: Updatable<Dimension>): void {
    this.updateActionClick?.emit(arg);
  }

  emitRevertActionClick(arg: Updatable<Dimension>): void {
    this.revertActionClick?.emit(arg);
  }
}
