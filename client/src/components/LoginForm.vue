<script setup lang="ts" defer>
import { loginViaSessionCookie, loginViaEmailPassword } from '@/helpers/login-form/login-helper';
import { useAuthenticationStore } from '@/stores/isAuthenticated';
import { useRouter, type Router } from 'vue-router'
    var url = '/api/login'
    var router = useRouter()
</script>




<template>
    <div id="form-container" class="container form-control center">
        <form id="sign-up-form" class="form" action="#">
            <label for="email">Email</label>
            <input id="email" type="email" name="email" class="form-control"/>
            
            <label for="password">Password</label>
            <input id="password" type="password" name="password" class="form-control"/>

            
        </form>
        <button id="btn-login" class="btn btn-primary form-control" @click="loginViaEmailPassword(url,$router)">Login</button>
        <button id="btn-sign-up" class="btn btn-warning form-control" href="/sign-up">Sign Up</button>
    </div>
</template>

<style scoped>
@import url("../assets/form.css")
</style>