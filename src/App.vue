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

.column {
  flex-direction: column
}

.w100p {
  width: 100%
}
</style>
