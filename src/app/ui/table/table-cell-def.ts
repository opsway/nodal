import {PipeTransform} from '@angular/core';

export class TableCellDef {
  constructor(
    public field: string,
    public header: string = null,
    public pipes: PipeTransform[] = [],
    public footer: any = null,
  ) {
  }

  withPipe(pipe: PipeTransform): TableCellDef {
    this.pipes.push(pipe);
    return this;
  }

  withHeader(header: string): TableCellDef {
    this.header = header;
    return this;
  }

  withFooter(footer: any): TableCellDef {
    this.footer = footer;
    return this;
  }
}
