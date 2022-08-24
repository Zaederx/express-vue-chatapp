"use strict";
exports.__esModule = true;
exports.User = void 0;
var User = /** @class */ (function () {
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
    function User(obj, sessionId) {
        this.id = User.ID++; //auto incrementing id
        this.email = obj.email;
        this.name = obj.name;
        this.username = obj.username;
        this.passwordHash = obj.password;
        this.friends = obj.friends ? obj.friends : [];
        this.chats = obj.chats ? obj.chats : [];
        this.sessionId = sessionId ? sessionId : '';
    }
    User.prototype.toString = function () {
        var str = "User: {\n            id: ".concat(this.id, ",\n            email: ").concat(this.email, ",\n            name: ").concat(this.name, ",\n            username: ").concat(this.username, ",\n            passwordHash: ").concat(this.passwordHash, ",\n            friends: ").concat(this.friends.length, ",\n            chats: ").concat(this.chats.length, ",\n            sessionId: ").concat(this.sessionId, "\n        }");
        return str;
    };
    User.ID = 0;
    return User;
}());
exports.User = User;
