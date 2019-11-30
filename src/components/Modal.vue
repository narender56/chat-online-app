<template>
  <div>
    <transition name="modal">
      <div v-if="open">
        <div class="overlay">
          <div class="modal">
            <span class="ma16">Are you </span>
            <input type="radio" v-model="gender" value="Male"/><label class="emoji" @click.stop="gender = 'Male'">👉</label>
            <input type="radio"  v-model="gender" value="Female"/><label class="emoji" @click.stop="gender = 'Female'">👌</label>
            <input type="radio"  v-model="gender" value="Trans"/><label class="emoji" @click.stop="gender = 'Trans'">✌</label>
            <button
              @click="goto"
              :disabled="!gender"
              :class="gender ? 'bg-green': 'disabled'"
              >
              Go
            </button>
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

.fadeIn-enter {
  opacity: 0;
}

.fadeIn-leave-active {
  opacity: 0;
  transition: all 0.2s step-end;
}

.fadeIn-enter .modal,
.fadeIn-leave-active.modal {
  transform: scale(1.1);
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

.emoji {
  font-size: 50px;
  vertical-align: middle;
  margin-right: 1rem;
  margin-left: .2rem;
}

.ma16 {
  margin: 1rem;
}
</style>
