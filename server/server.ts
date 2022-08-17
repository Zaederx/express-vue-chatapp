//node imports
import express from 'express';
import bodyParser from 'body-parser';
//@ts-ignore
import multer from 'multer';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf'
import $ from 'jquery'
import KeyGrip from 'keygrip'

import { Request, ParamsDictionary, Response } from 'express-serve-static-core'
import { ParsedQs } from 'qs'
//project imports
import { loginLogic } from './controller-logic/login-logic.js';
import { Cookie } from './helpers/cookie.js';


export const PORT = process.env.PORT || 3000
export const serverDOMAIN = `http://localhost:${PORT}`
export const clientDOMAIN = 'http://localhost:5173'

const keylist = ['ETwA@S!72', '83HWUW', 'ygT6tT9jNbCr']
const keys = new KeyGrip(keylist)
const server = express();//create a server instance
const upload = multer({dest: 'uploads/'});//see- //TODO //IMPORTANT https://expressjs.com/en/resources/middleware/multer.html
const csrfProtection = csrf({
                            cookie:true,
                            value: readTokenFromReq
                        })

/**
 * A function desiged to read the token from req object.
 * (because it potentially could be anywhere on the 
 * request object or under any heading)
 * @param req 
 */
function readTokenFromReq(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>) 
{
    return req.headers['csrf-token'] as string
}
// server.set('trust proxy',1)
server.use(cors(
    {
        credentials:true
    }
))
server.use(bodyParser.json());//for parsing application json
server.use(bodyParser.urlencoded({ extended:true }))//for parsing application/x-www-form-urlencoded
// server.use(multer.array());//for parsing multipart form data
server.use(cookieParser())//for parsing cookies
server.use(csrfProtection)


//run server
server.listen(PORT, () => 
{
    console.log(`server listening on http://localhost:${PORT}`)
    console.log(`csrf token at http://localhost:${PORT}/csrf-token`)
})





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
server.get('/csrf-token', (req:Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) => {
    //set access control origin
    const name = 'Access-Control-Allow-Origin'//
    const value:string[] = []
    value[0] = clientDOMAIN//clientDOMAIN
    res.setHeader(name,value)
    //set access control credentials
    res.setHeader('Access-Control-Allow-Credentials','true')
    //set csrf cookie and test cookie
    const cookieName = 'csrfToken'
    const cookieValue = req.csrfToken()
    var cookie = getAppCookie(cookieName,cookieValue,clientDOMAIN)
    res.setHeader('Set-Cookie', [cookie.getCookieStr()])
    cookie.print()
    //also add it in in the json for retrieval in js - needed to insert into meta tag
    return res.json({csrfToken:req.csrfToken()})
})




// var csrfToken = $("meta[name='_csrf']").attr("content");
//set header as default for ajax - csrf
// $.ajaxSetup({
//     headers: {'X-CSRF-TOKEN':csrfToken}
// })



//Secure POST request by validate CSRF token
// server.post('/example', csrfProtection, () => {
    // compare csrf tokens
// })

server.get('/', (req, res) => 
{
    res.send('Hello World')
})




//TODO - ADD CONTROLLER FOR CSURF


//TODO - add login controller
server.post('/login', (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string,any>>) => 
{
    loginLogic(req,res)
})
// server.post('/login')

//TODO

/**
 * Returns a cookie that's had its 
 * fields set for this app. 
 * @param name name of the cookie
 * @param value value to be passed with cookie name
 * @param domain array of domain links that are permitted to use the cookie
 * The inner workings are:
 * 
 * ```````````
 *  function getAppCookie(name:string, value:string, domain:string)
{
    var cname = name
    var cvalue = value
    var cdomain:string = domain
    var path = '/'
    var expires:string|Date = new Date()
    var secure:boolean = false
    var httpOnly = true
    var sameSite:'strict'|'lax'|'none' = 'none'
    var cookie = new Cookie(cname,cvalue,cdomain,path,expires,secure,httpOnly,sameSite)
    var cookieStr = cookie.getCookieStr()

    return cookieStr
}
 * `````````````
 */
export function getAppCookie(name:string, value:string, domain:string):Cookie
{
    var cname = name
    var cvalue = value
    
    var cdomain = domain//which hosts can recieve a cookies
    var path = '/'
    var expires:string|Date|null = null
    var secure:boolean = false
    var httpOnly = false
    var sameSite:'Strict'|'Lax'|'None' = 'None'
    var cookie = new Cookie(cname,cvalue,cdomain,path,expires,secure,httpOnly,sameSite)
    // var cookieStr = cookie.getCookieStr()

    return cookie
}