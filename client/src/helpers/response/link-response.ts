import { ServerResponse } from "./server-response.js"

export class LinkResponse extends ServerResponse 
{
    /**
     * Link of the next page to be loaded on client side
     */
    link:string

    constructor(res:boolean,message:string,link?:string)
    {
        super(res, message)
        this.link = link ? link : ''
    }
}