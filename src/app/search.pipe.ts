import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "search",
})
export class SearchPipe implements PipeTransform {

  public transform(value: any, keys: string, term: string): any {

    /* tslint:disable:max-line-length*/
    if (!term) { return value; }
    return (value || []).filter((item) => keys.split(",").some((key) => item.hasOwnProperty(key) && new RegExp(term, "gi").test(item[key])));
  }

}
