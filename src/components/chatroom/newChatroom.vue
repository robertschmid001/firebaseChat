<template>
    <div id="new-chatroom">
        <div class="label-wrapper">
            <label class="container">Add a password
                <input type="checkbox" checked="checked" v-model="checked">
                <span class="checkmark"></span>
            </label>
        </div>
        <form @submit.prevent="addChatRoom" class="form-wrapper-new">
            <input type="text" name="new-chatroom" v-model="newChatRoom" placeholder="Create a new chatroom...">
             <transition name="slide-fade"><input type="password" name="new-chatroom" v-model="roomPswrd" v-if="checked" placeholder="Password"></transition>
             <transition name="slide-fade-plus"><input type="password" name="new-chatroom" v-model="roomPswrdV" v-if="checked" placeholder="Re-type your password"></transition>
            <span class="white-text" v-if="feedback">{{feedback}}</span>
        </form>
        <button @click="addChatRoom" @change="encrypt" >create</button>
    </div>
</template>
 <script>
import db from '@/main.js'
import slugify from 'slugify'
import firebase from 'firebase'
import CryptoJS from "crypto-js";

var cryptobject;

export default {
    name: 'new-chatroom',
    data () {
        return {
            newChatRoom: null,
            roomPswrd: null,
            roomPswrdV: null,
            userName: null,
            feedback: null,
            slug : null,
            checked: null,

            wisdom: 'activate',
            encrypted: false,
            wisdom2: 'activate'
        }
    },
    methods: {
        addChatRoom () {
            if (this.checked) {
                if (this.newChatRoom && this.roomPswrd == this.roomPswrdV){
                    this.slug = slugify(this.newChatRoom, {
                        replacement: '-',
                        remove: /[$*_+~.()'"!\-:@]/g,
                        lower: true
                    })
                    let ref = db.collection('chatrooms').doc(this.slug)
                    ref.get().then(doc => {
                        if(doc.exists) {
                            this.feedback = 'This chatroom already exists.'
                        } else {
                            this.encrypt();
                            ref.set({
                                name: this.newChatRoom,
                                userName: this.userName,
                                timestamp: Date.now(),
                                password: this.encrypted.str
                            }).catch(err => {
                                console.log(err)
                            })
                            this.newChatRoom = null
                            this.chatName = null
                            this.roomPswrd = null
                            this.roomPswrdV = null
                        }
                    })
                } else {
                    this.feedback = "You may have a typo in your password :("
                }
            } else {
                if (this.newChatRoom){
                    this.slug = slugify(this.newChatRoom, {
                        replacement: '-',
                        remove: /[$*_+~.()'"!\-:@]/g,
                        lower: true
                    })
                    let ref = db.collection('chatrooms').doc(this.slug)
                    ref.get().then(doc => {
                        if(doc.exists) {
                            this.feedback = 'This chatroom already exists.'
                        } else {
                            ref.set({
                                name: this.newChatRoom,
                                userName: this.userName,
                                timestamp: Date.now()
                            }).catch(err => {
                                console.log(err)
                            })
                            this.newChatRoom = null
                            this.chatName = null
                        }
                    })
                } else {
                    this.feedback = "You must enter a name or password in order to create one"
                }
            }
        },
        encrypt () {
            cryptobject = CryptoJS.AES.encrypt(this.roomPswrd, this.wisdom);
            this.encrypted = {
                key: cryptobject.key + '',
                iv: cryptobject.iv + '',
                salt: cryptobject.salt + '',
                ciphertext: cryptobject.ciphertext + '',
                str: cryptobject + ''
            }
        }
    },
    created () {
        let user = firebase.auth().currentUser;
        this.userName = user.email
    },
}
</script>
<style lang="less" scoped>

#new-chatroom {
    padding: 30px 10px;
    .form-wrapper-new {
        display: flex;
        justify-content: center;
        flex-direction: column;
        input {
            margin:  10px 0;
            padding: 15px;
            border-radius: 25px;
            border: none;
        }
        .white-text {
            color: rgba(255, 255, 255, 0.596);
            padding: 10px;
        }
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
}
input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px white inset;
}
/* Customize the label (the container) */
.container {
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 18px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    color: white;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: white;
  border-radius: 5px 5px 0px 5px;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: white;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #2196F3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
.label-wrapper {
    height: 25px;
}
input {
    margin:  10px 0;
    padding: 15px;
    border-radius: 25px;
    border: none;
}

.slide-fade-enter-active {
  transition: all .1s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(50px);
  opacity: 0;
}
.slide-fade-plus-enter-active {
  transition: all .4s ease;
}
.slide-fade-plus-leave-active {
  transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-plus-enter, .slide-fade-plus-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(50px);
  opacity: 0;
}
</style>