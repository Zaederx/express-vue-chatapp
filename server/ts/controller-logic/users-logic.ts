import { Chat } from '../db/classes/Chat'
import { Data } from '../db/classes/Data'
import { Message } from '../db/classes/Message'
import { User } from '../db/classes/User.js'
// import db from '../db/db-setup.js'
import { compareTwoStrings } from '../helpers/simplystring.js'
import { readSessionIdFromReq } from './login-logic.js'
//@ts-ignore
import path from 'path'
import { Low, JSONFile } from 'lowdb'
import { produceDb } from '../db/db-logic.js'



/**
 * Fetches chats from the database.
 * Uses user id to find mathcing user and
 * return their chats list
 * 
 * @param userId id of the user you want to find chats for
 */
export async function fetchChats(userId:any, dbPath:string):Promise<Chat[]>
{
    var db = produceDb(dbPath)
    await db.read()
    try 
    {
        //search for user with that id
        const user = db.data?.users.find((u) => u.id == userId) as User
        if (typeof user === undefined) { throw Error('User is undefined') }
        //if one exists return their chats list
        if (user != null && user != undefined)
        {
            return user.chats
        }
        //otherwise..
        return []//empty list
    }
    catch(e)
    {
        throw new Error('Problem fetching Chats:'+e)
    }
    
}

/**
 * Fetches user id from db, using session id found on
 * the requests session cookie.
 * @param req 
 */
export async function fetchUserId(sessionId:string, dbPath:string)
{
    var db = produceDb(dbPath)
    await db.read()
    console.log('*** fetchUserId called ***')
    console.log(`fetchUserId function -  sessionId:${sessionId}`)
    var user:User
    if(sessionId) 
    {
        await db.read()
       user = db.data?.users.find((u) => u.sessionId == sessionId) as User
       if (user != undefined) 
       {
        console.log('session id\'s match')
        return user.id
       }
       return false
    }
    else 
    {
        return false
    }
}

/**
 * 
 * @param userId id of the current user
 * @param friendName name of the friend they want to find
 */
export async function fetchFriendNames(userId: string, friendName:string, dbPath: string)
{
    var friends:User[] = await getFriendsWithSimilarName(userId, friendName, dbPath)
    var friendsHTML:string = friendsToHTML(friends)
    return friendsHTML
}

/**
 * Finds friends with names similar the given friend name
 * @param userId user id of current user who's freinds you want to search through
 * @param friendName name of friend they want to find
 */
export async function getFriendsWithSimilarName(userId:any, friendName:string, dbPath:string)
{
    var db = produceDb(dbPath)
    await db.read()
    //get user
    var user:User = db.data?.users.filter((u:User) => u.id == userId)[0] as User
    var friends:User[] = []
    var friendsWithSimilarNames:User[] = []
    if (user != undefined)
    {
        //get users friends
        user.friendIds.forEach((friendId) => {
            var u = db.data?.users.find((u:User) => u.id == friendId) as User
            friends.push(u)
        })
        //filter list to get up to 10 friends with similar names to var 'friendName'
        const limit = 10
        friendsWithSimilarNames = friends.filter((f) => compareTwoStrings(f.name,friendName) > 0.5).slice(0,limit) as User[]
    }
    else 
    {
        console.log(`user is undefined`)
    }
    
    return friendsWithSimilarNames
}

function friendsToHTML(friends:User[]):string
{
    var friendsHTML = ''
    friends.forEach((f)=> {
        friendsHTML += (`<a data-id="${f.id}"><div>${f.name}</div></a>\n`) as string
    })
    return friendsHTML
}

/**
 * Returns a json list of users who's names
 * match the request paramerter 'name'
 * @param req 
 * @param res
 * @param dbPath path to the dbString
 */
export async function fetchUsersNames(req:any,res:any, dbPath:string) {
    //get name from request params
    var name = req.params.name
    var namesArr:User[] = await getUserListOfSimilarNames(name,dbPath)
    var namesHTML = ''
    namesArr.forEach((u)=> {
        namesHTML += (`<a data-id="${u.id}"><div>${u.name}</div></a>\n`) as string
    })
    res.send(namesHTML)
}


/**
 * Returns a json list of up to 10 users who's names
 * are similar to the paramerter 'name'
 * @param req 
 * @param res 
 */
export async function getUserListOfSimilarNames(name:string, dbPath:string) {

    var db = produceDb(dbPath)
    //read from db
    await db.read()
    //find user from users database where the name is similar over 50%
    const limit = 10//number of names to return
    var arr:User[] = (db.data?.users.filter((user:User) =>  
        compareTwoStrings(name,user.name) >= 0.5))?.slice(0,limit) as User[]
    
    return arr
}

/**
 * Fetch messages from database.
 * @param chatId chat id of the user's chat
 * @param userId id of the user
 */
export async function fetchMessagesFromDb(chatId:string, userId:string, dbPath:string):Promise<Message[]>
{

    var db =  produceDb(dbPath)
    await db.read()
    var chatMessages:Message[] = []
    try 
    {
        //find user in db
        var user = db.data?.users.find((u:User) => u.id == Number(userId)) as User
        //find chat in list of user chats
        var chatMessages:Message[] = []
        if (user != undefined && user.chats.length > 0)
        {
            var chat = user.chats.find(c => c.id == chatId) as Chat
            chatMessages = chat.messages
        }
        
    }
    catch (e)
    {
        console.log('Problem fetching messages from db:', e)
    }
    //return chat messages
    return chatMessages
    
    
}

/**
 * Converts messages to HTML form ready with css classes
 * applied in order to display the message on the left of right
 * of the chat window. Messages sent by the current user are 
 * classes "message-sent" displayed on the right.
 * Other messages are classes "message-received" and are displayed on the left.
 * @param messages list of messages to convert to HTML
 * @param userId userId of current user
 */
export function chatMessagesToHTML(messages:Message[], userId:string) 
{
    var messagesHTML = ''
    messages.forEach(m => 
    {
        //if sent by user
        if (m.senderId == userId) 
        {
            messagesHTML += `<div class="message-sent">${m.message}</div>`
        }
        //if sent by anyone else
        else
        {
            messagesHTML += `<div class="message-received">${m.message}</div>`
        }
        
    })
    // if (messagesHTML == '') 
    // {
    //     messagesHTML = `<div class="notice">No Messages</div>`
    // }
    return messagesHTML
}


