<template>
    <div id="form-container" class="container form-control center">
            <form id="sign-up-form" class="form">
                <label for="email">Email</label>
                <input id="email" type="email" name="email" class="form-control"/>
                <label for="name">Name</label>
                <input id="name" type="text" name="name" class="form-control"/>
                <label for="password">Password</label>
                <input id="password" type="password" name="password" class="form-control"/>

                <button id="btn-sign-up" class="btn btn-primary">Sign Up</button>
                <button id="btn-login" class="btn btn-warning">Login</button>
            </form>
        
    </div>
</template>

<style scoped>
.form-control>label, .form-control>input
{
    width: 100%;
    display:block;

    justify-content:center;
}

.center
{
    display:grid;
    justify-content:center;
}
.top-spacing
{
    margin-top:100px
}
form
{
    width: 100%;
}

#form-container
{
    margin-top: 100px;
    max-height: 400px;
}
</style>