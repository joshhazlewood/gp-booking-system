export class Appointment {
    /* tslint:disable:variable-name */
    constructor( public patient_id: string,
                 public staff_id: string, public start_time: Date, public end_time?: Date) {

    }
}
