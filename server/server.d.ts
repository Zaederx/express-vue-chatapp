import { Cookie } from './helpers/cookie.js';
export declare const PORT: string | number;
export declare const serverDOMAIN: string;
export declare const clientDOMAIN = "http://localhost:5173";
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
export declare function getAppCookie(name: string, value: string): Cookie;
