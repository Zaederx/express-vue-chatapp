//node imports
import express from 'express';
import bodyParser from 'body-parser';
//@ts-ignore
import multer from 'multer';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import csrf from 'csurf';
import KeyGrip from 'keygrip';
//project imports
import { loginLogic } from './controller-logic/login-logic.js';
const PORT = process.env.PORT || 3000;
const keylist = ['ETwA@S!72', '83HWUW', 'ygT6tT9jNbCr'];
const keys = new KeyGrip(keylist);
var sessionCookie = cookieSession({
    name: 'ChatAppSession',
    keys: keys,
    maxAge: 1000 * 60 * 60 * 24,
    path: '/e-v-chat-app',
    domain: `http://localhost:${PORT}`,
    sameSite: 'lax',
    secure: false,
    httpOnly: true,
    signed: true,
    overwrite: true
});
console.log(sessionCookie);
const server = express(); //create a server instance
const upload = multer({ dest: 'uploads/' }); //see- //TODO //IMPORTANT https://expressjs.com/en/resources/middleware/multer.html
server.use(cors());
server.use(bodyParser.json()); //for parsing application json
server.use(bodyParser.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded
// server.use(multer.array());//for parsing multipart form data
server.use(cookieParser()); //for parsing cookies
var csrfProtection = csrf({ cookie: true });
//Provide CSRF token for session
//should be available without authentication
server.get('/csrf-token', csrfProtection, (req, res) => {
    const name = 'Access-Control-Allow-Origin';
    const value = 'http://localhost:5173';
    res.setHeader(name, value);
    return res.json({ csrfToken: req.csrfToken() });
});
// var csrfToken = $("meta[name='_csrf']").attr("content");
//set header as default for ajax - csrf
// $.ajaxSetup({
//     headers: {'X-CSRF-TOKEN':csrfToken}
// })
//Secure POST request by validate CSRF token
// server.post('/example', csrfProtection, () => {
// compare csrf tokens
// })
server.get('/', (req, res) => {
    res.send('Hello World');
});
server.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
    console.log(`csrf token at http://localhost:${PORT}/csrf-token`);
});
//TODO - ADD CONTROLLER FOR CSURF
//TODO - add login controller
server.post('/login', csrfProtection, (req, res) => loginLogic(req, res));
server.post('/login');
//TODO
