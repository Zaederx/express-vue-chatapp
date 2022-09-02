export class Message
{
    senderId:string;
    senderUsername:string;
    receiverId:string;//can be the chatId if to a group
    message:string;

    constructor(senderId:string, senderUsername:string, receiverId:string, message:string)
    {
        this.senderId = senderId;
        this.senderUsername = senderUsername;
        this.receiverId = receiverId;
        this.message = message;
    }
}