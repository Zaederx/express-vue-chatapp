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
                            value:
                        })
function 
server.use(cors())
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
 * requesting code from the given origin.
 */
server.get('/csrf-token', (req,res) => {
    //set access control
    const name = 'Access-Control-Allow-Origin'//
    const value = clientDOMAIN
    res.setHeader(name,value)
    //default way to pass csrf in Express
    const cookieName = '_csrf'
    const cookieValue = req.csrfToken()
    var cookie = getAppCookie(cookieName,cookieValue)
    res.setHeader('Set-Cookie', cookie.getCookieStr())
    res.setHeader('test_csrf',req.csrfToken())
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
server.post('/login', csrfProtection ,(req, res) => 
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
 * The inner workings are:
 * 
 * ```````````
 *  function getAppCookie(name:string, value:string)
{
    var cname = 'Express-Vue-ChatApp'
    var cvalue = ''
    var domain:string = `http://localhost:${PORT}`
    var path = '/'
    var expires:string|Date = new Date()
    var secure:boolean = false
    var httpOnly = true
    var sameSite:'strict'|'lax'|'none' = 'lax'
    var cookie = new Cookie(cname,cvalue,domain,path,expires,secure,httpOnly,sameSite)
    var cookieStr = cookie.getCookieStr()

    return cookieStr
}
 * `````````````
 */
export function getAppCookie(name:string, value:string):Cookie
{
    var cname = name
    var cvalue = value
    var domain:string = `http://localhost:${PORT}`
    var path = '/'
    var expires:string|Date|null = null
    var secure:boolean = false
    var httpOnly = true
    var sameSite:'strict'|'lax'|'none' = 'lax'
    var cookie = new Cookie(cname,cvalue,domain,path,expires,secure,httpOnly,sameSite)
    // var cookieStr = cookie.getCookieStr()

    return cookie
}