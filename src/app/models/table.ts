export interface TableModel {
  tableHeader: string[];
  tableBody: TableBodyModel[];
}

export interface TableBodyModel {
  element: string;
}
