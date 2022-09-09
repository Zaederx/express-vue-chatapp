import { defineStore } from 'pinia'
import { watch, ref } from 'vue'
import { loginViaSessionCookie, loginViaEmailPassword } from '@/helpers/login-form/login-helper';

const auth = ref({ isAuthenticated: false})

//set value in session storage
export const useAuthenticationStore = defineStore('isAuthenticated', ()=> {

    console.log('window on load called')

    //else check if auth is in localStorage and get the value that was set
    if (sessionStorage.getItem("auth"))
    {
        console.log('\n getting auth from localStorage')
        auth.value = JSON.parse(sessionStorage.getItem("auth") as string)
    }
    
    //save auth default value ( { isAuthenticated: false}) to localStorage
    watch(auth,(authVal) => {
        console.log('setting auth in localStorage')
        sessionStorage.setItem('auth', JSON.stringify(authVal)),
        {deep:true}
    })
    function checkAuth()
    {
        auth.value = JSON.parse(sessionStorage.getItem("auth") as string)
        return auth
    }
    function authenticate() 
    {
        console.log('authStore.authenicate called')
        auth.value = {isAuthenticated : true}
        // sessionStorage.setItem('auth', JSON.stringify(auth.value))
        console.log(`isAuthenticated:${auth.value.isAuthenticated}`)
    }
    function unauthenticate() 
    {
        console.log('authStore.unauthenicate called')
        auth.value = {isAuthenticated : false}
        // sessionStorage.setItem('auth', JSON.stringify(auth.value))
        console.log(`isAuthenticated:${auth.value.isAuthenticated}`)
    }

    return { auth, checkAuth ,authenticate, unauthenticate }
})
