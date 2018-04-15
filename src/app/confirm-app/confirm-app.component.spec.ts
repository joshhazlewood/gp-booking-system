import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfirmAppComponent } from "./confirm-app.component";

describe("ConfirmAppComponent", () => {
  let component: ConfirmAppComponent;
  let fixture: ComponentFixture<ConfirmAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmAppComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
