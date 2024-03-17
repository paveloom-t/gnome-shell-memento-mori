import type St from "gi://St";

export class Panel extends St.Widget {
  addToStatusArea(role: string, indicator: St.Widget, position: number, box: string): typeof indicator;
}
