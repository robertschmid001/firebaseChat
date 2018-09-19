import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'
import VueChatScroll from 'vue-chat-scroll'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faLock, faThumbsUp)


Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueChatScroll)

Vue.config.productionTip = false

//wait for firebase auth to init before creating the app

  var config = {
    apiKey: "AIzaSyBKvdAypZjfmLHuTNKRoSZNIYYW4l-8WsU",
    authDomain: "chatbob-7db48.firebaseapp.com",
    databaseURL: "https://chatbob-7db48.firebaseio.com",
    projectId: "chatbob-7db48",
    storageBucket: "gs://chatbob-7db48.appspot.com",
    messagingSenderId: "1043573393663"
  };
  const firebaseApp = firebase.initializeApp(config);
  firebaseApp.firestore().settings({ timestampsInSnapshots: true})
  var storage = firebase.storage();

  let app = null;

  firebase.auth().onAuthStateChanged(() => {

    if(!app){
      app = new Vue({
        router,
        render: h => h(App)
      }).$mount('#app')
    }
  })

export default firebaseApp.firestore()


