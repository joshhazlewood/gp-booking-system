import { Medications } from "./medications";

export class ClinicalNotes {
    protected diagnosis: string;
    protected notes: string;
    protected last_accessed: Date;
    protected last_acc_by: number;
    protected medications: Medications[];

    constructor(diagnosis, notes, last_accessed, last_acc_by, medications) {
        this.diagnosis = diagnosis;
        this.notes = notes;
        this.last_accessed = last_accessed;
        this.last_acc_by = last_acc_by;
        this.medications = medications;
    }
}
