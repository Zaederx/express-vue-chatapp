import { RESERVED_EVENTS } from 'socket.io/dist/socket'
import { Chat } from '../db/classes/Chat'
import { Message } from '../db/classes/Message'
import { User } from '../db/classes/User.js'
import db from '../db/db-setup.js'
import { compareTwoStrings } from '../helpers/simplystring.js'
import { readSessionIdFromReq } from './login-logic.js'





/**
 * Fetches chats from the database.
 * Uses user id to find mathcing user and
 * return their chats list
 * 
 * @param userId id of the user you want to find chats for
 */
export function fetchChats(userId:any)
{
    //search for user with that id
    const user = db.data?.users.find((u) => u.id == userId) as User
    //if one exists return their chats list
    if (user != null || user != undefined)
    {
        return user.chats
    }
    //otherwise..
    return []//empty list
}

/**
 * Fetches user id from db, using session id found on
 * the requests session cookie.
 * @param req 
 */
export function fetchUserId(req:any)
{
    console.log('*** fetchUserId called ***')
    var sessionId = readSessionIdFromReq(req)
    console.log(`fetchUserId function -  sessionId:${sessionId}`)
    var user:User
    if(sessionId) 
    {
       user = db.data?.users.find((u) => u.sessionId == sessionId) as User
       if (user != undefined) 
       {
        console.log('session id\'s match')
        return user.id
       }
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
export async function fetchFriendNames(userId: string, friendName: string)
{
    var friends:User[] = await getFriendsWithSimilarName(userId, friendName)
    var friendsHTML:string = friendsToHTML(friends)
    return friendsHTML
}

/**
 * Finds friends with names similar the given friend name
 * @param userId user id of current user who's freinds you want to search through
 * @param friendName name of friend they want to find
 */
export async function getFriendsWithSimilarName(userId:any, friendName:string)
{
    await db.read()
    //get user
    var user:User = db.data?.users.filter((u) => u.id == userId)[0] as User
    var friends:User[] = []
    var friendsWithSimilarNames:User[] = []
    if (user != undefined)
    {
        //get users friends
        user.friendIds.forEach((friendId) => {
            var u = db.data?.users.find(u => u.id == friendId) as User
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
 */
export async function fetchUsersNames(req:any,res:any) {
    //get name from request params
    var name = req.params.name
    var namesArr:User[] = await getUsersNamesListFromDB(name)
    var namesHTML = ''
    namesArr.forEach((u)=> {
        namesHTML += (`<a data-id="${u.id}"><div>${u.name}</div></a>\n`) as string
    })
    res.send(namesHTML)
}


/**
 * Returns a json list of users who's names
 * match the request paramerter 'name'
 * @param req 
 * @param res 
 */
export async function getUsersNamesListFromDB(name:string) {
    //read from db
    await db.read()
    //find user from users database where the name is similar over 50%
    const limit = 10//number of names to return
    var arr:User[] = (db.data?.users.filter((user:User) =>  
        compareTwoStrings(name,user.name) >= 0.5))?.slice(0,limit) as User[]
        //take list of users and create list of names
        var arrStr:string[] = [] 
        // arr.forEach(user => {
        //             // arrStr.push(user.name)
        //         })
        
    //convert array of names to json string
    // var usersJSON = JSON.stringify(arrStr)
    //send json list of namesof users
    return arr
}

/**
 * Fetch messages from database.
 * @param chatId chat id of the user's chat
 * @param userId id of the user
 */
export async function fetchMessagesFromDb(chatId:string, userId:string):Promise<Message[]>
{
    await db.read()
    //find user in db
    var user = db.data?.users.find(u => u.id == Number(userId)) as User
    //find chat in list of user chats
    var chatMessages:Message[] = []
    if (user != undefined && user.chats.length > 0)
    {
        var chat = user.chats.find(c => c.id == chatId) as Chat
        chatMessages = chat.messages
    }
    //return chat messages
    return chatMessages
}

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
        else
        {
            messagesHTML += `<div class="message-received">${m.message}</div>`
        }
        
    })
    if (messagesHTML == '') 
    {
        messagesHTML = `<div class="notice">No Messages</div>`
    }
    return messagesHTML
}


