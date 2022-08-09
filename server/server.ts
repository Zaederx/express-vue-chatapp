//node imports
import  * as express from 'express';
import bodyParser from 'body-parser';
//@ts-ignore
import multer from 'multer';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import csrf from 'csurf'
import $ from 'jquery'

//project imports
import db from '../db/db-setup'
import { User } from '../db/classes/User';
import { ServerResponse } from './response/server-response';

import { loginLogic } from './controller-logic/login-logic';

const server = express();//create a server instance

server.use(bodyParser.json());//for parsing application json
server.use(bodyParser.urlencoded({ extended:true }))//for parsing application/x-www-form-urlencoded
server.use(multer.array());//for parsing multipart form data
server.use(cookieParser())//for parsing cookies


var csrfProtection = csrf({cookie:true})

//Provide CSRF token for session
server.get('/csrf-token', csrfProtection, (req,res) => {
    return res.json({csrfToken:res.csrfToken()})
})

var csrfToken = $("meta[name='_csrf']").attr("content");
//set header as default for ajax - csrf
$.ajaxSetup({
    headers: {'X-CSRF-TOKEN':csrfToken},
})



//Secure POST request by validate CSRF token
// server.post('/example', csrfProtection, () => {
    // compare csrf tokens
// })

server.get('/', (req, res) => 
{
    res.send('Hello World')
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => 
{
    console.log(`server listening on port:${PORT}`)
})

//TODO - ADD CONTROLLER FOR CSURF


//TODO - add login controller
server.post('/login', csrfProtection ,(req, res) => loginLogic(req,res))
server.post('')

//TODO
