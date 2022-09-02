import { v4 as uuidv4 } from 'uuid';
import db from "../db/db-setup.js";
import { Chat } from "../db/classes/Chat.js";
/**
 * Creates chats and adds them to users.
 * @param userId user id of current user
 * @param selectedFriends selectedFriends
 * @param chatId chatId
 */
export async function createChat(userId, selectedFriends, chatId) {
    console.log('* create-join-chat called *');
    //generate chat id
    if (chatId == '' || chatId == undefined) {
        chatId = uuidv4();
    }
    //read from db
    await db.read();
    //find user
    var user = db.data?.users.find((u) => u.id == userId);
    //check if chat with same id exists
    var chat = user?.chats.find((chat) => chat.id == chatId);
    //check if user already has this chat. If not / it is undefined...
    if (chat == undefined) {
        //create a new chat room in data with chatId
        chat = new Chat(chatId);
        //add chat to user
        user?.chats.push(chat);
        await db.write();
        //add chat to selectedFriends
        if (selectedFriends.length > 0) {
            selectedFriends.forEach(f => {
                var friend = db.data?.users.find((u) => u.id == Number(f.id));
                //add chat to friend list of chats
                friend.chats.push(chat);
            });
        }
        await db.write();
        return chat;
    }
    return chat;
}
/**
 * Reads sessionId from the Express request object
 * @param req Express request object
 */
export function readSessionIdFromSocket(socket) {
    socket.io.engine.transport.on("pollComplete", () => {
        const request = socket.io.engine.transport.pollXhr.xhr;
        const cookieStr = request.getResponseHeader("set-cookie");
        console.log(`cookieStr:${cookieStr}`);
        //split the string where there are separators
        var cookies = cookieStr.split(';');
        //find the array index with the session id and return the string
        var sessionCookie = cookies.find((c) => c.includes('session'));
        //if theres a cookie
        if (sessionCookie) {
            //split it along the session name and equals sign
            var sessionIdArr = sessionCookie.split('session=');
            //the array position with something inside the string will be the session id
            var sessionId = sessionIdArr.find((c) => c.length > 0);
            console.log(`\ncookieStr:${cookieStr}`);
            return sessionId;
        }
    });
    return 'no session cookie/id';
}
