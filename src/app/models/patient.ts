import { Address } from "./address";
import { ClinicalNotes } from "./clinical-notes";

/* tslint:disable:variable-name */
export class Patient {
    public clinical_notes: ClinicalNotes;
    private _id: string;
    private patient_id: number;
    private forename: string;
    private surname: string;
    private address: Address;
    private user_name: string;

    constructor(_id: string,
                patient_id: number,
                user_name: string,
                forename: string,
                surname: string,
                address: Address,
                clinical_notes: ClinicalNotes) {
            this._id = _id;
            this.patient_id = patient_id;
            this.user_name = user_name;
            this.forename = forename;
            this.surname = surname;
            this.address = address;
            this.clinical_notes = clinical_notes;
    }

    public getFullName(): string {
        const fullName = `${this.forename} ${this.surname}`;
        return fullName;
    }

}
