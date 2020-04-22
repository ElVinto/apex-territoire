<template>

    
<div  class="topnav" v-if="$store.state.activedNavbar">
  
  <router-link to="/map" class="nav-link">Carte</router-link>
  <router-link  to="/informations" class="nav-link">Editer</router-link>
  <router-link to="/partage" class="nav-link">Partager</router-link>
  <router-link to="/export" class="nav-link">Exporter</router-link>
  <router-link to="/profil" class="nav-link">Profil</router-link>
  
  <a id="exit"  class="nav-link" href @click="logout">LogOut</a>
  
</div>


</template>


<script>

  
  
  export default {
    name: 'NavBar',
    components: {
      
    },
methods: {

   logout() {
      this.$store.dispatch('logout');
      let  mailpresent = ''
      this.$store.commit('initmailpresent',mailpresent) 
      let PasswordRequire = ''
      this.$store.commit('initPasswordRequire',PasswordRequire)
      let activedNavbar = ''
      this.$store.commit('initActivedNavbar', activedNavbar);
      this.$router.push('/');
    },
    
}
  }
</script>

<style scoped>

@media screen and (min-width: 1200px) {
.topnav {overflow: hidden;background-color: #333; width: 100%;}
.topnav a {float: left;display: block;color: #f2f2f2;text-align: center;padding: 14px 16px;text-decoration: none;}
#exit{float: right}
.topnav a:hover {background-color:rgb(165, 161, 161);color: black;}}

@media screen and (max-width: 600px) {
.topnav a {float: none;width: 100%;}
.topnav {overflow: hidden;background-color: #333;}
.topnav a {float: left;display: block;color: #f2f2f2;text-align: center;padding: 14px 16px;text-decoration: none;}

.topnav a:hover {background-color:rgb(165, 161, 161);color: black;}}

@media screen and (min-width: 600px) and (max-width: 1200px) {
.topnav {overflow: hidden;background-color: #333; width: 100%;}
.topnav a {float: left;display: block;color: #f2f2f2;text-align: center;padding: 14px 16px;text-decoration: none;}
#exit{float: right}
.topnav a:hover {background-color:rgb(165, 161, 161);color: black;}}

   
</style>