import type St from "gi://St";

export class ButtonBox extends St.Widget {}

export class Button extends ButtonBox {
  constructor(menuAlignment: number, nameText: string, dontCreateMenu: boolean);
}
