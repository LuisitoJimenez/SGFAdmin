import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TableModel } from 'src/app/models/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() tableDefinition: TableModel = {} as TableModel;
  @Input() tableData: any[] = [];
  @Input() showActions: boolean = false;

  @Output() deleteItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() editItem: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<any[]>();
  displayedColumns: string[] = [];

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.tableData);
    if (changes['tableData'] && changes['tableData'].currentValue) {
      this.dataSource = new MatTableDataSource<any[]>(this.tableData);
      this.displayedColumns = this.tableDefinition.tableHeader;
      this.dataSource.paginator = this.paginator;
    }
  }

}



