import { Message } from './Message.js'
export class Chat 
{
    messages:Message[]

    constructor(messages:Message[])
    {
        this.messages = messages
    }
}