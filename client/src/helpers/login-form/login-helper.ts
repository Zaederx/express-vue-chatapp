import $ from 'jquery'
import bcryptjs from 'bcryptjs';
import { messageToHTML } from '@/helpers/message-to-html.js';
import type { LoginResponse } from '@/helpers/response/login-response.js';
import type { Router } from 'vue-router'
import { useAuthenticationStore } from '../../stores/isAuthenticated.js';

const serverDOMAIN = 'http://localhost:3000'
const clientDOMAIN = 'http://localhost:5173'



/**
 * Attempts to log the user in via email and password.
 * Client recieves session cookie upon successful authentication
 * @param url the url of the request to be made 
 * @param router the vue router to be used
 */
export function loginViaEmailPassword(url:string='/api/login', router:Router)
{
    const authStore = useAuthenticationStore()
    
    var token = {csrfToken:''}
    
    token.csrfToken = $("meta[name='csrf-token']").attr("content") as string;
    if(token.csrfToken == null || token.csrfToken == undefined) {

    }
    console.log(`Login Form setup script - csrfToken: ${token.csrfToken}`);
    console.log('Attempting to login')
    console.log(`document.cookie: ${document.cookie}`)
    console.log(`token.csrfToken: ${token.csrfToken}`)
    var email = $("#email").val() as string
    var password = $("#password").val() as string
    var data = {email:email, password:password}
    // var cookie = getAppCookie(cookieName,cookieValue)
    $.ajax({
        type:'POST',
        url: url,
        //accidentally sets Access-Control-Allow-Origins twice - setting it to *
        xhrFields:{
            withCredentials: true,//ignore cookies when false
        },
        beforeSend: (xhr) => {
            xhr.setRequestHeader('Access-Control-Allow-Origin','http://localhost:3000')
            xhr.setRequestHeader('CSRF-Token',token.csrfToken)
        },
        //IMPORTANT - HEADERS field doesnt work withCredentials = true
        //using beforeSend instead
        // headers: {
        //     'CSRF-Token':token.csrfToken,//NOT SURE SO SEND IT BOTH WAYS
        //},
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(data),
		success: (res:LoginResponse) => {
            const authenticated = true
            if(res.res == authenticated)
            {
                //set authentication store variable as true
                //set pinia store isAuthenticated = false

                //send user back to home page on successful authentication
                authStore.authenticate()
                router.push('/user-home')

                //print success message
                const message = `Welcome user:${res.userId}. You have succesfully logged in`
                console.log(message)
            }
            else {
                //unauthenicate
                authStore.unauthenticate()
                console.log('Log in unsuccessful')
            }
        },
		error: ()=>{
            const message = 'Login was unsuccessful'
            const html = messageToHTML(message)
            $('#errors').html(html)
            authStore.unauthenticate()
            console.log('Log in unsuccessful')
        }
	})


}

/**
 * Attempts to log user in via session cookie on the client broswer.
 * If valid session cookie is present and is sent along with a csrfToken
 * and _csrf cookie for CSRF protection, then the user is logged in
 * on the server side and given an update session cookie with a new id
 * 
 * NOTE: The Access-Control-Allow-Credentials response header tells browsers whether
 *  to expose the response to the frontend JavaScript code
 *  see [link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials#examples)
 */
export async function loginViaSessionCookie(url:string='/api/login-session-cookie', router:Router)
{
    const authStore = useAuthenticationStore()
    console.log('loginViaSessionCookie called')
    var token = {csrfToken:''}
    var responseObj = {isAuthenticated:false}
    token.csrfToken = $("meta[name='csrf-token']").attr("content") as string;
    if(token.csrfToken == null || token.csrfToken == undefined) {

    }
    console.log(`Login Form setup script - csrfToken: ${token.csrfToken}`);
    console.log('Attempting to login')
    console.log(`document.cookie: ${document.cookie}`)
    console.log(`token.csrfToken: ${token.csrfToken}`)
    var email = $("#email").val() as string
    var password = $("#password").val() as string
    var data = {email:email, password:password}
    // var cookie = getAppCookie(cookieName,cookieValue)
    return $.ajax({
        type:'POST',
        url: url,
        //accidentally sets Access-Control-Allow-Origins twice - setting it to *
        xhrFields:{
            withCredentials: true,//ignore cookies when false
        },
        beforeSend: (xhr) => {
            xhr.setRequestHeader('Access-Control-Allow-Origin','http://localhost:3000')
            xhr.setRequestHeader('CSRF-Token',token.csrfToken)
        },
        //IMPORTANT - HEADERS field doesnt work withCredentials = true
        //using beforeSend instead
        // headers: {
        //     'CSRF-Token':token.csrfToken,//NOT SURE SO SEND IT BOTH WAYS
        //},
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(data),
		success: (res:LoginResponse) => {
            const authenticated = true
            sessionStorage.setItem('auth', JSON.stringify({isAuthenticated:res.res}))
            if(res.res == authenticated)
            {

                authStore.authenticate()
                if (router.currentRoute.value.name == 'login')
                {
                    router.push('/user-home')
                }
                
                console.log(`userId: ${res.userId}`)
                const message = `Welcome user:${res.userId}. You have succesfully logged in`
            }
            else {
                authStore.unauthenticate()
                console.log('Log in unsuccessful')
            }
        },
		error: ()=>{
            const message = 'Login was unsuccessful'
            const html = messageToHTML(message)
            $('#errors').html(html)
            //set authentication false
            sessionStorage.setItem('auth', JSON.stringify({isAuthenticated:false}))
        }
	})
}
