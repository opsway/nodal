import {TableCellDef} from './table-cell-def';
import {PipeTransform} from '@angular/core';

export class TableProvider<T> {
  private transform: Map<string, PipeTransform[]>;

  constructor(
    private data: Array<T>,
    private cells: TableCellDef[],
  ) {
    this.transform = new Map();
    this.cells.forEach((def: TableCellDef) => {
      this.transform.set(def.name, def.transform || []);
    });
  }

  get fields(): string[] {
    return this.cells.map((def: TableCellDef) => def.name);
  }

  get rows(): any[] {
    return this.data
      .map((item: T) =>
        this.fields
          .reduce((cells: any[], field: string) => {
            cells.push(this.pipe(field, item[field]));
            return cells;
          }, [])
      );
  }

  static cellDef(
    name: string,
    pipe: PipeTransform[] = [],
  ): TableCellDef {
    return new TableCellDef(
      name,
      pipe,
    );
  }

  private pipe(defName: string, value: any): any {
    return this.transform
      .get(defName)
      .reduce((acc: any, cnt: PipeTransform) =>
        cnt.transform(acc), value
      );
  }
}
