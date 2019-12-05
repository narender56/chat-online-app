<template>
  <div>
    <transition name="modal">
      <div v-if="open">
        <div class="overlay">
          <div class="modal">
            <section class="flex align-center justify-between w100p-mb">
              Are you
              <div>
                <input type="radio" id="control_01" name="select" value="Male" @click="gender = 'Male'">
                <label for="control_01">
                  <h1>👉</h1>
                </label>
              </div>
              <div>
                <input type="radio" id="control_02" name="select" value="Female" @click="gender = 'Female'">
                <label for="control_02">
                  <h1>👌</h1>
                </label>
              </div>
              <div>
                <input type="radio" id="control_03" name="select" value="Trans" @click="gender = 'Trans'">
                <label for="control_03">
                  <h1>✌</h1>
                </label>
              </div>
               <button
                @click="goto"
                :disabled="!gender"
                :class="gender ? 'bg-green': 'disabled'"
                >
                Go
              </button>
            </section>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  metaInfo: {
    title: 'Choose your gender',
    titleTemplate: '%s <- Devsup.in Chat with Strangers',
    meta: [
      { name: 'description', content: 'Please select your gender to chat with strangers' },
      { property: 'og:title', content: 'Choose your gender, Strangers chat ← debsup.in' },
      { property: 'og:site_name', content: 'devsup.in' },
      { property: 'og:type', content: 'website' },
      { property: 'og:description', content: 'Choose your gender, Strangers chat ← debsup.in, Chatting' },
      { itemprop: 'name', content: 'Choose your gender, Strangers chat ← debsup.in' },
      { itemprop: 'description', content: 'Choose your gender, Strangers chat ← debsup.in, Chatting' }
    ]
  },
  data: function() {
    return {
      gender: ''
    }
  },
  methods: {
    goto() {
      if (!this.gender) return
      this.$emit('gender', this.gender)
    }
  }
}
</script>

<style scoped>
.modal {
  width: 500px;
  margin: 0px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px 3px;
  transition: all 0.2s ease-in;
  font-family: Helvetica, Arial, sans-serif;
}

button {
  padding: 7px;
  color: white;
  font-size: 1.1rem;
  border-radius: 50px;
  outline: none;
  cursor: pointer;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #00000094;
  z-index: 999;
  transition: opacity 0.2s ease;
}

h1 {
  font-size: 70px;
  margin: 0;
}

input[type=radio] {
  display: none;
}

label {
  display: block;
  background: white;
  width: 6rem;
  border: 2px solid rgba(32, 223, 128, 1);
  text-align: center;
  border-radius: 50px;
  box-shadow: 0px 3px 10px -2px rgba(161, 170, 166, 0.5);
}

input[type="radio"]:checked + label {
  background: rgba(32, 223, 128, 1);
  color: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 20px rgba(0, 255, 128, 0.75);
}

p {
  font-weight: 900;
}

@media only screen and (max-width: 600px) {
  .modal {
    font-size: 15px;
    height: 10rem;
    align-items: center;
    display: flex;
  }

  .w100p-mb {
    width: 100%;
  }

  label {
    width: 3rem;
    height: 3rem;
  }

  h1 {
    font-size: 40px;
  }
}

</style>
