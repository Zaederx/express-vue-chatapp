export class Friend {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
    toString() {
        var str = `Friend:{
            name:${this.name},
            id:${this.id}
        }`;
        return str;
    }
    equals(friend) {
        if (friend.name === this.name && friend.id === this.id) {
            console.log('*same friend*');
            return true;
        }
        else {
            console.log('*different friend*');
            return false;
        }
    }
}
