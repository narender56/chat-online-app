<template>
  <div>
    <div class="home flex center flex-mb" v-if="!accepted">
      <div class="container flex column mt0-mb">
        <h3 class="welcome-text">Welcome to Random World!</h3>
        <h1 class="text-msg">YOU MUST BE OVER 18 AND AGREE TO THE TERMS BELOW BEFORE CONTINUING!</h1>
        <p class="sub-text">THIS SITE ACTIVELY COOPERATES WITH LAW ENFORCEMENT IN ALL INSTANCES OF SUSPECTED ILLEGAL USE OF THE SERVICE, ESPECIALLY IN THE CASE OF UNDERAGE USAGE OF THE SERVICE</p>
        <div class="flex w100p mt5 mt0-mb">
          <div class="btn red"
            onmouseover="this.style.opacity=.9;"
            onmouseout="this.style.opacity=1;"
            @click="goBack">
          Go Back
          </div>
          <div class="btn green"
            onmouseover="this.style.opacity=.9;"
            onmouseout="this.style.opacity=1;"
            @click="toggleModal">
            Continue
          </div>
        </div>
      </div>
    </div>
    <Modal @gender="onGender" :open="openModal" v-else-if="openModal" />
    <room :gender="gender" v-else/>
  </div>
</template>
<script>
import { connectSocket } from '@/utils'

export default {
  name: 'home',
  components: {
    Room: () => import('@/views/Room'),
    Modal: () => import('@/components/Modal')
  },
  metaInfo: {
    title: 'Terms and Conditions',
    titleTemplate: '%s <- Devsup.in Chat with Strangers',
    meta: [
      { name: 'description', content: 'Please read the terms and conditions before entering into chat with Strangers' },
      { property: 'og:title', content: 'Chat with random persons, Strangers chat ← debsup.in' },
      { property: 'og:site_name', content: 'devsup.in' },
      { property: 'og:type', content: 'website' },
      { property: 'og:description', content: 'Chat with random persons, Strangers chat ← debsup.in, Chatting' },
      { itemprop: 'name', content: 'Chat with random persons, Strangers chat ← debsup.in' },
      { itemprop: 'description', content: 'Chat with random persons, Strangers chat ← debsup.in, Chatting' }
    ]
  },
  data() {
    return {
      accepted: false,
      openModal: false,
      gender: ''
    }
  },
  methods: {
    async next() {
      await connectSocket()
    },
    toggleModal() {
      this.accepted = true
      this.openModal = !this.openModal
    },
    onGender(value) {
      this.gender = value
      this.toggleModal()
      this.next()
    },
    goBack() {
      window.history.back()
    }
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

  .btn {
    cursor: pointer;
    font-size: 18pt;
    border-radius: 15px;
    padding: 10px 60px;
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
    color:#a50505;
    text-align:center;
    padding: 20px;
  }

  .align-center {
    align-items: center;
  }

  @media only screen and (max-width: 600px) {
    .flex-mb {
      justify-content: space-around;
      padding: 20px;
    }

    .btn {
      font-size: 8pt;
      display: block;
      padding: 10px 40px;
    }

    .mt0-mb {
      margin: 0;
    }
  }
</style>
