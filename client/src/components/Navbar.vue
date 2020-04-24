<template>
  <div class="topnav" v-if="$store.state.activedNavbar">
    <div v-if="$store.state.navbarModel === 0">
      <router-link to="/map" class="nav-link">Carte</router-link>
      <router-link to="/edit" class="nav-link">Editer</router-link>
      <router-link to="/partage" class="nav-link">Partager</router-link>
      <router-link to="/export" class="nav-link">Exporter</router-link>
      <router-link to="/profil" class="nav-link">Authentification</router-link>
      <router-link to="/guide" class="nav-link">Guide</router-link>
      <a id="exit" class="nav-link" href @click="logout">LogOut</a>
    </div>

    <div v-else>
      <b-navbar toggleable type="dark" variant="dark">
        <b-navbar-brand href="#">Menu</b-navbar-brand>

        <b-navbar-toggle target="navbar-toggle-collapse">
          <template v-slot:default="{ expanded }">
            <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
            <b-icon v-else icon="chevron-bar-down"></b-icon>
          </template>
        </b-navbar-toggle>

        <b-collapse id="navbar-toggle-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item href="#/map">Carte</b-nav-item>
            <b-nav-item href="#/edit">Editer</b-nav-item>
            <b-nav-item href="#/partage">Partager</b-nav-item>
            <b-nav-item href="#/export">Exporter</b-nav-item>
            <b-nav-item href="#/profil">Authentification</b-nav-item>
            <b-nav-item href="#/guide">Guide</b-nav-item>
            <b-nav-item href @click="logout">Deconnexion</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  components: {},
  
  async created () {

if( window.innerWidth  < 900 ){
   let navbarModel = 1
   this.$store.commit("initNavbarModel", navbarModel);
    
} if( window.innerWidth >= 900 ){
   let navbarModel = 0
   this.$store.commit("initNavbarModel", navbarModel);
    
} 

 },
  methods: {

    logout() {
      this.$store.dispatch("logout");
      let mailpresent = "";
      this.$store.commit("initmailpresent", mailpresent);
      let PasswordRequire = "";
      this.$store.commit("initPasswordRequire", PasswordRequire);
      let activedNavbar = "";
      this.$store.commit("initActivedNavbar", activedNavbar);
       let navbarModel = 0;
      this.$store.commit("initNavbarModel", navbarModel);
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
  .topnav {
    overflow: hidden;
    background-color: #333;
    width: 100%;
  }
  .topnav a {
    float: left;
    display: block;
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
  }
  #exit {
    float: right;
  }
  .topnav a:hover {
    background-color: rgb(165, 161, 161);
    color: black;
  }


</style>
