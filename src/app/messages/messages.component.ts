import { Component, Input } from "@angular/core";

@Component({
  selector: "app-messages",
  styleUrls: ["./messages.component.css"],
  templateUrl: "./messages.component.html",
})
export class MessagesComponent {

  @Input() public messages: string[];

  /* tslint:disable:no-empty */
  constructor() { }
  /* tslint:enable:no-empty */
  public removeMsg(index) {
    this.messages.splice(index, 1);
  }

}
