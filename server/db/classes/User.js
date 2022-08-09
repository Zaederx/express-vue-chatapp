export class User {
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
    constructor(obj) {
        this.id = obj.id;
        this.email = obj.email;
        this.name = obj.name;
        this.username = obj.username;
        this.passwordHash = obj.password;
        this.friends = obj.friends ? obj.friends : [];
        this.chats = obj.chats ? obj.chats : [];
    }
}
