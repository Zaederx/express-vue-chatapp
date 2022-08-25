import { defineStore } from 'pinia'

export const useAuthenticationStore = defineStore('isAuthenticated',{
    state: () => { 
        return { isAuthenticated: false}
    },
    actions: {
        authenticate() {
            console.log('authStore.authenicate called')
            this.isAuthenticated = true
            console.log(`isAuthenticated:${this.isAuthenticated}`)
        },
        unauthenticate() {
            console.log('authStore.unauthenicate called')
            this.isAuthenticated = false
            console.log(`isAuthenticated:${this.isAuthenticated}`)
        }
    },
    getters: {
        
    }
})
