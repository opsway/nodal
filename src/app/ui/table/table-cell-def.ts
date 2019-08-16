import {PipeTransform} from '@angular/core';

export class TableCellDef {
  constructor(
    public name: string,
    public transform: PipeTransform[],
  ) {
  }
}
