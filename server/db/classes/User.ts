import { Chat } from "./Chat.js";

export class User {
    id:number;
    email:string;
    name:string;
    username:string;
    passwordHash:string;
    friends:User[];
    chats:Chat[]


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
    constructor(obj:{id:number, email:string, name:string, username:string, password:string, friends?:User[], chats?:Chat[]})
    {
        this.id = obj.id;
        this.email = obj.email;
        this.name = obj.name;
        this.username = obj.username;
        this.passwordHash = obj.password;
        this.friends = obj.friends ? obj.friends : [];
        this.chats = obj.chats ? obj.chats : [];
    }
}