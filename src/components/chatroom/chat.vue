
<template>
  <div id="chatroom" v-if="chatRoomData">
    <div v-if="RoomPasswordCheck" class="no-pass-wrapper">
      <h1>Please enter a password</h1>
      <form @submit.prevent="verifyPswrd()" class="form-wrapper-new">
          <input type="password" name="new-chatroom" v-model="roomPswrd" placeholder="Password">
      </form>
      <span class="white-text" v-if="feedback">{{feedback}}</span>
      <div class="button-wrapper">
        <button @click.prevent="verifyPswrd()" >Submit</button>
        <router-link to="/chatrooms"><button><span class="button-text"> back </span></button></router-link>
      </div>
    </div>

    <div v-else>
      <h1>{{chatRoomData.name}}</h1>
      <!-- <font-awesome-icon class="font-icon" icon="thumbs-up"/>
      <font-awesome-icon class="font-icon-1" icon="thumbs-up"/> -->
      <div class="chat-wrapper">
        <div class="chat-inner-wrapper" >
          <div v-if="comments.length">
            <ul class="message-list" v-chat-scroll >
              <li v-for="(comment,index) in comments" :key="index"  :class="{myMessage: colourCheck(comment.from)}">
                <div class="newMessage-wrapper" >
                  <span class="header-message">
                    {{nameCheck(comment.from)}} @ {{comment.date}}
                  </span>
                  <p> {{comment.content}}</p>
                </div>
              </li>
            </ul>
          </div>
          <div v-else class="no-comments">
            <p>Write the first comment!</p>
          </div>
          <div class="form-wrapper">
            <form @submit.prevent="addComment">
              <div class="form-wrapper-new">
                <input type="text" name="comment" v-model="newComment" placeholder="Add a comment">
                <p v-if="feedback" class="feedback">{{feedback}}</p>
              </div>
            </form>
            <!-- Testing file transfer -->
            <form id="image-form" action="#">
              <input id="mediaCapture" type="file" accept="image/*" capture="camera">
              <button id="submitImage" title="Add an image" class="" @click="saveImageMessage('7291.jpg')">
                <font-awesome-icon class="font-icon" icon="thumbs-up"/>
              </button>
            </form>
            <!-- End of testing image -->
          </div>
        </div>
      </div>
      <router-link to="/chatrooms"><button><span class="button-text"> back </span></button></router-link>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/main.js'
import moment from 'moment'
import CryptoJS from "crypto-js";

export default {
  name: 'chatroom',
  data () {
    return {
      name: "",
      userName: "",
      myMessageColour: false,
      chatRoomData: null,
      newComment: null,
      feedback: null,
      comments: [],
      roomPswrd: null,
      RoomPasswordCheck: null,

      pword: null,
      encrypted: false,
      wisdom2: 'activate'
    }
  },
  methods: {
      saveImageMessage (file) {
    // 1 - We add a message with a loading icon that will get updated with the shared image.
    firebase.database().ref('comments').push({
      imageUrl: LOADING_IMAGE_URL,
      to: this.$route.params.id,
      from: this.userName,
    }).then(function(messageRef) {
      // 2 - Upload the image to Cloud Storage.
      var filePath = firebase.auth().currentUser.uid + '/' + messageRef.key + '/' + file.name;
      return firebase.storage().ref(filePath).put(file).then(function(fileSnapshot) {
        // 3 - Generate a public URL for the file.
        return fileSnapshot.ref.getDownloadURL().then((url) => {
          // 4 - Update the chat message placeholder with the image's URL.
          return messageRef.update({
            imageUrl: url,
            storageUri: fileSnapshot.metadata.fullPath
          });
        });
      });
    }).catch(function(error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
    });
  },
    addComment() {
      if(this.newComment){
        this.feedback = null
        db.collection('comments').add({
          to: this.$route.params.id,
          from: this.userName,
          content: this.newComment,
          date: Date.now()
        }).then(()=> {
          this.newComment = null;
        })
      } else {
        this.feedback = 'Please enter a comment'
      }
    },
    logout () {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    },
    colourCheck (user) {
      if( user === this.userName) {
        return this.myMessageColour = true;
      } else {
       return this.myMessageColour = false;
      }
    },
    nameCheck (user) {
      if( user == this.userName) {
        this.myMessageColour = true;
        return 'me'
      } else {
       this.myMessageColour = false;
       return user
      }
    },
    verifyPswrd () {
      this.feedback = null;
      this.decrypted();
      if (this.pword === this.roomPswrd ) {
        this.RoomPasswordCheck = false;
      }else {
        this.again = !this.again;
        this.roomPswrd= null
        if (this.again){
          return this.feedback = "Try another password..."
        } else
          return this.feedback = "Still no the right one :("
      }
    },
    decrypted () {
      this.pword =  (this.encrypted ? CryptoJS.AES.decrypt(this.encrypted, this.wisdom2).toString(CryptoJS.enc.Latin1) : 'bobby')
    }
  },
  created (){
    //setting state
    this.RoomPasswordCheck = null

    //get current user
    let user2 = firebase.auth().currentUser;
    this.userName = user2.email

    //get chatrooms data
    let ref2 = db.collection('chatrooms')
    ref2.doc(this.$route.params.id).get().then(user => {
      this.chatRoomData = user.data()
      this.encrypted = user.data().password

      //check for password
      if (user.data().password){
        this.RoomPasswordCheck = true
      }
    })

    // comments
    let ref = db.collection('comments').where('to', '==', this.$route.params.id).orderBy('date')
    ref.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type == 'added'){
          this.comments.push({
            from: change.doc.data().from,
            content: change.doc.data().content,
            date: moment(change.doc.data().date).format("llll")
          })
        }
      })
    })
  },
}
</script>
<style lang="less" scoped>
#chatroom {
  h1 {
    color: white;
  }
  .font-icon-1 {
    color: rgb(89, 89, 255);
  }
  .font-icon {
    color: white;
  }
  .chat-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    .chat-inner-wrapper {
      border-radius: 25px 0 0 0;
      text-align: left;
      min-width: 150px;
      max-width: 500px;
      .message-list {
        list-style-type: none;
        padding: 0;
        flex-direction: column;
        margin: 0px;
        overflow: auto;
        max-height: 600px;
        min-height: 150px;
        padding: 10px;
        li {
          display: inline-block;
          margin: 5px 10px;
          display: flex;
          background-color: rgba(221, 185, 255, 0.582);
          border-radius: 15px 15px 0 15px;
          overflow: hidden;
          .newMessage-wrapper {
            padding: 10px;
            width: 100%;
            height: auto;
            .header-message {
              font-size: 10px;
            }
            p {
              margin: 0;
              font-size: 14px;
              color:rgba(0, 0, 0, 0.7);
            }
          }
        }
        .myMessage {
          background-color: #ffffff;
          border-radius: 15px 15px 15px 0;
        }
      }
      .form-wrapper{
        width: 100%;
        .form-wrapper-new {
          max-width: 500px;
          padding: 0 20px 20px 20px;
          text-align: center;
          input {
            width: 100%;
            border: none;
            height: 30px;
            box-sizing: border-box;
            padding-left: 10px;
            outline: none;
            margin: 15px 0 15px 0;
            border-radius: 15px 15px 15px 15px;
          }
          .feedback {
            color: rgba(253, 230, 230, 0.678);
          }
        }
      }
    }
    .no-comments {
        color: rgba(255, 255, 255, 0.61);
        justify-content: center;
        display: flex;
    }
  }
  button {
    padding: 10px 20px;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 22px;
    outline: 0;
    margin: 10px;
    cursor: pointer;
    width: 100px;
    background-color:rgba(0, 0, 0, 0);
    border: 2px solid white;
  }
  button:hover{
    background-color: white;
    color: rgb(156, 121, 255);
  }
}

// Custom scrollBar

::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: #ffffff;
}
::-webkit-scrollbar-thumb {
  background: rgba(221, 185, 255, 0.582);
}
::-webkit-scrollbar-thumb:hover {
  background: rgb(131, 86, 253)
}
input {
    margin:  10px 0;
    padding: 15px;
    border-radius: 25px;
    border: none;
    min-width: 200px;
}
.white-text{
  color: rgba(255, 255, 255, 0.651);
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}
.button-wrapper {
  margin-top: 10px;
}
</style>

