class Response {
	constructor(status, message, data, success,timeStamp) {
		this.status = status;
		this.message = message || null;
		this.data = data || null;
		this.success = success || null;
		this.timeStamp=timeStamp || null;


		return {
			status,
			message,
			data,
			success,
			timeStamp
		};
	}
}
module.exports = Response;