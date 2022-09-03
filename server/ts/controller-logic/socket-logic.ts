import { Friend } from "../db/classes/Friend.js"
import { v4 as uuidv4 } from 'uuid'
import db from "../db/db-setup.js"
import { User } from "../db/classes/User.js"
import { Chat } from "../db/classes/Chat.js"
import { Socket } from "engine.io"

/**
 * Creates chats and adds them to users.
 * @param userId user id of current user
 * @param selectedFriends selectedFriends
 * @param chatId chatId
 */
export async function createChat(userId:number, selectedFriends:Friend[], chatId?:string):Promise<Chat>
{
    console.log('* create-join-chat called *')
        //generate chat id
        if(chatId == '' || chatId == undefined) 
        {
            chatId = uuidv4()
        }
        
        //read from db
        await db.read()
        //find user
        var user:User = db.data?.users.find((u) => u.id == userId) as User
        //check if chat with same id exists
        var chat = user?.chats.find((chat)=> chat.id == chatId)

        //check if user already has this chat. If not / it is undefined...
        if (chat == undefined) 
        {
            //create a new chat room in data with chatId
            chat = new Chat(chatId)
            //add chat to user
            chat.subscriberIds.push(String(user.id))
            user?.chats.push(chat)
            
            await db.write()
            //add chat to selectedFriends
            await db.read()
            if (selectedFriends.length > 0)
            {
                selectedFriends.forEach(f => 
                {
                    var friend:User = db.data?.users.find((u) => u.id == Number(f.id)) as User
                    //add friend id to list of subscriber ids
                    chat?.subscriberIds.push(String(friend.id))
                    //add chat to friend list of chats
                    friend.chats.push(chat as Chat)
                })
            }
           await db.write()
           return chat
        } 
        return chat
}

/**
 * Reads sessionId from the Express request object
 * @param req Express request object
 */
 export function readSessionIdFromSocket(socket:any):string
 {
    socket.io.engine.transport.on("pollComplete", () => 
    {
        const request = socket.io.engine.transport.pollXhr.xhr;
        const cookieStr = request.getResponseHeader("set-cookie");

        console.log(`cookieStr:${cookieStr}`)
        //split the string where there are separators
        var cookies:string[] = cookieStr.split(';')
        //find the array index with the session id and return the string
        var sessionCookie:string = cookies.find((c)=> c.includes('session')) as string
        //if theres a cookie
        if (sessionCookie) 
        {
            //split it along the session name and equals sign
            var sessionIdArr = sessionCookie.split('session=');
            //the array position with something inside the string will be the session id
            var sessionId = sessionIdArr.find((c) => c.length > 0);
            console.log(`\ncookieStr:${cookieStr}`);
            return sessionId as string;
        }
    })
    return 'no session cookie/id';
 }