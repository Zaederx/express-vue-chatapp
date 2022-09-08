import { Friend } from "../db/classes/Friend.js"
import { v4 as uuidv4 } from 'uuid'
import db from "../db/db-setup.js"
import { User } from "../db/classes/User.js"
import { Chat } from "../db/classes/Chat.js"
import { Socket } from "engine.io"
import { Message } from "../db/classes/Message.js"
import { produceDb } from "./users-logic.js"
import { fileURLToPath } from "url"
import path from "path"


/**
 * Creates chats and adds them to users if no
 * of the same id already exists.
 * If a chat already exists of the same id,
 * is should return the existing chat.
 * @param userId user id of current user
 * @param selectedFriends selectedFriends
 * @param chatId chatId (if searching for and existing)
 */
export async function createChat(dbPath:string,userId:number, selectedFriends:Friend[], chatId?:string ):Promise<Chat>
{
    console.log('* create-join-chat called *');
    //generate chat id
    if (chatId == '' || chatId == undefined) {
        chatId = uuidv4();
    }
    var db = produceDb(dbPath)
    //read from db
    await db.read();
    //find user
    var user = db.data?.users.find((u) => u.id == userId) as User;
    //check if chat with same id exists
    var chat = user?.chats.find((chat) => chat.id == chatId) as Chat;
    //check if user already has this chat. If not / it is undefined...
    if (user != undefined && chat == undefined) 
    {
        //create a new chat room in data with chatId
        chat = new Chat(chatId);
        
        //add chat to selectedFriends
        // await db.read();
        //if there are firends added to list
        if (selectedFriends.length > 0) 
        {
            //for each friend
            selectedFriends.forEach(f => 
            {
                try 
                {
                    //add friend id to list of subscriber ids
                    chat?.subscriberIds.push(String(f.id));
                    
                } 
                catch (e)
                {
                    console.error('friend is undefined',e)
                }       
            });
            //then again for each firend
            selectedFriends.forEach(f => 
            {
                //add chat (now containing a full list of subscriberIds) to friend list of chats
                var friend = db.data?.users.find((u) => u.id == Number(f.id));
                if(friend != undefined) 
                {
                    friend.chats.push(chat);
                }
            })
            //add current user to chat subscribers
            chat.subscriberIds.push(String(user.id));
            var user = db.data?.users.find((u) => u.id == userId) as User;
            //add chat with subscriberIds to user
            user?.chats.push(chat);
            // db.write()
        }
        else if (user == undefined) 
        {
            console.log('* USER IS UNDEFINED! *')
            throw Error('* USER IS UNDEFINED! *')
        }
        
    }
    await db.write();
    return chat;
}

/**
 * Reads sessionId from the Express request object
 * @param socket socket.io socket
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

 /**
  * Takes a message and sends it to users subscribed to 
  * the currently selected chat
  * @param io the io Server listening on the connection
  * @param userId user id of the current user
  * @param chatId chat id of the currently selected chat
  * @param messageText the message text to be sent
  */
 export async function handleChatMessage(dbPath:string, io:any,userId:any,chatId:any,messageText:string) 
 {
    console.log('* chat called *')
        produceDb(dbPath)
        await db.read()
        
        //find the current user
        var user = db.data?.users.find((u) => u.id  == userId)
        //find their copy of the chat - to access chat subscribers
        var chat = user?.chats.find((chat) => chat.id == chatId)

        var m:any
        //for each subscriber...
        chat?.subscriberIds.forEach(async (subscriberId) => 
        {
            //find user
            user = db.data?.users.find((u) => u.id  == Number(subscriberId))
            //find their copy of the chat
            var chat = user?.chats.find((chat) => chat.id == chatId)
            //add message to their copy of the chat
            m = new Message(userId,user?.username as string, chat?.id as string, messageText)
            chat?.messages.push(m)
            await db.write()
        })

        //emit
        io.to(chatId).emit('message', m)
        console.log(`*emitting message to chatid: ${chatId}*`)
 }


/**
 * 
 */
 export async function leaveChat(dbPath:string, io:any, userId:string, chatId:string)
 {
    produceDb(dbPath)
    await db.read()

    //find the current user
    var user = db.data?.users.find((u) => u.id  == Number(userId))
    //find their copy of the chat - to access chat subscribers
    var chat = user?.chats.find((chat) => chat.id == chatId)

    var m:any
    //for each subscriber...
    chat?.subscriberIds.forEach(async (subscriberId) => 
    {
        //find user
        user = db.data?.users.find((u) => u.id  == Number(subscriberId))
        //find index of their copy of the chat
        var i = user?.chats.findIndex((chat) => chat.id == chatId) as number
        //remove chat from list of chats
        user?.chats.splice(i,0)
        await db.write()
    })
    io.to(chatId).emit('refresh-chats')
 }
