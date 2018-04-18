import { Medications } from "./medications";

/* tslint:disable:variable-name */
export class ClinicalNotes {
    public diagnosis: string;
    public notes: string;
    public medications: Medications[];
    private last_accessed: Date;
    private last_acc_by: number;

    constructor(diagnosis, notes, last_accessed, last_acc_by, medications) {
        this.diagnosis = diagnosis;
        this.notes = notes;
        this.last_accessed = last_accessed;
        this.last_acc_by = last_acc_by;
        this.medications = medications;
    }
}
