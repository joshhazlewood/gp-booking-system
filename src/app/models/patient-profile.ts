import { Address } from './address';

export class PatientProfile {

    constructor(public _id: string,
        public patient_id: string,
        public forename: string,
        public surname: string,
        public username: string,
        public address: Address) {

    }
}
