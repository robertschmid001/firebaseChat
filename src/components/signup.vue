<template>
    <div id="signup">
        <h3>Let's create a new account...</h3>
        <input type="text" v-model="email" placeholder="Email"><br>
        <input type="password" v-model="password" placeholder="Password"><br>
        <button v-on:click="signUp">Sign up</button>
        <span>or go back to <router-link :to="{name: 'Login'}" >login</router-link>.</span>
    </div>
</template>
<script>
import firebase from 'firebase'

export default {
    name: 'Signup',
    data () {
        return {
            email: '',
            password:''
        }
    },
    methods: {
        signUp () {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(() => {
                this.$router.replace('chatrooms')
            },
            function (err) {
                alert('Oops!' + err.message)
            }
            );
        }
    }
}
</script>

<style lang="less" scoped>
#signup {
    margin-top: 40px;
    color: white;
    input {
        margin:  10px 0;
        width: 20%;
        padding: 15px;
        border-radius: 25px;
        border: none;
        min-width: 150px;
    }
    button {
        padding: 10px;
        color: white;
        font-weight: bold;
        border: none;
        border-radius: 22px;
        outline: 0;
        cursor: pointer;
        width: 100px;
        background-color:rgba(0, 0, 0, 0);
        border: 2px solid white;
    }
    button:hover {
        background-color: white;
        color: rgb(156, 121, 255);
    }
    span {
        display: block;
        margin-top: 20px;
        font-size: 11px;
    }
}
</style>