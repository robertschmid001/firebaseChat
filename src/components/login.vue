<template>
    <div id="login">
        <h3>Care to Login?</h3>
        <input type="text" v-model="email" placeholder="Email"><br>
        <input type="password" v-model="password" placeholder="Password"><br>
        <button v-on:click="signIn">Connection</button>
        <p>Well, if you don't have an account, <router-link :to="{name:'Signup'}" class="router">create one</router-link>!</p>
   </div>
</template>
 <script>
import firebase from 'firebase'

export default {
    name: 'Login',
    data () {
        return {
            email: '',
            password:'',
        }
    },
    methods: {
        signIn () {
            firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(() => {
                this.$router.replace('chatrooms')
            },
            function (err) {
                alert('Oops!' + err.message)
            });
        }
    },
  computed: {
  },
}
</script>
<style lang="less" scoped>
#login {
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
    p {
        cursor: pointer;
        font-size: 11px;
    }
}
</style>

