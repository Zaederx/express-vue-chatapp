<script setup lang="ts" defer>
import $ from 'jquery'
import bcryptjs from 'bcryptjs';
import { messageToHTML } from '@/helpers/message-to-html.js';
import type { LoginResponse } from '@/helpers/response/login-response.js';


const serverDOMAIN = 'http://localhost:3000'
const clientDOMAIN = 'http://localhost:5173'
var token = {csrfToken:''}
window.onload = () => {
    token.csrfToken = $("meta[name='csrf-token']").attr("content") as string;
    console.log(`Login Form setup script - csrfToken: ${token.csrfToken}`);
}

//TODO - COMPLETE AJAX LOGIN REQUEST


/**
 * Function ensure that user credentials are authenticated.
 * If successful and credentials are valid, returns cookie to user session
 * 
 * NOTE: The Access-Control-Allow-Credentials response header tells browsers whether
 *  to expose the response to the frontend JavaScript code
 *  see [link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials#examples)
 */
function login(event:Event)
{
    console.log('Attempting to login')
    console.log(`cookies: ${document.cookie}`)
    var email = $("#email").val() as string
    var password = $("#password").val() as string
    var passwordHash = bcryptjs.hashSync(password,10)
    var data = {email:email, password:passwordHash}
    // var cookie = getAppCookie(cookieName,cookieValue)
    $.ajax({
        type:'POST',
        url: 'http://localhost:3000/login',
        //accidentally sets Access-Control-Allow-Origins twice - setting it to *
        // xhrFields:{
        //     withCredentials: true//ignore cookies when false
        // },
        headers: {
            // 'Cookie':document.cookie,//maybe express expects it as a cookie?
            'CSRF-Token':token.csrfToken,//NOT SURE SO SEND IT BOTH WAYS
            // 'XSRF-Token':token.csrfToken,//default header name used in Express
            },
		contentType: 'application/json;charset=utf-8;',
		dataType: 'json',
		data: JSON.stringify(data),
		success: (res:LoginResponse) => {
            const present = true
            if(res.res == present)
            {
                window.location.replace(res.link)
                //TODO //IMPORTANT - CREATE/GIVE Authentication COOKIE TO CLIENT
                console.log(`userId: ${res.userId}`)
            }
            const message = `Welcome user:${res.userId}. You have succesffully logge ding`
            console.log(message)
        },
		error: ()=>{
            const message = 'Login was unsuccessful'
            const html = messageToHTML(message)
            $('#errors').html(html)
        }
	})
}


</script>

<template>
    <div id="form-container" class="container form-control center">
        <form id="sign-up-form" class="form" action="#">
            <label for="email">Email</label>
            <input id="email" type="email" name="email" class="form-control"/>
            
            <label for="password">Password</label>
            <input id="password" type="password" name="password" class="form-control"/>

            
        </form>
        <button id="btn-login" class="btn btn-primary form-control" @click="login">Login</button>
        <button id="btn-sign-up" class="btn btn-warning form-control" href="/sign-up">Sign Up</button>
    </div>
</template>

<style scoped>
@import url("../assets/form.css")
</style>