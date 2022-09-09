import { Cookie } from "../helpers/cookie.js";
import { setSessionCookie } from "../helpers/cookie-defaults.js"

/**
 * Logout functionality - sets session cookie null
 * @param req Express request object
 * @param res Express response object
 */
export function logout(req:any, res:any)
{
    //set session cookie to null
    var sessionCookie:Cookie = setSessionCookie(null)
    //set cookie in header
    res.setHeader('Set-Cookie', [sessionCookie.getCookieStr()])
}