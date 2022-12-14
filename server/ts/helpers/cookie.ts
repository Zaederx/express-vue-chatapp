/**
 * Class for representing and creating cookies. 
 * Cookies are essentially just strings with information separated by
 * semi-colons.
 * 
 * This call just help work as an API for creating those strings.
 * see 
 *  and [Cookies - runestone academy](https://runestone.academy/ns/books/published/webfundamentals/CGI/cookies.html) and [Link about testing cookie attributes](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/02-Testing_for_Cookies_Attributes)
 * and [Cookies - MZD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) and [Set-Cookie Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
 * for information about cookies
 * 
 * 
 */
export class Cookie {
    name:string
    value:string|null
    domain:string
    path:string
    expires:string|Date|null
    // size:string
    secure:boolean
    httpOnly:boolean
    sameSite:string

    /**
     * 
     * @param name name of the cookie
     * @param value value of the cookie - where you store user identifation like a username (can also be sotred as json string of useful information...useful to know- but carefull not to put anything too sensitive like passwords etc)
     * @param domain which site servers the cookie should be sent back to when browsing
     * @param path which path at the chosen domain should the cookie be sent to - '/' by default
     * @param expires when the cookie should expire / be deleted from browser
     * @param size size of the cookie
     * @param secure whether to use https or not (not being http instead)
     * @param httpOnly whether the cookie should be inaccessible to javascript
     * @param sameSite whether the cookies can be sent with cross site requests
     */
    constructor(name:string, value:string|null, domain:string, path?:string, expires?:string|Date|null, secure?:boolean, httpOnly?:boolean, sameSite?:'Strict'|'Lax'|'None'|null) {
        this.name = name
        this.value = value
        this.domain = domain 
        this.path = path ? path : '/'
        //set expiry date
        const d = new Date();
        const year = d.getFullYear()
        const month = d.getMonth()
        const day = d.getDate()
        const twoDaysTime = day + 3
        this.expires = expires != null ? expires : new Date(year,month,twoDaysTime)
        // this.size = size ? size : 
        this.secure = secure != null ? secure : false
        this.httpOnly = httpOnly ? httpOnly : false
        this.sameSite = sameSite != null ? sameSite : 'Lax'
    }




    getCookieStr() {
        var cookie:string = `${this.name}=${this.value};`

        cookie += `Domain=${this.domain};`
        cookie += `Path=${this.path};`
        cookie += `Expires=${(this.expires as Date).toUTCString()};`
        if (this.secure == true)
        {
            cookie +='Secure;'
        }
        if (this.httpOnly == true)
        {
            cookie += 'HttpOnly;'
        }
        cookie += `SameSite=${this.sameSite};`
        return cookie;
    }

    print() {
        console.log('\n'+`printing cookie:${this.getCookieStr()}`)
    }

    toString() {
        return this.getCookieStr()
    }
}