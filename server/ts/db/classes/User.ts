import { Chat } from "./Chat.js";

export class User {
    static ID:number = 0;
    id:number;
    email:string;
    name:string;
    username:string;
    passwordHash:string;
    sessionId:string;
    friends:User[];
    chats:Chat[];
    


    /**
     * 
     * @param id 
     * @param email 
     * @param name 
     * @param username 
     * @param password
     * @param friends 
     * @param chats 
     */
    constructor(obj:{ email:string, name:string, username:string, password:string, friends?:User[], chats?:Chat[]}, sessionId?:string)
    {
        this.id = User.ID++;//auto incrementing id
        this.email = obj.email;
        this.name = obj.name;
        this.username = obj.username;
        this.passwordHash = obj.password;
        this.friends = obj.friends ? obj.friends : [];
        this.chats = obj.chats ? obj.chats : [];
        this.sessionId = sessionId ? sessionId : ''
    }

    toString(): string {
        var str = `User: {
            id: ${this.id},
            email: ${this.email},
            name: ${this.name},
            username: ${this.username},
            passwordHash: ${this.passwordHash},
            friends: ${this.friends.length},
            chats: ${this.chats.length},
            sessionId: ${this.sessionId}
        }`
        return str
    }
}