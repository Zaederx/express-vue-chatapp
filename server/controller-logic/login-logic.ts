import bcryptjs from 'bcryptjs'
import { Request, ParamsDictionary, Response } from 'express-serve-static-core'
import { ParsedQs } from 'qs'
import { User } from "../db/classes/User.js"
import db from "../db/db-setup.js"
import { getAppCookie } from '../helpers/cookie-defaults.js'
import { LoginResponse } from "../helpers/response/login-response.js"
import { serverDOMAIN, clientDOMAIN } from '../server.js'
import { v4 as uuidv4 } from 'uuid';
/**
 * Logic for the login controller method
 * in the server response class
 * @param req express request object
 * @param res express response object
 */
export async function loginLogic(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
    console.log('\n','LOGIN LOGIC FUNCTION')
    //get variables from post request body
    var body = JSON.stringify(req.body)
    var bodyJSON = JSON.parse(body)
    const email = bodyJSON.email
    const password = bodyJSON.password//already hashed at client vue

    console.log(`bodyJSON:${bodyJSON}`)
    console.log(`email:${email}`)
    console.log(`passwordHash:${password}`)
    //if variables are present / not undefined / empty
    if (email && password) 
    {
        //check if email exists in db
        await db.read()
        const u:User|undefined = db.data!.users.find((u:User)=> u.email == email)
        console.log('\n email matches')
        console.log(u)
        //fetch password from db
        const matching:boolean = bcryptjs.compareSync(password, u?.passwordHash as string)
        if (matching) 
        {
            console.log('\n passwordHashes match')
            var response = true//true when there is other data to return
            var message = 'Successfully logged in.'
            var link = 'https://localhost/user-home'//(Optional)a link for http requesting data from node server
            var loginRes = new LoginResponse(response, message, u?.id, link)
            //set app cookie
            var cookieName = 'session'//name
            var sessionId:string = uuidv4()//the cookie value
            var cookie = getAppCookie(cookieName, sessionId, 'localhost')
            res.setHeader('Set-Cookie', [cookie.getCookieStr()])

            //store session id with user
            u!.sessionId = sessionId
            db.write()

            //check if it has been stored in db
            db.read()
            const userCheck:User|undefined = db.data!.users.find((u:User)=> u.email == email)
            db.write()
            
            if (userCheck?.sessionId)
            {
                console.log(`sessionId:${userCheck?.sessionId}, was properly stored`)
                //TODO - CREATE SESSION COOKIE
            }
            //set session cookie
            var cname = 'session'
            var cvalue = sessionId
            var cdomain = 'localhost'
            var cookie = getAppCookie(cname, cvalue, cdomain)
            //change default for httpOnly setting
            cookie.httpOnly = true
            //set cookie in header
            res.setHeader('Set-Cookie', [cookie.getCookieStr()])

            //set domain access control
            const name = 'Access-Control-Allow-Origin'
            const value = clientDOMAIN
            res.setHeader(name, value)
            
            //send response
            res.send(loginRes)
        }
        else {
            res.send(new LoginResponse(false))
        }
    }
    
}