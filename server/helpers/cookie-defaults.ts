import { Cookie } from "./cookie"

/**
 * Returns a cookie that's had its 
 * fields set for this app. 
 * @param name name of the cookie
 * @param value value to be passed with cookie name
 * @param domain array of domain links that are permitted to use the cookie
 * The inner workings are:
 * 
 * ```````````
 *  function getAppCookie(name:string, value:string, domain:string):Cookie
{
    var cname = name
    var cvalue = value
    
    var cdomain = domain//which hosts can recieve a cookies
    var path = '/'
    var expires:string|Date|null = null
    var secure:boolean = true//i.e. use https
    var httpOnly = false
    var sameSite:'Strict'|'Lax'|'None' = 'None'
    var cookie = new Cookie(cname,cvalue,cdomain,path,expires,secure,httpOnly,sameSite)

    return cookie
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
    var secure:boolean = true//i.e. use https
    var httpOnly = false
    var sameSite:'Strict'|'Lax'|'None' = 'None'
    var cookie = new Cookie(cname,cvalue,cdomain,path,expires,secure,httpOnly,sameSite)

    return cookie
}