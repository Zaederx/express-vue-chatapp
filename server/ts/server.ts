//******** SECTION Imports ******* */

//project imports
import { loginLogic as emailPasswordLogin, loginViaSessionCookie, readSessionIdFromReq, sessionCookieLogin } from './controller-logic/login-logic.js';
import { fetchChats, fetchFriendNames as fetchFriendNamesHTML, fetchMessagesFromDb, fetchUserId, fetchUsersNames, chatMessagesToHTML } from './controller-logic/users-logic.js';
import { logout } from './controller-logic/logout-logic.js';
import  db  from './db/db-setup.js'
import { Chat } from './db/classes/Chat.js';
import { createChat, handleChatMessage, leaveChat } from './controller-logic/socket-logic.js'

//********** WebSocket *********** */
//@ts-ignore - http is found and works fine
import { createServer } from "http";
import { Server } from "socket.io";
//********** Express *********** */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf'

//@ts-ignore - 'process' is fine
export const PORT = process.env.PORT || 3000
export const serverDOMAIN = `http://localhost:${PORT}`
export const clientDOMAIN = 'https://localhost:5173'

const expServer = express();//create a server instance
const httpServer = createServer(expServer);///create http server instance
//create socket io websocket
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});

//start http server
httpServer.listen(PORT)

//@ts-ignore
import path from 'path';
//@ts-ignore
import {fileURLToPath} from 'url';
import { Friend } from './db/classes/Friend';

//path to current file
const __filename = fileURLToPath(import.meta.url);
//path to current directory
const __dirname = path.dirname(__filename);
console.log('directory-name 👉️', __dirname);
const dbPath = path.join(__dirname, '..', 'db.json');
console.log(`dbPath = ${dbPath}`)

const userDetails = 
{
    id:-1
}
 //on - recieves messages
//emit - sends messages
// io.to("some room").emit("some event", () => {console.log(message)});
// or socket.to("some room").emit("some event");
io.on("connection", (socket) => {
    console.log('\n\n\n\n******** SOCKET CONNECTED ********')
    socket.join(String(userDetails.id))
    console.log(`userDetails.id: ${userDetails.id}`)

    socket.on('create-join-chat', async (userId, selectedFriends, chatId) => 
    {
        //create chat and save them to user and friends in db
        var chat:Chat = await createChat(dbPath, userId, selectedFriends, chatId)
        //if chat is present
        if (chat != undefined) 
        {
            //join current user's socket to chat room
            socket.join(chat.id)
        }
        //let each friend refresh their browsers
        selectedFriends.forEach((friend:Friend) => {
            io.to(friend.id).emit('refresh-chats')
        })
        
    })
    
    //receive
    socket.on('chat', async (userId,chatId,messageText) => handleChatMessage(dbPath,io,userId,chatId,messageText))

    socket.on('join-chat', (chatId) => {
        console.log(`joining chat id:${chatId}. socket.join(${chatId})`)
        socket.join(chatId)
        io.to(chatId).emit('refresh-chats')
    })

    socket.on('leave-chat', async (userId, chatId) => 
    {
        console.log('leaving chat')
        await leaveChat(dbPath,io,userId,chatId)
    })

    //runs when the page disconnects
    socket.on("disconnecting", () => 
    {
        socket.rooms.forEach(room => 
        {
            console.log(`socket.room (chat): ${room}, was disconnected`);
        })
         // the Set contains at least the socket ID
    });
    
    socket.on("disconnect", () => {
        // socket.rooms.size === 0
        console.log(`socket.id:${socket.id}, is disconnected`)
    });
    

});

/****************** Express Server **************** */
const csrfProtection = csrf({
                            cookie:true,
                            // value: readTokenFromReq
                        })

/**
 * A function desiged to read the token from req object.
 * (because it potentially could be anywhere on the 
 * request object or under any heading)
 * Default function reads from several default location on req
 * This function specifies the one chosen location
 * @param req 
 */
function readTokenFromReq(req:any) 
{
    return req.headers['csrf-token'] as string
}
// server.set('trust proxy',1)
//@ts-ignore - works
expServer.use(cors(
    {
        credentials:true,
        origin: clientDOMAIN
    }
))

expServer.use(bodyParser.json());//for parsing application json
expServer.use(bodyParser.urlencoded({ extended:true }))//for parsing application/x-www-form-urlencoded
// server.use(multer.array());//for parsing multipart form data
expServer.use(cookieParser())//for parsing cookies
expServer.use(csrfProtection)

expServer.disable('x-powered-by')//remove defualt express header ad






/**
 * Provides CSRF token for the session.
 * 
 * NOTE FROM MDN WEBDOCS: The Access-Control-Allow-Origin response header 
 * indicates whether the response can be shared with 
 * requesting code from the given origin. (whether response can be viewed)
 * 
 * NOTE: The Access-Control-Allow-Credentials response header tells browsers whether
 *  to expose the response to the frontend JavaScript code (whether response can be interacted with)
 *  see [link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials#examples)
 */
expServer.get('/csrf-token', (req:any, res:any) => {
    //set access control origin
    const name = 'Access-Control-Allow-Origin'//
    const value:string = clientDOMAIN//clientDOMAIN
    res.setHeader(name,value)
    //set access control credentials
    res.setHeader('Access-Control-Allow-Credentials','true')
    //set csrf cookie
    const cookieName = 'csrfToken'
    const cookieValue = req.csrfToken()
    // var cookie = getAppCookie(cookieName,cookieValue,'localhost')
    // res.setHeader('Set-Cookie', [cookie.getCookieStr()])
    // cookie.print()
    //also add it in in the json for retrieval in js - needed to insert into meta tag
    return res.json({csrfToken:cookieValue})
})


expServer.get('/', (req:any, res:any) => 
{
    res.send('Hello World')
})

/**
 * Login in via session cookie
 */
expServer.post('/login-session-cookie', async (req:any, res:any) =>
{
    var sessionId = readSessionIdFromReq(req)
    userDetails.id =  await fetchUserId(sessionId,dbPath) as number
    loginViaSessionCookie(req,res)
})

/**
 * Login via email and password
 */
expServer.post('/login', async (req:any, res:any) => 
{
    var userId = await emailPasswordLogin(req,res) as number
    userDetails.id = Number(userId)
})

/**
 * Logout - removes the session cookie from the browser
 */
expServer.get('/logout', (req:any, res:any)=> {
    logout(req,res)
})


//TODO - Setup chat aspects of chat app - see [link](https://www.cometchat.com/tutorials/how-to-build-a-chat-app-with-websockets-and-node-js?utm_term=&utm_campaign=UK-+React+Chat+SDK&utm_source=adwords&utm_medium=ppc&hsa_acc=7711039152&hsa_cam=17296071286&hsa_grp=146623375104&hsa_ad=615146609899&hsa_src=g&hsa_tgt=dsa-1720747545788&hsa_kw=&hsa_mt=&hsa_net=adwords&hsa_ver=3&gclid=EAIaIQobChMIn6zR-e7S-QIVk813Ch0CRgEIEAAYASAAEgLeJfD_BwE)


//return first 10 users with names similar to set name
expServer.get('/get-users/with-name/:name', (req:any,res:any) => {
    fetchUsersNames(req,res,dbPath)
})

/**
 * Gets friends with a similiar name, from users list of friends, to the name the user gives. 
 */
expServer.get('/get-friends/with-name/:name', async (req:any,res:any) => {
    console.log('******* get friends with name called *******')
    var sessionId = readSessionIdFromReq(req)
    var userId = String(await fetchUserId(sessionId,dbPath))
    console.log(`userId:${userId}`)
    var name = req.params.name
    console.log(`name:${name}`)
    var friendsHTML = await fetchFriendNamesHTML(userId,name,dbPath)
    console.log(`friendsHTML:${friendsHTML}`)
    res.send(friendsHTML)
})

/**
 * Gets the current user's id
 */
expServer.get('/userId', async (req:any,res:any) => {
    console.log(`** GET /userId called **`)
    var sessionId = readSessionIdFromReq(req)
    var userId = await fetchUserId(sessionId,dbPath)
    res.send({userId:userId})
})

/**
 * chats get userId
 */
expServer.get('/chats/:userId', async (req:any,res:any) => {
    console.log('\n *** get /chats/:userId called ***')
    var userId = req.params.userId
    var chats:Chat[] = await fetchChats(userId,dbPath)
    if (chats.length > 0)
    {
        console.log('chats are present')
        res.send({res:true, chats:chats})
    }
    else
    {
        console.log('not chats are present')
        res.send({res:false, chats:chats})
    }
    
})

/**
 * Fetches messages from selected user chat
 */
expServer.get('/messages/:chatId/:userId', async (req:any,res:any) => 
{
    //get chatId and userId
    var chatId = req.params.chatId
    var userId = req.params.userId
    if (userId == '' || userId == undefined)
    {
        userId = readSessionIdFromReq(req)
    }
    //fetch messages from db
    db.read()
    var messages = await fetchMessagesFromDb(chatId, userId, dbPath)
    var messagesHTML = chatMessagesToHTML(messages, userId)

    res.send(messagesHTML)
})
