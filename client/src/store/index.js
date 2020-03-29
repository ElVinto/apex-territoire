import Vue from "vue";
import Vuex from "vuex";
 
Vue.use(Vuex);
 
export default new Vuex.Store({
 state: {
    userDataObj: null //{parcels:[]} // in component acces by: this.$store.state.userDataObj
    ,selectedUserId: 35
    ,selectedYear: null
    ,selectedWeek: null
    ,selectedParcel: null

 },
 getters: {

 },
 mutations: {
     // this.$store.commit("initUserDataObj", usrDataObj);
     initUserDataObj(state,usrDataObj){ 
 
        state.userDataObj=usrDataObj;
     }
 },
 actions: {}
});