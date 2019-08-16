export class TableProvider<T> {
  constructor(
    public rows: Array<T>,
    public fields: string[],
  ) {
  }
}
