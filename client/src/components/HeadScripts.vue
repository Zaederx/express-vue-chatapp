<script setup lang="ts">

import { loginViaSessionCookie } from '@/helpers/login-form/login-helper';
import { onMounted } from 'vue'
import { useRouter, type Router } from 'vue-router'
import { useAuthenticationStore } from '../stores/isAuthenticated.js'
import { fetchCSRFToken, setHeadTags } from '../helpers/headscript/headscript-helper.js'


onMounted( async ()=> {

    //IMPORTANT check if there is a csrfToken present, if no - make a request

//making a request for a CSRF token
console.warn('************* HeadScript.vue script **************')

//fetches token and appends in meta tag in the header
fetchCSRFToken()
// set the rest of the head tags with dependencies
setHeadTags()


//how to reference router outside of setup script
// var router = this.$router
//get the router and auth store
var router = useRouter()
console.log('window on load called')
const proxyLoginUrl = '/api/login-session-cookie'
await loginViaSessionCookie(proxyLoginUrl, router)
//set value in session storage
//set value in session storage

var fiveMinutes = 60000 * 5
const authStore = useAuthenticationStore()
setInterval(async () => 
{
    console.log('double check session authentication')
    await loginViaSessionCookie(proxyLoginUrl, router)
    var authorised = authStore.checkAuth()
    if (!authorised && router.currentRoute.value.meta.requiresAuth) 
    {
        router.push('/login')
    }

}, fiveMinutes)


})

</script>




<template>
</template>