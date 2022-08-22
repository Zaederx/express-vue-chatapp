import { ServerResponse } from "./server-response.js";
export class LinkResponse extends ServerResponse {
    constructor(res, message, link) {
        super(res, message);
        this.link = link ? link : '';
    }
}
