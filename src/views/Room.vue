<template>
  <div class="room flex block-mb">
    <div class="w30p br-right flex center bold w100p-mb column">
      <span v-if="count > 1" class="green text-center">{{ count }} Users Online</span>
      <div class="w90p">
        <div class="pa16 gender-items flex justify-between">
          <span>Female</span> {{ females }}
        </div>
        <div class="pa16 gender-items flex justify-between">
          <span>Male</span> {{ males }}
        </div>
        <div class="pa16 gender-items flex justify-between">
          <span>Trans</span> {{ trans }}
        </div>
        <div class="pa16 hide-mb">
          <input
            class="input"
            :value="backgroundColor"
            @input="backgroundColor = $event.target.value"
            placeholder="Enter a color name to change the room color"/>
        </div>
      </div>
    </div>
    <div class="flex message-container w70p w100p-mb">
      <div class="container">
        <div class="message-wrap" ref="messages" :style="{'background-color': backgroundColor}">
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
          class="cirlce"
          :title="leaveRoomTitle === '+' ? 'Tap to connect with stangers': leaveRoomTitle"
          :class="{
            'bg-green': leaveRoomTitle === '+',
            'bg-red': leaveRoomTitle === 'Leave',
            'warning': leaveRoomTitle === 'Really?'
            }"
          @click="leaveRoom">
          {{ leaveRoomTitle }}
        </button>
        <div class="w100p flex align-center">
          <img
            :title="!randomPersonConnected ? 'Waiting user to connect' : 'Emojies'"
            class="smile-btn"
            src="@/assets/smile_grey.png"
            @click="toggleEmojies"
            alt="send">
          <input
            ref="input"
            class="input"
            type="text"
            :disabled="!randomPersonConnected"
            :value="data.message"
            :placeholder="randomPersonConnected ? 'Type your message here' : 'Waiting for stranger to connect...'"
            @input="updateMessage"
            @keypress.enter="sendMessage"/>
          <img
            v-if="data.message"
            class="send-btn"
            src="@/assets/up-arrow.png"
            @click="sendMessage"
            alt="send">
        </div>
        <span v-if="strangerIsTyping" class="typing-text">Stanger Typing...</span>
        <div class="emoji-mart-container" v-if="firstTime" :class="!showEmojis ? 'none': ''">
          <picker @select="addEmoji"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'room',
  components: {
    Picker: () => import('emoji-mart-vue').then(m => m.Picker)
  },
  props: {
    gender: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      count: 0,
      females: 0,
      males: 0,
      trans: 0,
      genderEmoji: null,
      messages: [],
      data: {
        message: '',
        time: ''
      },
      randomPersonConnected: false,
      leaveRoomTitle: '+',
      strangerIsTyping: false,
      timeout: null,
      stopTimeout: null,
      firstTime: false,
      showEmojis: false,
      backgroundColor: ''
    }
  },
  sockets: {
    gendersCount({ females = 0, males = 0, trans = 0 }) {
      this.females = females
      this.males = males
      this.trans = trans
      this.count = females + males + trans
    },
    chatConnected: function(gender) {
      this.randomPersonConnected = true
      if (gender === 'Male') this.genderEmoji = '🍆'
      if (gender === 'Female') this.genderEmoji = '🍑'
      if (gender === 'Trans') this.genderEmoji = '✌'
      this.leaveRoomTitle = 'Leave'
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    messageReceived: function({ message, time }) {
      this.messages.push({ message, from: 'other', time })
      this.autoScroll()
    },
    chatDisconnected: function() {
      this.messages = []
      this.data.message = ''
      this.randomPersonConnected = false
      this.leaveRoomTitle = '+'
    },
    strangerIsTyping: function(flag) {
      this.strangerIsTyping = flag
    }
  },
  mounted() {
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) this.leaveRoom()
    })
    if (this.gender && this.$socket) {
      this.$socket.emit('gender', this.gender)
      setTimeout(this.connectNewRoom, 500)
    }
  },
  methods: {
    toggleEmojies() {
      if (!this.randomPersonConnected) return
      if (!this.firstTime) this.firstTime = true
      this.showEmojis = !this.showEmojis
    },
    addEmoji(event) {
      this.data.message += event.native
      this.$refs.input.focus()
    },
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
      this.showEmojis = false
      if (this.$socket && this.data.message) {
        this.data.time = new Date()
        this.messages.push({ message: this.data.message, from: 'me', time: this.data.time })
        await this.$socket.emit('message', this.data)
        this.autoScroll()
        this.data.message = ''
      }
    },
    async connectNewRoom() {
      if (this.$socket && this.count > 1) {
        if (this.randomPersonConnected) await this.leaveRoom()
        await this.$socket.emit('connect-new-room')
      }
    },
    async leaveRoom() {
      if (this.randomPersonConnected) {
        if (this.leaveRoomTitle === 'Leave') {
          this.leaveRoomTitle = 'Really?'
          return
        }

        if (this.leaveRoomTitle === 'Really?') {
          await this.$socket.emit('leave-room')
          this.randomPersonConnected = false
          this.leaveRoomTitle = '+'
          return
        }
      }
      this.connectNewRoom()
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

.br-right {
  border: 1px solid #ddd;
}

.bold {
  font-weight: bold;
  font-size: 30px;
}

.gender-items {
  background: #71baff;
  margin: .5rem;
  border-radius: 25px;
  color: #ffffff;
}

.center {
  justify-content: center;
  align-items: center;
}

.container {
  display: flex;
  height: 100%;
  padding-bottom: 5rem;
}

.send-btn {
  height: 40px;
  width: 40px;
}

.smile-btn {
  height: 25px;
  margin: 10px;
}

input[type="text"]:disabled, .disabled  {
  background: #ccc;
}

.typing-text {
  position: absolute;
  left: 12.5%;
  bottom: 5%;
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
  margin: 8px 0;
}

.message-wrap .message-list.me .msg {
  background: #bdf7bf;
  color: #111;
  word-break: break-all;
}

.message-wrap .message-list .msg {
  background: #fff;
  box-shadow: 0 5px 15px -5px rgba(0, 0, 0, .1);
  padding: 10px 20px 10px 10px;
  border-radius: 15px;
  position: relative;
  min-width: 45px;
  word-break: break-all;
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
  width: 55px;
  height: 55px;
  margin: 0 5px;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  font-size: 13px;
  color: #ffffff;
  outline: none;
}

.left {
  position: absolute;
  top: -60px;
  left: 10px;
}

.input {
  padding: 10px;
  width: 90%;
  height: 20px;
  font-size: 16px;
  border-radius: 25px;
  border: 1px solid #556677;
  color: #555555;
  outline: none;
}

.emoji-mart-container >>>.emoji-mart-bar {
  display: none;
}

.emoji-mart-container {
  position: absolute;
  top: -420px;
}

.text-center {
  text-align: center;
}

@media only screen and (max-width: 600px) {
  .gender-items, .hide-mb {
    display: none;
  }

  .block-mb {
    display: block;
    position: fixed;
  }

  .container {
    padding-bottom: 0;
  }

  .message-wrap {
    padding: 15px 15px 40px 15px;
  }

  .h93p-mb {
    height: 93%;
  }

  .h100p-mb {
    height: 100%;
  }

  .room {
    height: 90vh;
    width: 100%;
  }

  .w100p-mb {
    width: 100%;
  }

  .typing-text {
    left: 33%;
  }

  .cirlce {
    width: 40px;
    height: 40px;
    font-size: 9px;
  }
}
</style>
