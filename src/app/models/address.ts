export class Address {
    /* tslint:disable:variable-name */
    public line1: string;
    public line2: string;
    public town_city: string;
    public postcode: string;

    constructor(line1, line2, town_city, postcode) {
        this.line1 = line1;
        this.line2 = line2;
        this.town_city = town_city;
        this.postcode = postcode;
    }
}
