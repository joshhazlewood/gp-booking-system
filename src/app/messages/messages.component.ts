import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {

  @Input() messages: string[];

  constructor() { }

  removeMsg(index) {
    this.messages.splice(index, 1);
  }

}