<template>
  <div id="app" v-if=" ($store.state.userDataObj!==null) ">

  <template>
      <Menu msg="Place the menu here"/>
      <hr>
      <ApexMap />
      <hr>
      <Footer/>
  </template>
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

      let userEMail =this.$store.state.loggedUserEmail;
 
      ApexDataServices.checkEMail(userEMail).then(emailIsvalid => {
        if(emailIsvalid===true){
            
            // todo update value of this.$store.state.loggedUserEmail through changeLoggedUserEMail() in store
            ApexDataServices.getObservations(userEMail).then( userDBRows =>{ 
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
      });
        
      
    } catch (error) {

      // console.error(error)
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
