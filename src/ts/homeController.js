"use strict";
exports.__esModule = true;
exports.home = void 0;
var Home_vue_1 = require("../pages/Home.vue");
var HeadScripts_vue_1 = require("../components/HeadScripts.vue");
var Banner_vue_1 = require("../components/Banner.vue");
var SiteFooter_vue_1 = require("../components/SiteFooter.vue");
var vue_1 = require("vue");
var server_renderer_1 = require("vue/server-renderer");
function home(req, res) {
    //PREPARE VIEW
    var homeViewApp = vue_1.createSSRApp(Home_vue_1["default"]);
    homeViewApp
        .component('HeadScripts', HeadScripts_vue_1["default"])
        .component('Banner', Banner_vue_1["default"])
        .component('SiteFooter', SiteFooter_vue_1["default"])
        .mount('#app'); //last thing to be called from app - sets app inside of HTML5 page
    server_renderer_1.renderToString(homeViewApp).then(function (html) {
        res.send(html);
    });
}
exports.home = home;
