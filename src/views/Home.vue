<template>
  <div>
    <div class="home flex center" v-if="!accepted">
      <div class="container flex align-center column">
        <h3 class="welcome-text">Welcome to Random World!</h3>
        <h1 class="text-msg">YOU MUST BE OVER 18 AND AGREE TO THE TERMS BELOW BEFORE CONTINUING!</h1>
        <p class="sub-text">THIS SITE ACTIVELY COOPERATES WITH LAW ENFORCEMENT IN ALL INSTANCES OF SUSPECTED ILLEGAL USE OF THE SERVICE, ESPECIALLY IN THE CASE OF UNDERAGE USAGE OF THE SERVICE</p>
        <div class="flex w100p mt5">
          <div class="btn-continue red"
            onmouseover="this.style.opacity=.9;"
            onmouseout="this.style.opacity=1;"
            @click="goBack">
          Go Back
          </div>
          <div class="btn-continue green"
            onmouseover="this.style.opacity=.9;"
            onmouseout="this.style.opacity=1;"
            @click="next">
            Continue
          </div>
        </div>
      </div>
    </div>
    <room v-else/>
  </div>
</template>
<script>
import { connectSocket } from '@/utils'
import Room from '@/views/Room'

export default {
  name: 'home',
  components: {
    Room
  },
  data() {
    return {
      accepted: false
    }
  },
  methods: {
    async next() {
      await connectSocket()
      this.accepted = true
    },
    goBack() {
      window.history.back()
    }
  },
  mounted() {
    window.addEventListener('beforeunload', function(event) {
      const flag = confirm('Are you sure want to leave')
      if (flag) window.location.reload()
      event.preventDefault()
    })
  }
}
</script>

<style scoped>
  .container {
    background-color: rgb(255, 255, 255);
    text-align: center;
    padding: 12px;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 14px 24px -8px;
    visibility: visible;
    width: 100%;
    margin: 6.5rem;
  }

  .welcome-text {
    color: #999;
    font-size: 30pt;
    color: #777777;
    font-weight: 200;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
  }

  .btn-continue {
    cursor: pointer;
    font-size: 18pt;
    border-radius: 15px;
    padding: 10px 60px;
    background-color: rgb(173, 184, 255);
    color: rgb(255, 255, 255);
    margin: 10px auto;
    opacity: 1;
  }

  .red {
    background: #f80a0a;
  }

  .green {
    background: #058005;
  }

  .mt5 {
    margin-top: 5rem
  }

  .text-msg {
    font-size: 22pt;
    color:#777777;
    text-align:center;
    padding: 10px;
  }

  .sub-text {
    font-size: 12px;
    color:#f80a0a;
    text-align:center;
    padding: 20px;
  }
</style>
