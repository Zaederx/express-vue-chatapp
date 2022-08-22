import bcryptjs from 'bcryptjs';
import db from "../db/db-setup.js";
import { setSessionCookie } from '../helpers/cookie-defaults.js';
import { LoginResponse } from "../helpers/response/login-response.js";
import { clientDOMAIN } from '../server.js';
import { v4 as uuidv4 } from 'uuid';
export function loginViaSessionCookie(req, res) {
    var sessionId = readSessionIdFromReq(req);
    console.log(`sessionId:${sessionId}`);
    if (sessionId) {
        sessionCookieLogin(req, res, sessionId);
    }
    else {
        var message = 'Login unsuccessful';
        res.send(new LoginResponse(false, message));
    }
}
/**
 * Reads sessionId from the Express request object
 * @param req Express request object
 */
export function readSessionIdFromReq(req) {
    //remove empty spaces
    const matchAllSpaces = /\s+/g; //all empty spaces
    const emptyStr = '';
    var cookieStr = req.headers.cookie?.replace(matchAllSpaces, emptyStr).trim();
    //split the string where there are separators
    var cookies = cookieStr.split(';');
    //find the array index with the session id and return the string
    var sessionCookie = cookies.find((c) => c.includes('session'));
    //split it along the session name and equals sign
    var sessionIdArr = sessionCookie.split('session=');
    //the array position with something inside the string will be the session id
    var sessionId = sessionIdArr.find((c) => c.length > 0);
    console.log(`\ncookieStr:${cookieStr}`);
    return sessionId;
}
export async function sessionCookieLogin(req, res, sessionId) {
    console.log(`\n\n **** calling sessionCookieLogin function ***`);
    //find user with matching session id
    await db.read();
    const u = db.data.users.find((u) => u.sessionId == sessionId);
    console.log('user', u);
    //if user exists 
    if (u) {
        console.log('session cookie login');
        var response = true; //true when there is other data to return
        var message = 'Successfully logged in.';
        var link = ''; //e.g.'https://localhost/user-home'//(Optional) a link for http requesting data from node server
        var loginRes = new LoginResponse(response, message, u?.id, link);
        //new session id
        var sessionId = uuidv4(); //the cookie value 
        //store session id with user
        var stored = storeSessionId(u, sessionId);
        //check if it was stored successfully
        if (stored) {
            //set session cookie
            var sessionCookie = setSessionCookie(sessionId);
            //set cookie in header
            res.setHeader('Set-Cookie', [sessionCookie.getCookieStr()]);
        }
        //send response
        res.send(loginRes);
    }
    else {
        var message = 'Session Token Login Unsuccessful';
        res.send(new LoginResponse(false, message));
    }
}
/**
 * Logic for the login controller method
 * in the server response class
 * @param req express request object
 * @param res express response object
 */
export async function loginLogic(req, res) {
    console.log('\n ***** LOGIN LOGIC FUNCTION *****');
    //get variables from post request body
    //turn request into string
    var body = JSON.stringify(req.body);
    //turn string back into JS object - but now accessible (strange right...)
    var bodyJSON = JSON.parse(body);
    //get email and password
    const email = bodyJSON.email;
    const password = bodyJSON.password; //already hashed at client vue
    //print results to console
    console.log(`bodyJSON:${bodyJSON}`);
    console.log(`email:${email}`);
    console.log(`passwordHash:${password}`);
    //if variables are present / not undefined / empty
    if (email && password) {
        //check if email exists in db
        await db.read();
        const u = db.data.users.find((u) => u.email == email);
        console.log('\n email matches');
        var userPresent = false;
        if (u) {
            userPresent = true;
        }
        console.log(u);
        //fetch password from db
        //check whether password is present
        var matching = false;
        if (u?.passwordHash) {
            //check whether passwords match
            matching = bcryptjs.compareSync(password, u?.passwordHash);
        }
        //if password match - send session cookie and successful response
        if (matching && userPresent) {
            console.log('\n passwordHashes match');
            var response = true; //true when there is other data to return
            var message = 'Successfully logged in.';
            var link = ''; //'https://localhost/user-home'//(Optional)a link for http requesting data from node server
            var loginRes = new LoginResponse(response, message, u?.id, link);
            //create session id
            var sessionId = uuidv4(); //the cookie value
            //store session id with user
            var stored = storeSessionId(u, sessionId);
            console.log('user', u);
            if (stored) {
                //set session cookie
                var sessionCookie = setSessionCookie(sessionId);
                //set cookie in header
                res.setHeader('Set-Cookie', [sessionCookie.getCookieStr()]);
            }
            //set request access control to client domain
            const name = 'Access-Control-Allow-Origin';
            const value = clientDOMAIN;
            res.setHeader(name, value);
            //send response
            res.send(loginRes);
        }
        else {
            var message = 'Login unsuccessful';
            res.send(new LoginResponse(false, message));
        }
    }
}
/**
 * Stores the session id on a user
 * Assumes db.read() is already called on Low db object
 * @param user user to have the sessions stored on
 * @param sessionId sessionId to be stored with user
 */
function storeSessionId(user, sessionId) {
    //store session id with user
    user.sessionId = sessionId;
    //check if it has been stored in db
    db.read();
    const userCheck = db.data.users.find((u) => u.id == user.id);
    db.write(); // - causes duplicates - only use for new objects, bot updating objects
    var stored = false;
    //check if user session was properlys stored
    if (userCheck?.sessionId) {
        stored = true;
        console.log(`sessionId:${userCheck?.sessionId}, was properly stored`);
    }
    //return boolean value
    return stored;
}
