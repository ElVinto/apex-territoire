<template>
  <div id="app">
    
    
    <div class="header ">
      <my-header />
    </div>

    <div class="navbar" v-if= "$router.currentRoute.path !== '/' ">
      <navbar />
    </div>
    
    <router-view />

    <div class="footer ">
      <my-footer />
    </div>

  </div>
</template>

<script>
import footer from "./components/Footer";
import header from "./components/Header";
import navbar from "./components/Navbar";


export default {
  name: "App",
  components: {
    "my-footer": footer,
    "my-header": header,
    navbar: navbar,
  },
};
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
