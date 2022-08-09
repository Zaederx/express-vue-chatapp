import bcrypt from 'bcrypt'
import { User } from "../../db/classes/User.js"
import db from "../../db/db-setup.js"
import { LoginResponse } from "../response/login-response.js"

/**
 * Logic for the login controller method
 * in the server response class
 * @param req express request object
 * @param res express response object
 */
export function loginLogic(req,res) {
    //get variables from post request body
    const email = req.body.email
    const password = req.body.password

    //if variables are present / not undefined / empty
    if (email && password) 
    {
        //check if email exists in db
        const u:User = db.data.users.find((u:User)=> u.email == email)
        //fetch password from db
        const passwordHash = bcrypt.hashSync(password, 10)
        if (u.passwordHash == passwordHash) 
        {
            var response = true//true when there is other data to return
            var message = 'Successfully logged in.'
            var link = ''//(Optional)a link for http requesting data from node server
            var serverRes = new LoginResponse(response, message, u.id)
            res.send(serverRes)
        }
    }
    res.send(new LoginResponse(false))
}