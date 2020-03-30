<template>
  <div id="app" v-if="$store.state.userDataObj!==null">
    <Menu msg="Place the menu here"/>
    <hr>
    <ApexMap />
    <hr>
    <Footer/>
  </div>
</template>

<script>



import Menu from './components/Menu.vue'
import ApexMap from './components/ApexMap.vue'
import Footer from './components/Footer.vue'
import ApexDataServices from './ApexDataServices';

export default {
  name: 'App',
  components: {
    Menu,
    ApexMap,
    Footer
  },
  
  async created() {
    try {

      // todo 
        ApexDataServices.checkEMail(this.$store.state.loggedUserEmail).then(mailIsvalid => {
          if(mailIsvalid){
            // todo update value of this.$store.state.loggedUserEmail through changeLoggedUserEMail() in store
            ApexDataServices.getObservations(this.$store.state.loggedUserEmail).then( userDBRows =>{ 
              let userDataObj = ApexDataServices.extractUserDataObjFrom(userDBRows);
              ApexDataServices.addWeeksToUserDataObj(userDataObj);
              ApexDataServices.enforceConsistencyOfUserDataObj(userDataObj);
              ApexDataServices.sortUserDataObjByYearByWeek(userDataObj);

              this.$store.commit("initUserDataObj", userDataObj);

              console.log("updated $store.state.userDataObj: ")
              console.log(this.$store.state.userDataObj)
            })
          }else{
            console.log("mail is not valid")
          }
        })
      
    } catch (error) {
        this.error = error.message;
    }
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
