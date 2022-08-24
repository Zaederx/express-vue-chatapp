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
import UserChat from './pages/user/ChatApp.vue'
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
    { path: '/user-chat', name:'UserChat', component:UserChat},
    { path: '/user-home', name:'UserHome', component: UserHome}
]
//add routes to Vue Router
const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: routes
})

router.beforeEach((to,from) => {

    //if heading to user pages and meta 'isAuthenticated' is present and true - allow it
    if(to.name == 'UserHome' && from.meta.isAuthenticated == true ||
    to.name == 'UserChat' && from.meta.isAuthenticated == true) 
    {
        true
    }
    //if heading to user pages and meta 'isAuthenticated' is present and false - redirect to login
    if(to.name == 'UserHome' && from.meta.isAuthenticated == false ||
    to.name == 'UserChat' && from.meta.isAuthenticated == false) 
    {
        router.push('/login')
    }
    //if heading to user pages and meta 'isAuthenticated' is not present. Don't allow it. Redirect to login
    else if (to.name == 'UserHome' && (from.meta = {}) || to.name == 'UserChat' && (from.meta = {})) 
    {
        router.push('/login')
    }
    //everything else allow it
    else
    {
        return true
    }
})

export default router