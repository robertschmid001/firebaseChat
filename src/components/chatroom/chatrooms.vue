<template>
    <div id="chatrooms">
        <div class="h1-wrapper"><h1> Supa' Dupa' Chatrooms </h1></div>
        <div class="chat-inner-wrapper">
            <div class="radio-wrapper">
                <label class="container"> All
                    <input type="radio" value="All" v-model="selectedFilter">
                    <span class="checkmark"></span>
                </label>
                <label class="container">Mine
                    <input type="radio" value="Mine" v-model="selectedFilter">
                    <span class="checkmark"></span>
                </label>
            </div>
            <!-- <div class="radio-wrapper">
                <label class="container"> Sort Alphabetically Asc
                    <input type="radio" value="alphaAsc" v-model="selectedFilterSub">
                    <span class="checkmark"></span>
                </label>
                <label class="container"> Sort Alphabetically Dsc
                    <input type="radio" value="alphaDsc" v-model="selectedFilterSub">
                    <span class="checkmark"></span>
                </label> -->
                <!-- <label class="container"> Sort Date Asc
                    <input type="radio" value="dateAsc" v-model="selectedFilterSub">
                    <span class="checkmark"></span>
                </label>
                <label class="container"> Sort Date Dsc
                    <input type="radio" value="dateDsc" v-model="selectedFilterSub">
                    <span class="checkmark"></span>
                </label>
            </div> -->
            <ul>
                <li v-for="chatroom in filteredChat" :key="chatroom.id">
                    <div class="newChatroom-wrapper" >
                        <router-link :to="`/chatroom/${chatroom.id}`" class="router">
                        <font-awesome-icon class="font-icon" icon="lock" v-if="chatroom.password" />
                        <div class="chatroom-info-wrapper">
                            <h2> {{chatroom.name}} </h2>
                            <span class="header-time">
                                Created on {{chatroom.timestamp}}, by {{chatroom.userName}}
                            </span>
                            <div class="enter-button-wrapper text-button">
                                <div class="button-wrapper"> click to enter </div>
                            </div>
                        </div></router-link>
                        <button @click="deleteChatroom(chatroom, index)" class="delete-button" v-if="checkCreated(chatroom)"> X </button>
                    </div>
                </li>
            </ul>
        </div>
        <new-chatroom/>
    </div>
</template>
<script>
import firebase from 'firebase'
import NewChatroom from './newChatroom.vue'
import db from '@/main.js'
import moment from 'moment'

export default {
    name: 'Chatrooms',
    data () {
        return {
            chatrooms: [],
            chatroomName:null,
            chatRoomId: null,
            userName: null,
            deleteRoom: true,
            count: null,
            selectedFilter: 'All',
            selectedFilterSub: 'Dsc'
        }
    },
    components: {
        'new-chatroom' :NewChatroom
    },
    computed: {
        filteredChat: function() {
            var vm = this;
            var filtered = vm.selectedFilter;
            var filteredSub = vm.selectedFilterSub; // not active yet
			if (filtered === "All") {
				return this.chatrooms
            }
            if (filtered === "Mine") {
				return this.chatrooms.filter(function(chatroom) {
                    filtered = chatroom.userName
					return filtered === vm.userName;
				});
            }
        }
    },
    methods: {
        deleteChatroom (param, index) {
            db.collection('chatrooms').doc(param.id).delete()
            this.chatrooms.splice(index, 1);
        },
        onCreated () {
            let ref = db.collection('chatrooms').orderBy('timestamp')
            this.userName = firebase.auth().currentUser.email;
            ref.onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if(change.type == 'added'){
                        let doc = change.doc
                        this.chatrooms.push({
                            id: doc.id,
                            name: doc.data().name,
                            timestamp: moment(doc.data().timestamp).format("MMM Do YYYY"),
                            userName: doc.data().userName,
                            password: this.isData(doc.data().password)
                        })
                    }
                })
            })
        },
        checkCreated (param) {
            if (this.userName == param.userName) {
                return true
            } else false;
        },
        isData (param) {
            if (param) {
                return this.password = true
            } else this.password = false
        }
    },
    created (){
        this.onCreated();
    }
}
</script>
<style lang="less" scoped>
.h1-wrapper {
    margin: 50px 0;
    h1 {
    color: white;
    margin: 0;
    }
}
.chat-inner-wrapper {
    max-height: 800px;
    overflow-y: auto;
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0px;
        flex-direction: row;
        display: flex;
        flex-wrap: wrap;
        li {
            width: auto;
            margin: 5px 10px;
            background-color: rgba(221, 185, 255, 0.582);
            border-radius: 15px 15px 0 15px;
            flex-grow: 1;
            .newChatroom-wrapper {
                display: flex;
                justify-content: center;
                height: 100%;
                .router {
                    position: relative;
                    width: 100%;
                    text-decoration: none;
                    padding: 10px;
                    justify-content: center;
                    display: flex;
                    .font-icon {
                        width: 20px;
                        height: 20px;
                        color: white;
                        position: absolute;
                        top: 10px;
                        left: 10px;
                    }
                    .chatroom-info-wrapper {
                        width: 85%;
                        margin: 0;
                        height: 100%;
                        h2 {
                            color: white;
                            margin: 0;
                            padding: 10px 0;
                        }
                        .header-time {
                            font-size: 12px;
                            padding: 10px 0;
                            color: white;
                            font-size: 10px;
                        }
                        .enter-button-wrapper {
                            height: auto;
                        }
                        .text-button {
                            display: flex;
                            color: white;
                            text-decoration: none;
                            width: 100%;
                            justify-content: center;
                            padding: 10px 0;
                        }
                    }
                }
                .router:hover {
                    background-color: white;
                    border-radius: 15px 0 0 15px;
                    .font-icon {
                        width: 20px;
                        height: 20px;
                        color: rgb(156, 121, 255);
                    }
                    .chatroom-info-wrapper {
                        h2 {
                            color: rgb(156, 121, 255);
                        }
                        .header-time {
                            color:rgb(156, 121, 255, 0.8);
                        }
                        .enter-button-wrapper {
                            height: auto;
                            border-radius: 0px 0px 0px 15px;
                            color: rgb(156, 121, 255);
                            .text-button {
                                .button-wrapper {
                                    color: rgb(156, 121, 255);
                                }
                            }
                        }
                    }
                }
                button {
                    padding: 10px;
                    color: white;
                    font-weight: bold;
                    border: none;
                    border-radius: 0 15px 0 0;
                    outline: 0;
                    cursor: pointer;
                    background-color:rgba(0, 0, 0, 0);
                    border: 2px solid white;
                    width: 18%;
                    border: none;
                    height: 100%;
                }
                .delete-button:hover {
                    color: rgb(156, 121, 255);
                    background-color:white;
                }
            }
        }
    }
}
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
    margin-left: 10px;
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
.radio-wrapper {
    padding: 10px;
}
</style>