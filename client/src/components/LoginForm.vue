<script setup lang="ts" defer>
import $ from 'jquery'
import bcryptjs from 'bcryptjs';
import { messageToHTML } from '@/helpers/message-to-html.js';
import type { LoginResponse } from '@/helpers/response/login-response.js';
import { useRouter, type Router } from 'vue-router'
import { useAuthenticationStore } from '../stores/isAuthenticated.js';
//pinia stores

const serverDOMAIN = 'http://localhost:3000'
const clientDOMAIN = 'http://localhost:5173'

var router = useRouter()
const authStore = useAuthenticationStore()

/**
 * Attempts to log the user in via email and password.
 * Client recieves session cookie upon successful authentication
 * @param e user event of cliking the login button
 * @param url the url of the request to be made 
 */
function loginViaEmailPassword(e:Event, url:string='/api/login')
{
    
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
                authStore.authenticate()
                console.log(`authStore.setAuthenticated:${authStore.auth.isAuthenticated}`)
                router.push('/user-home')
                //TODO //IMPORTANT - CREATE/GIVE Authentication COOKIE TO CLIENT
                console.log(`userId: ${res.userId}`)
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
function loginViaSessionCookie(url:string='/api/login-session-cookie', router:Router)
{
    console.log('loginViaSessionCookie called')
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
                // window.location.replace(res.link) - messes with Vue - use router instead
                //set authentication store variable as true
                //set pinia store isAuthenticated = true
                authStore.authenticate()
                console.log(`authStore.setAuthenticated:${authStore.auth.isAuthenticated}`)
                router.push('/user-home')
                //TODO //IMPORTANT - CREATE/GIVE Authentication COOKIE TO CLIENT
                console.log(`userId: ${res.userId}`)
                const message = `Welcome user:${res.userId}. You have succesfully logged in`
                console.log(message)
            }
            else {
                //set pinia store isAuthenticated = false
                authStore.unauthenticate()
                console.log('Log in unsuccessful')
            }
        },
		error: ()=>{
            const message = 'Login was unsuccessful'
            const html = messageToHTML(message)
            $('#errors').html(html)
        }
	})
}

        console.log('window on load called')
        //how to reference router outside of setup script
        // var router = this.$router

        const proxyUrl = '/api/login-session-cookie'
        loginViaSessionCookie(proxyUrl, router)
</script>




<template>
    <div id="form-container" class="container form-control center">
        <form id="sign-up-form" class="form" action="#">
            <label for="email">Email</label>
            <input id="email" type="email" name="email" class="form-control"/>
            
            <label for="password">Password</label>
            <input id="password" type="password" name="password" class="form-control"/>

            
        </form>
        <button id="btn-login" class="btn btn-primary form-control" @click="loginViaEmailPassword">Login</button>
        <button id="btn-sign-up" class="btn btn-warning form-control" href="/sign-up">Sign Up</button>
    </div>
</template>

<style scoped>
@import url("../assets/form.css")
</style>