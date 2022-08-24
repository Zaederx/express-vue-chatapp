import * as VueRouter from 'vue-router'
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
// create routes
const routes = [
    { path: '/', name:'Home', component:Home,
    children: [
                {path: '/home', name: 'Home', component:Home}
            ]
    },
    { path: '/about', name:'About', component:About},
    { path: '/login', name:'Login', component:Login , meta:{
        isAuthenticated : false
    }},
    { path: '/sign-up', name:'SignUp', component:SignUp},
    { path: '/user-chat', name:'ChatApp', component:ChatApp},
    { path: '/user-home', name:'UserHome', component: UserHome}
]
//add routes to Vue Router
const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: routes
})

router.beforeEach((to,from) => {
    if(to.name == 'UserHome' && (from.name = 'Login') && from.meta.isAuthenticated == true) 
    {
        true
    }
    else if (to.name == 'UserHome' && (from.meta = {})) {
        router.push('/login')
    }
    else
    {
        return true
    }
})

export default router