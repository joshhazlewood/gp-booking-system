export class Address {
    protected line1: string;
    protected line2: string;
    protected town_city: string;
    protected postcode: string;

    constructor(line1, line2, town_city, postcode) {
        this.line1 = line1;
        this.line2 = line2;
        this.town_city = town_city;
        this.postcode = postcode;
    }
}
