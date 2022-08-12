import bcryptjs from 'bcryptjs'
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
export function loginLogic(req:any, res:any) {
    //get variables from post request body
    const email = req.body.email
    const password = req.body.password

    //if variables are present / not undefined / empty
    if (email && password) 
    {
        //check if email exists in db
        const u:User|undefined = db.data!.users.find((u:User)=> u.email == email)
        //fetch password from db
        const passwordHash:string = bcryptjs.hashSync(password, 10)
        if (u?.passwordHash == passwordHash) 
        {
            var response = true//true when there is other data to return
            var message = 'Successfully logged in.'
            var link = ''//(Optional)a link for http requesting data from node server
            var serverRes = new LoginResponse(response, message, u?.id, link)
            //set app cookie
            var emailHash:string = bcryptjs.hashSync(email, 10)
            var cookieStr = getAppCookie(emailHash)
            res.setHeader('Set-Cookie', cookieStr)
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