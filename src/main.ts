// import express from 'express'
// import App from './components/examples/App.vue'

// import './assets/main.css'
//home view
import Home from './pages/Home.vue'
import HeadScripts from './components/HeadScripts.vue'
import Banner from './components/Banner.vue'
import HomeMain from './components/HomeMain.vue'
import SiteFooter from './components/SiteFooter.vue'
//login view
import Login from './pages/Login.vue'
import LoginForm from './components/LoginForm.vue'
//about view
import About from './pages/About.vue'
import AboutSection from './components/AboutSection.vue'
//chat app
import ChatApp from './pages/user/ChatApp.vue'
import UserBanner from './components/UserBanner.vue'

//router
import Router from './components/Router.vue'
import { createApp } from 'vue'
// import VueRouter from 'vue-router'
//create routes
// const routes = [
//     { path: '/', component:Home},
//     { path: '/home', component:Home},
//     { path: '/about', component:About},
//     { path:'/login',component:Login},
//     { path:'/chat-app',component:ChatApp}
// ]
// //add routes to Vue Router

// const router = VueRouter.createRouter({
//     history: VueRouter.createWebHistory(),
//     routes: routes
// })

//set up app for fronend SPA (Single Page Application)
const app = createApp(Home)

//add main components globally
.component('HeadScripts', HeadScripts)
.component('Banner', Banner)
.component('HomeMain', HomeMain)
.component('SiteFooter', SiteFooter)
.component('LoginForm', LoginForm)
.component('AboutSection', AboutSection)
.component('UserBanner', UserBanner)
.component('Router', Router)


//add router to App
// .use(router)

//load app
.mount('#app')


// const app = createApp(Home)
// .component('HeadScripts', HeadScripts)
// .component('Banner', Banner)
// .component('HomeMain', HomeMain)
// .component('SiteFooter', SiteFooter)
// .mount('#app')