<template>
 <div id="footer" class="footer">
    <div class="section-links">
        <div class="grid-item">
            <p>Home</p>
            <p>About</p>
            <p>Login</p>
        </div>
        <div class="grid-item">
            <p>Home</p>
            <p>About</p>
            <p>Login</p>
        </div>
        <div class="grid-item">
            <p>Home</p>
            <p>About</p>
            <p>Login</p>
        </div>
        <div class="grid-item">
            <p>Home</p>
            <p>About</p>
            <p>Login</p>
        </div>
    </div>
    <div class="social-media">
        <i class="fa fa-lg fa-facebook"></i>
        <i class="fa fa-lg fa-twitter"></i>
        <i class="fa fa-lg fa-google-plus"></i>
        <i class="fa fa-lg fa-instagram"></i>
    </div>
    <div class="copyright">
       <div> copyright ChatApp Company</div> 
    </div>
 </div>
</template>

<style scoped>
.footer {
    height:300px;
    background-color: rgb(43, 44, 54);
    color: white;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: [section-links] 3fr [social-media] 4fr [copyright] 3fr;
    /* section 1-links,2-social,3-copyright notice */
}

.section-links {
    grid-row: 1;
    display: grid;
    grid-template-columns: repeat(4,18%);
    grid-template-rows: auto;
    justify-content: center;
}

/* grid items */
.blurb {
    /* padding: 5px; */ /** it leaves an option white border line */ 
    margin-right: 50px;
}
.grid-item {
    display: grid;
    grid-template-columns: auto;
    margin:20px;
    height: 100px;
}

.social-media {
    grid-row: 2;
    background-color: rgb(26, 26, 32);
    color:white;
    display: grid;
    justify-content: center;
    grid-template-columns: [facebook] auto [twitter] auto [google] auto [instagram] auto;
    grid-template-rows: [single-row] auto;
}
.social-media > i {
    margin-top:25px;
    margin-left: 100px;
    font-size: 60px;
    cursor: pointer;
}
.copyright {
    grid-row: 3;
    background-color: rgb(4, 4, 5);
    color:white;
    display: grid;
    justify-content: center;
}

.copyright > div {
    margin-top: 25px;
}
</style>