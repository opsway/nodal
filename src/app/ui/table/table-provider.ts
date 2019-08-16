import {TableCellDef} from './table-cell-def';
import {PipeTransform} from '@angular/core';
import {TableCellValue} from './table-cell-value';

export class TableProvider<T> {
  constructor(
    private data: Array<T>,
    private columns: TableCellDef[],
  ) {
  }

  get headers(): string[] {
    return this.columns.map((def: TableCellDef) => def.header || def.field);
  }

  private get fields(): string[] {
    return this.columns.map((def: TableCellDef) => def.field);
  }

  get footers(): TableCellValue[] {
    const result = [];
    let footerIndex = 0;
    let colspanTotal = 0;
    let colspanOffset = 1;
    this.columns.forEach((def: TableCellDef, fieldIndex: number) => {
      if (def.footer === null) {
        return;
      }
      const colspan = fieldIndex - colspanTotal - footerIndex + colspanOffset;
      colspanTotal += colspan;
      colspanOffset++;
      result.push(new TableCellValue(
        def.footer !== '' ? this.pipe(fieldIndex, def.footer) : '',
        colspan,
      ));
      footerIndex++;
    });

    return result;
  }

  get rows(): any[] {
    return this.data
      .map((item: T) =>
        this.fields
          .reduce((cells: any[], field: string, fieldIndex: number) => {
            cells.push(this.pipe(fieldIndex, item[field]));
            return cells;
          }, [])
      );
  }

  static cellDef(name: string): TableCellDef {
    return new TableCellDef(name);
  }

  private pipe(fieldIndex: number, value: any): any {
    return this.columns[fieldIndex].pipes.reduce((acc: any, pipe: PipeTransform) =>
        pipe.transform(acc), value
      );
  }
}
