export class ServerResponse
{
    res:boolean
    message:string

    constructor(res:boolean, message:string)
    {
        this.res = res;
        this.message = message;
    }
}