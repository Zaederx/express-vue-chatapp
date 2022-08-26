import { defineStore } from 'pinia'
import { watch, ref , computed } from 'vue'

const auth = ref({ isAuthenticated: false})
export const useAuthenticationStore = defineStore('isAuthenticated', ()=> {

    
    //check if auth is in localStorage
    if (sessionStorage.getItem("auth"))
    {
        console.log('\n getting auth from localStorage')
        auth.value = JSON.parse(sessionStorage.getItem("auth") as string)
    }
    
    //save auth default value ( { isAuthenticated: false}) to localStorage
    watch(auth.value,(authVal) => {
        console.log('setting auth in localStorage')
        sessionStorage.setItem('auth', JSON.stringify(authVal)),
        {deep:true}
    })
    

    function authenticate() {
            console.log('authStore.authenicate called')
            auth.value.isAuthenticated = true
            console.log(`isAuthenticated:${auth.value.isAuthenticated}`)
        }
    function unauthenticate() 
    {
        console.log('authStore.unauthenicate called')
        auth.value.isAuthenticated = false
        console.log(`isAuthenticated:${auth.value.isAuthenticated}`)
    }

    return { auth, authenticate, unauthenticate }
})
