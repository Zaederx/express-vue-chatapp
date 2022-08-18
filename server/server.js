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
import { loginLogic } from './controller-logic/login-logic.js';
export const PORT = process.env.PORT || 3000;
export const serverDOMAIN = `http://localhost:${PORT}`;
export const clientDOMAIN = 'https://localhost:5173';
const keylist = ['ETwA@S!72', '83HWUW', 'ygT6tT9jNbCr'];
const keys = new KeyGrip(keylist);
const server = express(); //create a server instance
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
server.use(cors({
    credentials: true,
    origin: clientDOMAIN
}));
server.use(bodyParser.json()); //for parsing application json
server.use(bodyParser.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded
// server.use(multer.array());//for parsing multipart form data
server.use(cookieParser()); //for parsing cookies
server.use(csrfProtection);
//run server
server.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
    console.log(`csrf token at http://localhost:${PORT}/csrf-token`);
});
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
server.get('/csrf-token', (req, res) => {
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
server.get('/', (req, res) => {
    res.send('Hello World');
});
//TODO - ADD CONTROLLER FOR CSURF
//TODO - add login controller
server.post('/login', (req, res) => {
    console.log(`req.body:${req.body}`);
    console.log(`JSON.stringify(req.body):${JSON.stringify(req.body)}`);
    loginLogic(req, res);
});
// server.post('/login')
//TODO
