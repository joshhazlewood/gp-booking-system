import { Component } from "@angular/core";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { DataService } from "./services/data.service";

@Component({
  selector: "app-root",
  styleUrls: ["./app.component.css"],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  public title = "app";

  /* tslint:disable:no-empty */
  constructor() { }
  /* tslint:enable:no-empty */
}
