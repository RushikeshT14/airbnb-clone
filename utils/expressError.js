class expresserrors extends Error {
    constructor(status, messsage) {
        super();
        this.statusCode = statusCode;
        this.message = messsage;

    }
}

module.exports = expresserrors;