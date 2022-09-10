<script setup lang="ts">import { fetchCSRFToken } from '@/helpers/headscript/headscript-helper.js';
import { loginViaSessionCookie } from '@/helpers/login-form/login-helper.js';
import router from '@/router';
import { useAuthenticationStore } from '@/stores/isAuthenticated';
import { onMounted } from 'vue';


onMounted( async () => {

    //IMPORTANT check if there is a csrfToken present, if no - make a request

    //making a request for a CSRF token
    console.warn('************* AjaxAuth.vue script **************')

    //fetches token and appends in meta tag in the header
    await fetchCSRFToken()

    console.log('window on load called')
    const proxyLoginUrl = '/api/login-session-cookie'
    await loginViaSessionCookie(proxyLoginUrl, router)
    
    
    //set value in session storage
    //set value in session storage

    const fiveMinutes = 60000 * 5
    setInterval(async () => 
    {
        
        const authStore = useAuthenticationStore()
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