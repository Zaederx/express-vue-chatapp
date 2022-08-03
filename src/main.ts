import express from 'express'

// import { createApp } from 'vue'
// import App from './components/examples/App.vue'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Home from './pages/Home.vue'
// import './assets/main.css'
import Banner from './components/Banner.vue'
import HeadScripts from './components/HeadScripts.vue'
import SiteFooter from './components/SiteFooter.vue'

import * as homeC from './ts/homeController'

const server = express()

//for fronend SPA (Single Page Application)
// const app = createApp(App)
// .mount('#app')
//for backend SSR (Server Side Rendering)




/**
 * //SECTION - Prepare the home view
 */



//Home View
server.get(['/','/home'], homeC.home)

server.listen(3000,()=> {
    console.log('listening on port 3000');
})