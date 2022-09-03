//******** SECTION Imports ******* */

//node imports
import express from 'express';
import bodyParser from 'body-parser';
//@ts-ignore
import multer from 'multer';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf'
import $ from 'jquery'
import KeyGrip from 'keygrip'

import { Request, ParamsDictionary, Response } from 'express-serve-static-core'
import { ParsedQs } from 'qs'
//project imports
import { loginLogic as emailPasswordLogin, loginViaSessionCookie, readSessionIdFromReq, sessionCookieLogin } from './controller-logic/login-logic.js';
import { Cookie } from './helpers/cookie.js';
import { getAppCookie } from './helpers/cookie-defaults.js';
import { LoginResponse } from './helpers/response/login-response.js';
import { fetchChats, fetchFriendNames as fetchFriendNamesHTML, fetchMessagesFromDb, fetchUserId, fetchUsersNames, messagesToHTML } from './controller-logic/users-logic.js';
import { logout } from './controller-logic/logout-logic.js';

import  db  from './db/db-setup.js'
import { Friend } from './db/classes/Friend.js'


export const PORT = process.env.PORT || 3000
export const serverDOMAIN = `http://localhost:${PORT}`
export const clientDOMAIN = 'https://localhost:5173'



//********** WebSocket *********** */
import { createServer } from "http";
import { Server } from "socket.io";
import { Chat } from './db/classes/Chat.js';
import { User } from './db/classes/User';
import { createChat } from './controller-logic/socket-logic.js'
import { Message } from './db/classes/Message.js';
const expServer = express();//create a server instance
const httpServer = createServer(expServer);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
 });
 httpServer.listen(PORT)


// var userId
io.on("connection", (socket) => {
    console.log('\n\n\n\n******** SOCKET CONNECTED ********')

    //on - recieves messages
    //emit - sends messages
    // io.to("some room").emit("some event", () => {console.log(message)});
    // or socket.to("some room").emit("some event");
    socket.on('create-join-chat', async (userId, selectedFriends, chatId) => 
    {
        //create chat and save them to user and friends in db
        var chat:Chat = await createChat(userId, selectedFriends, chatId)
        //if chat is present
        if (chat != undefined) 
        {
            //join current user's socket to chat room
            socket.join(chat.id)
        }
        
    })

    socket.on('join-chat', (chatId) => {
        socket.join(chatId)
    })

    socket.on('join-invited-chats', async (userId)=> {
        await db.read()
        //find user in db
        var user:User = db.data?.users.find(u => u.id == userId) as User
        //subscribe user to chats on their chats list
        user.chats.forEach(c => socket.join(c.id))
    })
    
    //recieve
    socket.on('chat', async (userId,chatId,messageText) => {
        console.log('* chat called *')
        await db.read()
        
        //find the current user
        var user = db.data?.users.find((u) => u.id  == userId)
        //find their copy of the chat - to access chat subscribers
        var chat = user?.chats.find((chat) => chat.id == chatId)

        //for each subscriber...
        chat?.subscriberIds.forEach(async (subscriberId) => 
        {
            //find user
            user = db.data?.users.find((u) => u.id  == Number(subscriberId))
            //find their copy of the chat
            var chat = user?.chats.find((chat) => chat.id == chatId)
            //add message to their copy of the chat
            var m = new Message(userId,user?.username as string, chat?.id as string, messageText)
            chat?.messages.push(m)
            await db.write()
        })

        //emit
        // socket.to(chatId).emit('message', messageText)
    })

    
    socket.on("disconnecting", () => {
        console.log(`socket.rooms:${socket.rooms}`); // the Set contains at least the socket ID
    });
    
    socket.on("disconnect", () => {
        // socket.rooms.size === 0
    });
    

});

/****************** Express Server **************** */

const keylist = ['ETwA@S!72', '83HWUW', 'ygT6tT9jNbCr']
const keys = new KeyGrip(keylist)

const upload = multer({dest: 'uploads/'});//see- //TODO //IMPORTANT https://expressjs.com/en/resources/middleware/multer.html
const csrfProtection = csrf({
                            cookie:true,
                            value: readTokenFromReq
                        })

/**
 * A function desiged to read the token from req object.
 * (because it potentially could be anywhere on the 
 * request object or under any heading)
 * Default function reads from several default location on req
 * This function specifies the one chosen location
 * @param req 
 */
function readTokenFromReq(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>) 
{
    return req.headers['csrf-token'] as string
}
// server.set('trust proxy',1)
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
//run server






//Provide CSRF token for session
//should be available without authentication
/**
 * NOTE FROM MDN WEBDOCS: The Access-Control-Allow-Origin response header 
 * indicates whether the response can be shared with 
 * requesting code from the given origin. (whether response can be viewed)
 * 
 * NOTE: The Access-Control-Allow-Credentials response header tells browsers whether
 *  to expose the response to the frontend JavaScript code (whether response can be interacted with)
 *  see [link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials#examples)
 */
expServer.get('/csrf-token', (req:Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) => {
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


expServer.get('/', (req, res) => 
{
    res.send('Hello World')
})




//TODO - ADD CONTROLLER FOR CSURF


//TODO - add login controller
expServer.post('/login-session-cookie', (req:Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string,any>>) =>
{
    loginViaSessionCookie(req,res)
})

expServer.post('/login', (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string,any>>) => 
{
    emailPasswordLogin(req,res)
})


expServer.post('/logout', (req:Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string,any>>)=> {
    logout(req,res)
})


//TODO - Setup chat aspects of chat app - see [link](https://www.cometchat.com/tutorials/how-to-build-a-chat-app-with-websockets-and-node-js?utm_term=&utm_campaign=UK-+React+Chat+SDK&utm_source=adwords&utm_medium=ppc&hsa_acc=7711039152&hsa_cam=17296071286&hsa_grp=146623375104&hsa_ad=615146609899&hsa_src=g&hsa_tgt=dsa-1720747545788&hsa_kw=&hsa_mt=&hsa_net=adwords&hsa_ver=3&gclid=EAIaIQobChMIn6zR-e7S-QIVk813Ch0CRgEIEAAYASAAEgLeJfD_BwE)

//return first 10 users with names similar to set name
expServer.get('/get-users/with-name/:name', (req,res) => {
    fetchUsersNames(req,res)
})

expServer.get('/get-friends/with-name/:name', async (req,res) => {
    console.log('******* get friends with name called *******')
    var userId = String(fetchUserId(req))
    console.log(`userId:${userId}`)
    var name = req.params.name
    console.log(`name:${name}`)
    var friendsHTML = await fetchFriendNamesHTML(userId,name)
    console.log(`friendsHTML:${friendsHTML}`)
    res.send(friendsHTML)
})

expServer.get('/userId', (req,res) => {
    var userId = fetchUserId(req)
    res.send({userId:userId})
})

expServer.get('/chats/:userId', (req,res) => {
    console.log('\n *** get /chats/:userId called ***')
    var userId = req.params.userId
    var chats:Chat[] = fetchChats(userId)
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

expServer.get('/messages/:chatId/:userId', async (req,res) => 
{
    //get chatId and userId
    var chatId = req.params.chatId
    var userId = req.params.userId
    if (userId == '' || userId == undefined)
    {
        userId = readSessionIdFromReq(req)
    }
    //fetch messages from db
    var messages = await fetchMessagesFromDb(chatId, userId)
    var messagesHTML = messagesToHTML(messages, userId)

    res.send(messagesHTML)
})

