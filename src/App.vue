<template>
  <div id="app">
    <navbar/>
    <div class="router-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Navbar from './components/global/navbar.vue'

export default {
  name: 'app',
  components: {
    Navbar
  },
}
</script>
<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  .router-wrapper {
    padding: 50px 50px 50px 50px;
  }
}
</style>
