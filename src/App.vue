<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
// @ is an alias to /src
export default {
  name: 'app'
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

.card {
  -webkit-box-shadow: 0px 0px 3px 0px rgba(10,0,10,1);
  -moz-box-shadow: 0px 0px 3px 0px rgba(10,0,10,1);
  box-shadow: 0px 0px 3px 0px rgba(10,0,10,1);
  border-radius: 10px;
}

.disabled {
  cursor: not-allowed;
  pointer-events: none;
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

.column {
  flex-direction: column
}

.w100p {
  width: 100%
}
</style>
