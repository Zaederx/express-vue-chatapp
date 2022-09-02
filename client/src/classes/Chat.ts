import { Message } from './Message.js'
export class Chat 
{
    static COUNT = 1//better for users if it starts from 1, not 0
    id:string;
    name:string;
    messages:Message[]

    constructor(id:string, name?:string, messages:Message[]= [])
    {
        this.id = id
        this.name = `Chat${Chat.COUNT++}`
        this.messages = messages
    }
}