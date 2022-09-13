//bcryptjs
import bcryptjs from 'bcryptjs'
//express
//@ts-ignore
import { Request, ParamsDictionary, Response } from 'express-serve-static-core'
import { ParsedQs } from 'qs'
//uuidv4
import { v4 as uuidv4 } from 'uuid';
//project files
import { User } from "../db/classes/User.js"
import db from "../db/db-setup.js"
import { getAppCookie, setSessionCookie } from '../helpers/cookie-defaults.js'
import { LoginResponse } from "../helpers/response/login-response.js"
import { serverDOMAIN, clientDOMAIN } from '../server.js'
import { Cookie } from '../helpers/cookie.js'
import { fetchUserId } from './users-logic';

/**
 * Logs the user in via their session cookie.
 * First retreives session id from session cookie found in
 * the request object. It then passes this to the
 * sessionCookieLogin function.
 * 
 * @param req Express request object
 * @param res Express response object
 */
export function loginViaSessionCookie(req:Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,res: Response<any, Record<string, any>, number>) {
    var sessionId = readSessionIdFromReq(req)
    console.log(`sessionId:${sessionId}`)
    if (sessionId)
    {
        sessionCookieLogin(req,res,sessionId)
    }
    else{
        var message = 'Login unsuccessful'
        res.send(new LoginResponse(false, message))
    }
}


/**
 * Reads the session id from the Express request object.
 * 
 * @param req 
 */
export function readSessionIdFromReq(req:Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>):string
{
    console.log('*** readSessionIdFromReq called ***')
    //remove empty spaces
    const matchAllSpaces:RegExp = /\s+/g//all empty spaces
    const emptyStr = ''
    //@ts-ignore
    var cookieStr:string = req.headers.cookie?.replace(matchAllSpaces,emptyStr).trim() as string
    console.log(`cookieStr:${cookieStr}`)
    //split the string where there are separators
    var cookies:string[] = cookieStr.split(';')
    //find the array index with the session id and return the string
    var sessionCookie:string = cookies.find((c)=> c.includes('session')) as string
    //if theres a cookie
    if (sessionCookie) {
        //split it along the session name and equals sign
        var sessionIdArr = sessionCookie.split('session=');
        //the array position with something inside the string will be the session id
        var sessionId = sessionIdArr.find((c) => c.length > 0);
        console.log(`\ncookieStr:${cookieStr}`);
        return sessionId as string;
    }
    return 'no session cookie/id';
}


/**
 * Logins user in via session Id
 * @param req Express request object
 * @param res Express response object
 * @param sessionId sessionId
 */
export async function sessionCookieLogin(req:Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,res: Response<any, Record<string, any>, number>, sessionId:string)
{
    console.log(`\n\n **** calling sessionCookieLogin function ***`)

    //find user with matching session id
    await db.read()
    const u:User = db.data!.users.find((u:User)=> u.sessionId == sessionId) as User;
    console.log('user',u)

    //if user exists 
    if (u) 
    {
        console.log('session cookie login')
        var response = true//true when there is other data to return
        var message = 'Successfully logged in.'
        var link = '' //e.g.'https://localhost/user-home'//(Optional) a link for http requesting data from node server
        var loginRes = new LoginResponse(response, message, u?.id, link)
        //new session id
        var sessionId:string = uuidv4()//the cookie value 
        //store session id with user
        var stored = storeSessionId(u, sessionId)

        //check if it was stored successfully
        if (stored)
        {
            //set session cookie
            var sessionCookie:Cookie = setSessionCookie(sessionId)
            //set cookie in header 
            //@ts-ignore
            res.setHeader('Set-Cookie', [sessionCookie.getCookieStr()])
            //set authentication header
            //@ts-ignore
            res.setHeader('Authenticated','true')
        }
        //send response
        res.send(loginRes)
    }
    else 
    {
        var message = 'Session Token Login Unsuccessful'
        res.send(new LoginResponse(false, message))
    }
}


/**
 * Logic for the login controller method
 * in the server response class.
 * Logs user in via email and password found in
 * the request json body.
 * @param req express request object
 * @param res express response object
 * @return userId
 */
export async function emailPasswordLogin(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) 
{
    console.log('\n ***** LOGIN LOGIC FUNCTION *****')
    //get variables from post request body
    //turn request into string
    var body = JSON.stringify(req.body)
    //turn string back into JS object - but now accessible (strange right...)
    var bodyJSON = JSON.parse(body)
    //get email and password
    const email = bodyJSON.email
    const password = bodyJSON.password//already hashed at client vue

    //print results to console
    console.log(`bodyJSON:${bodyJSON}`)
    console.log(`email:${email}`)
    console.log(`passwordHash:${password}`)

    //if variables are present / not undefined / empty
    if (email && password) 
    {
        //*** check if email exists in db ***
        //read db and find the user by email
        await db.read()
        const u:User|undefined = db.data!.users.find((u:User)=> u.email == email)
        var userPresent = false
        try 
        {
            if (u)
            {
                userPresent = true
                console.log(u)
            }
            else 
            {
                throw Error(`No user present that matches email:${email}`)
            }
        }
        catch(e)
        {
            console.log(e)
        }
        var matching:boolean = false
        try 
        {
            //check whether password is present
            
            if (u?.passwordHash) 
            {
                //check whether passwords match
                matching = bcryptjs.compareSync(password, u?.passwordHash as string)
            }
            else
            {
                throw Error('User does not have a password')
            }
            if (!matching) { throw Error('Passwords do not match') }
        } 
        catch (e) 
        {
            console.log(e)
        }
        
        //if password match - send session cookie and successful response
        if (matching && userPresent) 
        {
            console.log('\n passwordHashes match')
            var response = true//true when there is other data to return
            var message = 'Successfully logged in.'
            var link = ''//'https://localhost/user-home'//(Optional)a link for http requesting data from node server
            var loginRes = new LoginResponse(response, message, u?.id, link)
            
            //create session id
            var sessionId:string = uuidv4()//the cookie value
            //store session id with user
            var stored = storeSessionId(u!,sessionId)

            if (stored)
            {
                //set/create session cookie
                var sessionCookie:Cookie = setSessionCookie(sessionId)
                //set session cookie in header
                //@ts-ignore
                res.setHeader('Set-Cookie', [sessionCookie.getCookieStr()])
                //set authentication header
                //@ts-ignore
                res.setHeader('Authenticated','true')
            }
            
            //set request access control to client domain
            const name = 'Access-Control-Allow-Origin'
            const value = clientDOMAIN
            //@ts-ignore
            res.setHeader(name, value)
            
            //send response
            res.send(loginRes)
        }
        else {
            var message = 'Login unsuccessful'
            res.send(new LoginResponse(false, message))
        }
        return u?.id
    }
    
}

/**
 * Stores the session id on a user, and stores this 
 * change in the database.
 * Assumes db.read() is already called on Low db object
 * @param user user to have the sessions stored on
 * @param sessionId sessionId to be stored with user
 */
function storeSessionId(user:User, sessionId: string)
{
    //store session id with user
    user.sessionId = sessionId
    db.write()
    var stored = false
    try 
    {
        //check if it has been stored in db
        db.read()
        const userCheck:User|undefined = db.data!.users.find((u:User)=> u.id == user.id)
        db.write()//sometimes causes duplicates - beware not for industrial projects
        
        
        //check if user session was properlys stored
        if (userCheck?.sessionId)
        {
            stored = true
            console.log(`sessionId:${userCheck?.sessionId}, was properly stored`)
            console.log('user',userCheck)
        }
        else
        {
            throw new Error('Session id was not stored properly')
        }
    }
    catch (e)
    {
        console.log(`Problem storing session id:`, e)
    }
    

    //return boolean value
    return stored
}

