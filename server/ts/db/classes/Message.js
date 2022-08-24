"use strict";
exports.__esModule = true;
exports.Message = void 0;
var Message = /** @class */ (function () {
    function Message(senderId, senderUsername, receiverId, message) {
        this.senderId = senderId;
        this.senderUsername = senderUsername;
        this.receiverId = receiverId;
        this.message = message;
    }
    return Message;
}());
exports.Message = Message;
