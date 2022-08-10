<template>
 <div id="footer" class="footer">
    <div class="section-links">
        <div class="blurb">
        <p>This is an exmaples site with and example footer. :)
            Now it's time for some Lorem...
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente cumque aperiam facere accusantium molestiae asperiores. Velit esse explicabo, nostrum, quae delectus illum ipsa eos architecto, voluptatem reiciendis qui soluta officia.
        </p>
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
    <div class="copyright">example copyright ChatApp Company</div>
 </div>
</template>

<style scoped>
.footer {
    height:300px;
    background-color: rgb(43, 44, 54);
    color: white;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: [section-links] 4fr [social-media] 4fr [copyright] 2fr;
    /* section 1-links,2-social,3-copyright notice */
}

.section-links {
    grid-row: 1;
    display: grid;
    grid-template-columns: 20% repeat(4,18%);
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
</style>