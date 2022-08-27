import { Message } from './Message.js'
export class Chat 
{
    id:string;
    messages:Message[]

    constructor(id:string, messages:Message[])
    {
        this.id = id
        this.messages = messages
    }
}