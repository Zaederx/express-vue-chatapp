import Home from '../pages/Home.vue'
import HeadScripts from '../components/HeadScripts.vue'
import Banner from '../components/Banner.vue'
import SiteFooter from '../components/SiteFooter.vue'

import { createSSRApp } from "vue"
import {renderToString } from "vue/server-renderer"

export function home(req:any, res:any) {
    //PREPARE VIEW
    const homeViewApp = createSSRApp(Home)
    homeViewApp
    .component('HeadScripts', HeadScripts)
    .component('Banner',Banner)
    .component('SiteFooter', SiteFooter)
    .mount('#app')//last thing to be called from app - sets app inside of HTML5 page
        renderToString(homeViewApp).then((html)=>{
            res.send(html);
        })
}