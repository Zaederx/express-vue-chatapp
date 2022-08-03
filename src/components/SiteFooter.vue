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
        
    </div>
    <div class="copyright">example copyright ChatApp Company</div>
 </div>
</template>

<style scoped>
.footer {
    background-color: rgb(43, 44, 54);
    color: white;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 70% 20% 10%;
    /* section 1-links,2-social,3-copyright notice */
}

.section-links {
    display: grid;
    grid-template-columns: 20% repeat(4,18%);
    grid-template-rows: auto;
    justify-content: center;
}

/* grid items */
.blurb {
    padding: 5px;
    margin: 10px;
    margin-right: 50px;
}
.grid-item {
    display: grid;
    grid-template-columns: auto;
    margin:20px;
}

.social-media {
    background-color: rgb(26, 26, 32);
    color:white;
}

.copyright {
    background-color: rgb(4, 4, 5);
    color:white;
}
</style>