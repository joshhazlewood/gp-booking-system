export class Appointment {
    // public appointment_id: number;
    // public patient_id: number;
    // public staff_id: number;
    // public start_time: Date;
    // public end_time: Date;
    //   add optional constructor values
    constructor( public patient_id: string,
        public staff_id: string, public start_time: Date, public end_time?: Date) {

    }
}
