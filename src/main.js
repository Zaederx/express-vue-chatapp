"use strict";
exports.__esModule = true;
var express_1 = require("express");
var homeC = require("./ts/homeController");
var server = express_1["default"]();
//for fronend SPA (Single Page Application)
// const app = createApp(App)
// .mount('#app')
//for backend SSR (Server Side Rendering)
/**
 * //SECTION - Prepare the home view
 */
//Home View
server.get(['/', '/home'], homeC.home);
server.listen(3000, function () {
    console.log('listening on port 3000');
});
