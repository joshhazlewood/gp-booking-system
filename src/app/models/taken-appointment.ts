export class TakenAppointment {
    public doctor: string;
    public start_time: Date;
    constructor(doctor: string, start_time: Date) {
        this.doctor = doctor;
        this.start_time = start_time;
    }
}
