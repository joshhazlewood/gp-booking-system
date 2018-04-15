import { Address } from "./address";

export class PatientProfile {

    /* tslint:disable:variable-name */
    constructor(public _id: string,
                public patientId: string,
                public forename: string,
                public surname: string,
                public username: string,
                public address: Address) {

    }
    /* tslint:enable:variable-name */
}
