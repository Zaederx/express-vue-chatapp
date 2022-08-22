import { setSessionCookie } from "../helpers/cookie-defaults.js";
export function logout(req, res) {
    //set session cookie to null
    var sessionCookie = setSessionCookie(null);
    //set cookie in header
    res.setHeader('Set-Cookie', [sessionCookie.getCookieStr()]);
}
