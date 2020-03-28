<template>
  <div id="app">
    <Menu msg="Place the menu here"/>
    <hr>
    <ApexMap userId=14 />
    <hr>
    <Footer/>
  </div>
</template>

<script>
import Menu from './components/Menu.vue'
import ApexMap from './components/ApexMap.vue'
import Footer from './components/Footer.vue'

console.log(Menu.props)

export default {
  name: 'App',
  components: {
    Menu,
    ApexMap,
    Footer
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
