export class TakenAppointment {
    public doctor_id: string;
    public start_time: Date;
    constructor(doctor_id: string, start_time: Date) {
        this.doctor_id = doctor_id;
        this.start_time = start_time;
    }
}
