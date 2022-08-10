import { ServerResponse } from "./server-response.js";
export declare class LinkResponse extends ServerResponse {
    /**
     * Link of the next page to be loaded on client side
     */
    link: string;
    constructor(res: boolean, message: string, link?: string);
}
