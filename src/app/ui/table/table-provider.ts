export class TableProvider<T> {
  constructor(
    public data: Array<T>,
    public fields: string[],
  ) {
  }
}
