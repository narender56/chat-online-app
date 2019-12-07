<template>
  <div id="app">
    <Home />
    <div class="footer">
      © 2019 buzzhub, All rights reserved. Contact: +91 8142742972
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import Home from './views/Home'

export default {
  name: 'app',
  components: {
    Home
  }
}
</script>
<style>
html,
body,
#app {
  box-sizing: border-box;
  background-color: #ffffff;
  font-family: arial,sans-serif;
  margin: 0;
}

.footer {
  font-size: 12px;
  position: fixed;
  left: 37%;
}

.disabled {
  cursor: not-allowed;
  pointer-events: none;
  background: #dddddd;
}

.flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.column {
  flex-direction: column
}

.w100p {
  width: 100%
}

.w30p {
  width: 30%;
}

.w70p {
  width: 70%;
}

.w90p {
  width: 90%;
}

.pa16 {
  padding: 1rem;
}

.none {
  display: none;
}

.green {
  color: green;
}

.bg-green {
  background-color: #00CB51
}

.bg-red {
  background-color: #ff0000
}

.warning {
  background-color: #ffbb33
}

.card {
  -webkit-box-shadow: 0px -1px 33px 0px rgba(0,0,0,1);
  -moz-box-shadow: 0px -1px 33px 0px rgba(0,0,0,1);
  box-shadow: 0px -1px 33px 0px rgba(0,0,0,1);
}
</style>
