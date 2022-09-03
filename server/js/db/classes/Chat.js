export class Chat {
    constructor(id, name, messages = [], subscriberIds = []) {
        this.id = id;
        this.name = `Chat${Chat.COUNT++}`;
        this.messages = messages;
        this.subscriberIds = subscriberIds;
    }
}
Chat.COUNT = 1; //better for users if it starts from 1, not 0
