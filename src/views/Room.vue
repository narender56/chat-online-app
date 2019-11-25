<template>
  <div class="room flex block-mb">
    <loading
      :active.sync="isLoading"
      :is-full-page="fullPage">
    </loading>
    <div class="w30p br-right flex center bold w100p-mb" :class="count > 1 ? 'green' : 'red'">{{ count > 1 ? `${count} Users` : 'No Users' }}  Online
    </div>
    <div class="flex message-container w70p w100p-mb">
      <div class="container">
        <div class="message-wrap" ref="messages">
          <div class="message-list" v-for="(data, i) in messages" :key="`${i}_${Math.random()}`"
            :class="data.from">
            <div class="msg">
              {{ data.message }}
              <div class="time">{{ getTime(data.time) }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="message-input flex w70p w100p-mb">
        <button
          v-if="randomPersonConnected"
          class="cirlce inline-cirlce"
          title="Leave Room"
          @click="leaveRoom">
          {{ leaveRoomTitle }}
        </button>
        <input
          ref="input"
          class="text-editable"
          type="text"
          :disabled="!randomPersonConnected"
          :value="data.message"
          :placeholder="randomPersonConnected ? 'Type your message here' : 'Waiting for stranger to connect...'"
          @input="updateMessage"
          @keypress.enter="sendMessage"/>
        <span v-if="strangerIsTyping" class="typing-text">Stanger Typing...</span>
        <img
          v-if="data.message"
          class="send-btn"
          src="@/assets/up-arrow.png"
          @click="sendMessage"
          alt="send">
        <button
          v-if="!randomPersonConnected"
          class="cirlce right"
          @click="connectNewRoom"
          title="Connect to new room">
          +
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
  name: 'room',
  components: {
    Loading
  },
  data() {
    return {
      count: 0,
      messages: [],
      data: {
        message: '',
        room: '',
        socketId: '',
        time: ''
      },
      randomPersonConnected: false,
      isLoading: false,
      leaveRoomTitle: 'Leave',
      fullPage: true,
      strangerIsTyping: false,
      timeout: null,
      stopTimeout: null
    }
  },
  sockets: {
    userCount(count) {
      this.count = count
    },
    roomName: function(roomName) {
      this.data.room = roomName
      this.randomPersonConnected = true
      this.data.socketId = this.$socket.id
      this.isLoading = false
      this.leaveRoomTitle = 'Leave'
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    'receive-message': function({ message, socketId, time }) {
      let from = socketId === this.$socket.id ? 'me' : 'other'
      this.messages.push({ message, from, time })
      this.autoScroll()
    },
    'user-disconnected': function() {
      this.messages = []
      this.data.message = ''
      this.data.room = ''
      this.randomPersonConnected = false
      this.isLoading = false
      this.leaveRoomTitle = 'Leave'
    },
    strangerIsTyping: function(flag) {
      this.strangerIsTyping = flag
    }
  },
  mounted() {
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) this.leaveRoom()
    })

    setTimeout(this.connectNewRoom, 500)
  },
  computed: {
    checkConneced: function() {
      return this.randomPersonConnected
    }
  },
  methods: {
    updateMessage(e) {
      this.data.message = e.target.value
      if (this.timeout) clearTimeout(this.timeout)
      if (this.stopTimeout) clearTimeout(this.stopTimeout)
      this.timeout = setTimeout(() => {
        this.$socket.emit('user-typing', true)
      }, 100)

      this.stopTimeout = setTimeout(() => {
        this.$socket.emit('user-typing', false)
      }, 500)
    },
    async sendMessage(e) {
      e.preventDefault()
      if (!this.randomPersonConnected) return
      if (this.$socket && this.data.message) {
        this.data.time = new Date()
        await this.$socket.emit('message', this.data)
        this.data.message = ''
      }
    },
    async connectNewRoom() {
      if (this.$socket && this.count > 1) {
        this.isLoading = true
        if (this.randomPersonConnected) await this.leaveRoom()
        await this.$socket.emit('connect-new-room')
      } else {
        alert('No Users are online, Please wait for people to join')
      }
    },
    async leaveRoom() {
      if (this.randomPersonConnected) {
        if (this.leaveRoomTitle === 'Leave') {
          this.leaveRoomTitle = 'Really'
          return
        }
        this.isLoading = true
        await this.$socket.emit('leave-room')
        this.randomPersonConnected = false
        setTimeout(this.connectNewRoom, 500)
        this.isLoading = false
      }
    },
    autoScroll() {
      this.$nextTick(() => {
        const lastElement = [...this.$refs.messages.querySelectorAll('div.message-list')].pop()
        const scrollIntoViewOptions = { behavior: 'smooth', block: 'center' }
        lastElement.scrollIntoView(scrollIntoViewOptions)
      })
    },
    getTime(date) {
      date = new Date(date)
      const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }
      return new Intl.DateTimeFormat('en-US', options).format(date)
    }
  },
  beforeDestroy() {
    document.removeEventListener('keydown')
  }
}
</script>

<style scoped>
.room {
  height: 100vh;
  justify-content: flex-start;
}

.w30p {
  width: 30%;
}

.w70p {
  width: 70%;
}

.br-right {
  border: 1px solid #ddd;
}

.bold {
  font-weight: bold;
  font-size: 30px;
}

.red {
  color: red;
}

.green {
  color: green;
}

.center {
  justify-content: center;
  align-items: center;
  background-color: aliceblue;
}

.container {
  display: flex;
  height: 90%;
}

.send-btn {
  position: absolute;
  right: 8px;
  height: 40px;
  width: 40px;
  top: 20px;
}

.typing-text {
  position: absolute;
  left: 8.5%;
  bottom: 7%;
  font-size: 10px;
  color: green;
}

.message-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  overflow: scroll;
  background: #e0d9d1;
}

.message-wrap::before {
  content: '';
  margin-bottom: auto;
}

.message-wrap .message-list {
  align-self: flex-start;
  max-width: 70%;
}

.message-wrap .message-list.me {
  align-self: flex-end;
  margin-bottom: 10px;
}

.message-wrap .message-list.me .msg {
  background: #bdf7bf;
  color: #111;
}

.message-wrap .message-list .msg {
  background: #fff;
  box-shadow: 0 5px 15px -5px rgba(0, 0, 0, .1);
  padding: 10px 20px 10px 10px;
  border-radius: 15px;
  position: relative;
  min-width: 45px;
}

.message-wrap .message-list .time {
  float: right;
  color: #999;
  font-size: 0.75em;
  margin-top: 12px;
  margin-left: 5px;
  margin-right: -14px;
}

.message-container {
  flex: 1;
  flex-direction: column;
  height: 100%;
}

.message-list.other::before {
  content: "";
  width: 0;
  height: 0;
  border-top: 10px solid #ffffff;
  border-left: 10px solid transparent;
  border-right: 5px solid transparent;
  top: 40px;
  left: -8px;
  position: relative;
}

.message-list.me .msg:last-child::after {
  content: "";
  width: 0;
  height: 0;
  border-bottom: 8px solid #bdf7bf;
  border-left: 12px solid transparent;
  border-right: 9px solid transparent;
  top: 13px;
  right: -10px;
  position: absolute;
}

.message-input {
  background-color: #f5f5f5;
  height: 5rem;
  align-items: center;
  position: fixed;
  bottom: 0;
}

.cirlce {
  font-family: Verdana,sans-serif;
  line-height: 1.5;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 50%;
  font-size: 24px;
  color: #ffffff;
  background-color: #009688;
  outline: none;
}

.inline-cirlce {
  margin: 0px 5px;
  width: 50px;
  height: 50px;
  padding: 4px;
  line-height: 1;
  background-color: #f80808;
  font-size: 15px;
}

.left {
  position: absolute;
  top: -60px;
  left: 10px;
}

.right {
  position: absolute;
  right: 12px;
  top: -60px;
}

.text-editable {
  height: 30px;
  width: 100%;
  font-size: 16px;
  background: #ffffff;
  border: 1px solid #ddd;
  padding: 5px 19px;
  margin: 5px;
  border-radius: 25px;
  outline: none;
  position: relative;
  color: #555555;
}

.text-editable[placeholder]:empty::after {
  content: attr(placeholder);
  color: #999999;
  position: relative;
}

@media only screen and (max-width: 600px) {
  .block-mb {
    display: block;
    position: fixed;
  }

  .container {
    height: 80%;
  }

  .room {
    height: 90vh;
    width: 100%;
  }

  .w100p-mb {
    width: 100%;
  }
}
</style>
