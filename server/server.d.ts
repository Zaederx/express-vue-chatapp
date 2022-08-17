import { Cookie } from './helpers/cookie.js';
export declare const PORT: string | number;
export declare const serverDOMAIN: string;
export declare const clientDOMAIN = "http://localhost:5173";
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
export declare function getAppCookie(name: string, value: string, domain: string): Cookie;
