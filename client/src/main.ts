// import express from 'express'
// import App from './components/examples/App.vue'

// import './assets/main.css'
//home view
import App from './pages/App.vue'
import Home from './pages/Home.vue'
import HeadScripts from './components/HeadScripts.vue'
import Banner from './components/Banner.vue'
import HomeMain from './components/HomeMain.vue'
import SiteFooter from './components/SiteFooter.vue'
//login view
import Login from './pages/Login.vue'
import LoginForm from './components/LoginForm.vue'

//sign up view
import SignUp from './pages/SignUp.vue'
import SignUpForm from './components/SignUpForm.vue'
//about view
import About from './pages/About.vue'
import AboutSection from './components/AboutSection.vue'
//chat app
import ChatApp from './pages/user/ChatApp.vue'
import UserBanner from './components/UserBanner.vue'
import UserHome from './pages/user/UserHome.vue'
import ChatWindow from './components/ChatWindow.vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from './router'
import { useAuthenticationStore } from './stores/isAuthenticated.js';

const pinia = createPinia()

//set up app for fronend SPA (Single Page Application)
const app = createApp(App)

//add main components globally
.component('Home', Home)
.component('HeadScripts', HeadScripts)
.component('Banner', Banner)
.component('HomeMain', HomeMain)
.component('SiteFooter', SiteFooter)
.component('LoginForm', LoginForm)
.component('SignUpForm', SignUpForm)
.component('AboutSection', AboutSection)
.component('UserBanner', UserBanner)
.component('ChatWindow', ChatWindow)

//add router & pinia to App
.use(router)
.use(pinia)

//load app
.mount('#app')

const authStore = useAuthenticationStore()

//Navigation Guard
router.beforeEach( (to) => {
    
    console.log(`router: authStore.isAuthenticated - ${authStore.isAuthenticated}`)
    if(to.name == 'UserHome' && !authStore.isAuthenticated) 
    {
        router.push('/login')
    }
    else if(to.name == 'UserChat' && !authStore.isAuthenticated) 
    {
        router.push('/login')
    }
    else {
        return true
    }
})

// const app = createApp(Home)
// .component('HeadScripts', HeadScripts)
// .component('Banner', Banner)
// .component('HomeMain', HomeMain)
// .component('SiteFooter', SiteFooter)
// .mount('#app')


// **********************
