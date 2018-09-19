import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/login.vue'
import Signup from "./components/signup.vue"
import Chatrooms from "./components/chatroom/chatrooms.vue"
import Chatroom from './components/chatroom/chat.vue'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
    
    routes: [
        {
            path: '*',
            redirect: '/login',
        },
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/signup',
            name: 'Signup',
            component: Signup
        },
        {
            path: '/chatrooms',
            name: 'Chatrooms',
            component: Chatrooms,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/chatroom/:id',
            name: 'Chatroom',
            component: Chatroom,
            meta: {
                requiresAuth: true
            }
        },
    ]
})

router.beforeEach((to, from, next) => {
    let currentUser = firebase.auth().currentUser;
    let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !currentUser) next('login')
    else if (!requiresAuth && currentUser) next('chatrooms')
    else next()
})

export default router
