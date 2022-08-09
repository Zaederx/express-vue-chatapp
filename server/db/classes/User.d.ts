import { Chat } from "./Chat.js";
export declare class User {
    id: number;
    email: string;
    name: string;
    username: string;
    passwordHash: string;
    friends: User[];
    chats: Chat[];
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
    constructor(obj: {
        id: number;
        email: string;
        name: string;
        username: string;
        password: string;
        friends?: User[];
        chats?: Chat[];
    });
}
