class Response {
    constructor(status, data = null, message = null) {
        this.status = status;
        this.data = data;
        this.message = message;
    }
}

module.exports = Response;
