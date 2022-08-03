import { createApp } from 'vue'
// import App from './App.vue'
import App from './Home.vue'
// import './assets/main.css'
import Banner from './components/Banner.vue'
import HeadScripts from './components/HeadScripts.vue'
import SiteFooter from './components/SiteFooter.vue'



const app = createApp(App)
// .mount('#app')

app
.component('Banner',Banner)
.component('HeadScripts', HeadScripts)
.component('SiteFooter', SiteFooter)

//last thing to be called from app
.mount('#app')