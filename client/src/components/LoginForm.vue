<script setup lang="ts">
import $ from 'jquery'
import bcryptjs from 'bcryptjs';
import { messageToHTML } from '@/helpers/message-to-html.js';
import type { LoginResponse } from '@/helpers/response/login-response.js'
var csrfToken = $("meta[name='_csrf']").attr("content");
var btnLogin = document.querySelector('#btn-login') as HTMLScriptElement

btnLogin.onclick = () => login
//TODO - COMPLETE AJAX LOGIN REQUEST


/**
 * Function ensure that user credentials are authenticated.
 * If successful and credentials are valid, returns cookie to user session
 */
function login()
{
    console.log('Attempting to login')
    var email = $("#email").val()
    var password = $("#password").val() as string
    var passwordHash = bcryptjs.hashSync(password,10)
    var data = {email:email, password:passwordHash}
    $.ajax({
        type:'POST',
        url: 'https://localhost:3000/login',
        headers: {'X-CSRF-TOKEN':csrfToken},
		contentType: 'application/json;charset=utf-8;',
		dataType: 'json',
		data: data,
		success: (res:LoginResponse) => {
            const present = true
            if(res.res == present)
            {
                //TODO //IMPORTANT - CREATE/GIVE Authentication COOKIE TO CLIENT
                console.log(`userId: ${res.userId}`)
            }
            const message = `Welcome user:${res.userId}. You have succesffully logge ding`
            console.log()
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
        <form id="sign-up-form" class="form">
            <label for="email">Email</label>
            <input id="email" type="email" name="email" class="form-control"/>
            
            <label for="password">Password</label>
            <input id="password" type="password" name="password" class="form-control"/>

            <button id="btn-login" class="btn btn-primary form-control">Login</button>
            <button id="btn-sign-up" class="btn btn-warning form-control" href="/sign-up">Sign Up</button>
        </form>
    </div>
</template>

<style scoped>
@import url("../assets/form.css")
</style>