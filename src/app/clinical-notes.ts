import { Medications } from "./medications";

export class ClinicalNotes {
    protected diagnosis: string[];
    protected notes: string;
    protected last_accessed: Date;
    protected last_acc_by: number;
    protected medications: Medications;
}
