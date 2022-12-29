import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Dimension } from '../dimension';
import { Updatable } from '../interfaces/stateful-decorator';

@Component({
  selector: 'app-dimension-table',
  templateUrl: './dimension-table.component.html',
  styleUrls: ['./dimension-table.component.css'],
})
export class DimensionTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  emitUpdateActionClick(arg: Updatable<Dimension>): void {
    this.updateActionClick?.emit(arg);
  }

  emitRevertActionClick(arg: Updatable<Dimension>): void {
    this.revertActionClick?.emit(arg);
  }
}
