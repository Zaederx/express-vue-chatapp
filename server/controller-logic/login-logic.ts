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
    const passwordHash = bodyJSON.password//already hashed at client vue

    console.log(`body:${body}`)
    console.log(`bodyJSON:${bodyJSON}`)
    console.log(`email:${email}`)
    console.log(`passwordHash:${passwordHash}`)
    //if variables are present / not undefined / empty
    if (email && passwordHash) 
    {
        //check if email exists in db
        await db.read()
        const u:User|undefined = db.data!.users.find((u:User)=> u.email == email)
        console.log('\n email matches')
        //fetch password from db
        // const passwordHash:string = bcryptjs.hashSync(password, 10)
        if (u?.passwordHash == passwordHash) 
        {
            console.log('\n passwordHashes match')
            var response = true//true when there is other data to return
            var message = 'Successfully logged in.'
            var link = 'https://localhost/user-home'//(Optional)a link for http requesting data from node server
            var serverRes = new LoginResponse(response, message, u?.id, link)
            //set app cookie
            var cookieName = 'session'//name
            var sessionId:string = uuidv4()//the cookie value
            var cookie = getAppCookie(cookieName, sessionId, clientDOMAIN)
            res.setHeader('Set-Cookie', [cookie.getCookieStr()])

            //store session id with user
            u!.sessionId = sessionId
            db.write()


            const userCheck:User|undefined = db.data!.users.find((u:User)=> u.email == email)
            if (userCheck?.sessionId)
            {
                console.log(`sessionId:${userCheck?.sessionId}, was properly stored`)
            }
            
            //set domain access control
            const name = 'Access-Control-Allow-Origin'
            const value = clientDOMAIN
            res.setHeader(name, value)
            //set 
            res.send(serverRes)
        }
    }
    res.send(new LoginResponse(false))
}