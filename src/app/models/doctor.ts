export class Doctor {
    /* tslint:disable:variable-name */
    public _id: string;
    public pretty_id: number;
    public forename: string;
    public surname: string;
    constructor(_id: string, pretty_id: number, forename: string, surname: string) {
        this._id = _id;
        this.pretty_id = pretty_id;
        this.forename = forename;
        this.surname = surname;
    }

    public getFullName(): string {
        const fullName = `${this.forename} ${this.surname}`;
        return fullName;
    }
}
