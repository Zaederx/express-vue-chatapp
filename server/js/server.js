//node imports
import express from 'express';
import bodyParser from 'body-parser';
//@ts-ignore
import multer from 'multer';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import KeyGrip from 'keygrip';
//project imports
import { loginLogic as emailPasswordLogin, loginViaSessionCookie } from './controller-logic/login-logic.js';
import { fetchUserId, fetchUsersNames } from './controller-logic/users-logic.js';
import { logout } from './controller-logic/logout-logic.js';
import { v4 as uuidv4 } from 'uuid';
import db from './db/db-setup.js';
export const PORT = process.env.PORT || 3000;
export const serverDOMAIN = `http://localhost:${PORT}`;
export const clientDOMAIN = 'https://localhost:5173';
//********** WebSocket *********** */
import { createServer } from "http";
import { Server } from "socket.io";
import { Chat } from './db/classes/Chat.js';
const expServer = express(); //create a server instance
const httpServer = createServer(expServer);
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});
httpServer.listen(3000);
// var userId
io.on("connection", (socket) => {
    console.log('******** SOCKET CONNECTED ********');
    //on - recieves messages
    //emit - sends messages
    // io.to("some room").emit("some event", () => {console.log(message)});
    // or socket.to("some room").emit("some event");
    socket.on('create-join-chat', async (userId, friendId) => {
        console.log();
        //generate chat id
        const chatId = uuidv4();
        //store chat id in user
        await db.read();
        //friend id
        var user = db.data?.users.find((u) => u.id === userId);
        var friend = db.data?.users.find((u) => u.id === friendId);
        var chat = user?.chats.find((chat) => chat.id == chatId);
        //if chat is undefined -create chat in db
        if (chat == undefined) {
            //create a new chat room in data with chatId
            chat = new Chat(chatId);
            //add chat to user and friend
            user?.chats.push(chat);
            friend?.chats.push(chat);
            db.write();
        }
        //otherwise just join that chat bu calling
        //socket.join and using chatId
        //subscribes user to a given channel
        socket.join(chatId);
    });
    //recieve
    socket.on('chat', (userId, chatId, message) => {
        //find chat
        db.read();
        var user = db.data?.users.find((u) => u.id == userId);
        var chat = user?.chats.find((chat) => chat.id == chatId);
        chat?.messages.push(message);
        db.write();
        //emit
        socket.to(chatId).emit('message', (message) => {
            console.log(message);
        });
    });
    socket.on("disconnecting", () => {
        console.log(socket.rooms); // the Set contains at least the socket ID
    });
    socket.on("disconnect", () => {
        // socket.rooms.size === 0
    });
});
// httpServer.listen(3001)
const keylist = ['ETwA@S!72', '83HWUW', 'ygT6tT9jNbCr'];
const keys = new KeyGrip(keylist);
const upload = multer({ dest: 'uploads/' }); //see- //TODO //IMPORTANT https://expressjs.com/en/resources/middleware/multer.html
const csrfProtection = csrf({
    cookie: true,
    value: readTokenFromReq
});
/**
 * A function desiged to read the token from req object.
 * (because it potentially could be anywhere on the
 * request object or under any heading)
 * Default function reads from several default location on req
 * This function specifies the one chosen location
 * @param req
 */
function readTokenFromReq(req) {
    return req.headers['csrf-token'];
}
// server.set('trust proxy',1)
expServer.use(cors({
    credentials: true,
    origin: clientDOMAIN
}));
expServer.use(bodyParser.json()); //for parsing application json
expServer.use(bodyParser.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded
// server.use(multer.array());//for parsing multipart form data
expServer.use(cookieParser()); //for parsing cookies
expServer.use(csrfProtection);
expServer.disable('x-powered-by'); //remove defualt express header ad
//run server
// server.listen(PORT, () => 
// {
//     console.log(`server listening on http://localhost:${PORT}`)
//     console.log(`csrf token at http://localhost:${PORT}/csrf-token`)
// })
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
expServer.get('/csrf-token', (req, res) => {
    //set access control origin
    const name = 'Access-Control-Allow-Origin'; //
    const value = clientDOMAIN; //clientDOMAIN
    res.setHeader(name, value);
    //set access control credentials
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    //set csrf cookie
    const cookieName = 'csrfToken';
    const cookieValue = req.csrfToken();
    // var cookie = getAppCookie(cookieName,cookieValue,'localhost')
    // res.setHeader('Set-Cookie', [cookie.getCookieStr()])
    // cookie.print()
    //also add it in in the json for retrieval in js - needed to insert into meta tag
    return res.json({ csrfToken: cookieValue });
});
expServer.get('/', (req, res) => {
    res.send('Hello World');
});
//TODO - ADD CONTROLLER FOR CSURF
//TODO - add login controller
expServer.post('/login-session-cookie', (req, res) => {
    loginViaSessionCookie(req, res);
});
expServer.post('/login', (req, res) => {
    emailPasswordLogin(req, res);
});
expServer.post('/logout', (req, res) => {
    logout(req, res);
});
//TODO - Setup chat aspects of chat app - see [link](https://www.cometchat.com/tutorials/how-to-build-a-chat-app-with-websockets-and-node-js?utm_term=&utm_campaign=UK-+React+Chat+SDK&utm_source=adwords&utm_medium=ppc&hsa_acc=7711039152&hsa_cam=17296071286&hsa_grp=146623375104&hsa_ad=615146609899&hsa_src=g&hsa_tgt=dsa-1720747545788&hsa_kw=&hsa_mt=&hsa_net=adwords&hsa_ver=3&gclid=EAIaIQobChMIn6zR-e7S-QIVk813Ch0CRgEIEAAYASAAEgLeJfD_BwE)
//return first 10 users with names similar to set name
expServer.get('/get-users/with-name/:name', (req, res) => {
    fetchUsersNames(req, res);
});
expServer.get('/get-friends/with-name/:name', (req, res) => {
});
expServer.get('/userId', (req, res) => {
    fetchUserId(req, res);
});
