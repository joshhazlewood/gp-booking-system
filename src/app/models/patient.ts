import { ClinicalNotes } from './clinical-notes';
import { Address } from './address';

export class Patient {
    private patient_id: number;
    private forname: string;
    private surname: string;
    private address: Address;
    private clinical_notes: ClinicalNotes;
    private user_name: string;
    private password: string;

    constructor() {
    }
}
