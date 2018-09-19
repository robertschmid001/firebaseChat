<template>
    <div id="Navbar">
        <ul class="left-side-nav">
            <li><a href="http://robertschmid.fr/#/">Website</a></li>
            <li><router-link :to="{ name: 'Chatrooms'}">Chatrooms</router-link></li>

        </ul>
        <ul class="right-side-nav">
            <li v-if="user"><a>{{ user.email }}</a></li>
            <li v-if="user"><a @click="logout">Logout</a></li>
            <li v-if="!user"><router-link :to="{ name: 'Signup'}">Signup</router-link></li>
            <li v-if="!user"><router-link :to="{ name: 'Login'}">Login</router-link></li>
        </ul>
    </div>
</template>
<script>
import firebase from 'firebase'

export default {
    name: 'Navbar',
    data () {
        return {
            user: null,
        }
    },
    created () {
        //let user = firebase.auth().currentUser
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                this.user = user
            } else {
                this.user = null
            }
        })
    },
    methods : {
        logout () {
            firebase.auth().signOut().then(() =>{
                this.$router.push({name:'Signup'})
            })
        }
    }
}
</script>
<style lang="less" scoped>
#Navbar {
    height: 40px;
    color: white;
    display: flex;
    justify-content: space-between;
    .left-side-nav {
        flex-direction: row;
        height: 100%;
        list-style-type: none;
        margin: 0;
        padding: 0 15px;
        align-items: center;
        display: flex;
        li {
            :hover {
                color: rgb(177, 148, 255);
            }
            a {
                padding: 0 10px;
                text-decoration: none;
                color: white;
                cursor: pointer;
            }
        }
    }
    .right-side-nav {
        flex-direction: row;
        height: 100%;
        list-style-type: none;
        margin: 0;
        padding: 0;
        align-items: center;
        display: flex;
        padding: 0 15px;
        li {
            :hover {
                color: rgb(177, 148, 255);
            }
            a {
                padding: 0 10px;
                text-decoration: none;
                color: white;
                cursor: pointer;
            }
        }

    }
}

@media screen and (max-width: 500px){
    #Navbar {
        height: 100%;
        .left-side-nav {
            padding: 10px 15px;
            flex-direction: column;
            text-align: left;
            li {
                padding-top: 10px;
                width: 100%;
                a {
                    padding: 0 10px;
                }
            }
        }
        .right-side-nav {
            flex-direction: column;
            padding: 10px 15px;
            text-align: right;
            li {
                padding-top: 10px;
                width: 100%;
                a {
                    padding: 5px 10px;
                    text-decoration: none;
                    color: white;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>