import { Message } from './Message.js'
export class Chat 
{
    static COUNT = 1//better for users if it starts from 1, not 0
    id:string;
    name:string;
    messages:Message[]
    subscriberIds:string[]

    constructor(id:string, name?:string, messages:Message[]= [], subscriberIds:string[] = [])
    {
        this.id = id
        this.name = `Chat${Chat.COUNT++}`
        this.messages = messages
        this.subscriberIds = subscriberIds
    }
}