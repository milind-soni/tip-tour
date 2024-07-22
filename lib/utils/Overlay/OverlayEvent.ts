export class OverlayEvent extends Event {
  private data: any;

  constructor(eventName: string) {
    super(eventName);
  }

  getData(): any {
    return this.data;
  }

  dispatch(newData: any): void {
    // Don't dispatch if the data is the same
    if (JSON.stringify(newData) === JSON.stringify(this.data)) return;

    this.data = newData;
    document.dispatchEvent(this);
  }
}
