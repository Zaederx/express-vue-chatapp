import { LinkResponse } from "./link-response.js";

export class LoginResponse extends LinkResponse
{ 
    userId:number

    /**
     * 
     * @param res (response) true when there is information on other the variables to return
     * @param message a message to be displayed on the client side
     * @param userId the user id of the current/logging in user
     * @param link (Optional) a link for http requesting data from node server
     */
    constructor(res:boolean, message:string, userId?:number, link?:string)
    {
        super(res, message, link);
        this.userId = userId != null ? userId : -1;//null check as id 0 returns false - tricky one :)
        this.link = link ? link : ''
    }
}