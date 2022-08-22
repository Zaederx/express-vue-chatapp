import { Cookie } from "../helpers/cookie"

function logout() 
{
    //set session cookie
    var sessionCookie:Cookie = setSessionCookie(null)
    //set cookie in header
    res.setHeader('Set-Cookie', [sessionCookie.getCookieStr()])
}