import bcryptjs from 'bcryptjs'
import { Request, ParamsDictionary, Response } from 'express-serve-static-core'
import { ParsedQs } from 'qs'
import { User } from "../db/classes/User.js"
import db from "../db/db-setup.js"
import { LoginResponse } from "../helpers/response/login-response.js"
import { serverDOMAIN, getAppCookie, clientDOMAIN } from '../server.js'

/**
 * Logic for the login controller method
 * in the server response class
 * @param req express request object
 * @param res express response object
 */
export function loginLogic(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
    console.log('LOGIN LOGIC FUNCTION')
    //get variables from post request body
    const email = req.body.email
    const passwordHash = req.body.password//already hashed at client vue

    //log the cookie
    console.log(`req headers:${req.headers.cookie}`)
    //log csrf token
    console.log(`req headers: ${req.headers}`)

    //if variables are present / not undefined / empty
    if (email && passwordHash) 
    {
        //check if email exists in db
        const u:User|undefined = db.data!.users.find((u:User)=> u.email == email)
        //fetch password from db
        // const passwordHash:string = bcryptjs.hashSync(password, 10)
        if (u?.passwordHash == passwordHash) 
        {
            var response = true//true when there is other data to return
            var message = 'Successfully logged in.'
            var link = ''//(Optional)a link for http requesting data from node server
            var serverRes = new LoginResponse(response, message, u?.id, link)
            //set app cookie
            var cookieName = 'Express-Vue-ChatApp'//name
            var emailHash:string = bcryptjs.hashSync(email, 10)//value
            var cookie = getAppCookie(cookieName,emailHash)
            res.setHeader('Set-Cookie', cookie.getCookieStr())
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