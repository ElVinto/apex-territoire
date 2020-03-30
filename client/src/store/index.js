import Vue from "vue";
import Vuex from "vuex";
 
Vue.use(Vuex);
 
export default new Vuex.Store({
 state: {

   /* corresponding user email  ex:
      baptiste.oger@supagro.fr (userId:14 userId:47 )  
      Toto@tu.ti (userId:35), 
      Pichon.leo@gmail.com (userId:35)
   */
   loggedUserEmail: "Toto@tu.ti"
   

   // MonitoredUser Object computed and reorganised logged-in user data pour from the database 
    ,userDataObj: null // in a component call: this.$store.state.userDataObj

    // selected index mapping to the MonitoredParcel object in state.userDataObj.parcels[selectedYearIdx] 
    ,selectedParcelIdx: 0 
   
    // selected index mapping to the MonitoredYear state.userDataObj.parcels[selectedYearIdx].parcelYears[selectedYearIdx]
    ,selectedYearIdx: 0  

    // selected index mapping to the MonitoredWeek state.userDataObj.parcels[selectedYearIdx].parcelYears[selectedYearIdx].yearWeeks[selectedWeekIdx]
    ,selectedWeekIdx: 0 // 

    ,userUpdateWeekMetrics: null
    

 },
 getters: { // computed methods
   

 },

 mutations: { // synchronous  commit of changes of state
     
      initLoggedUserEmail(state,userMail){ 
         state.loggedUserEmail=userMail;
      },

      // in component uses: this.$store.commit("initUserDataObj", usrDataObj);
     initUserDataObj(state,usrDataObj){ 
        state.userDataObj=usrDataObj;
     },

     // in a component uses:  this.$store.commit("changeSelectedYear", yearNumber);
     changeSelectedYear(state,yearNumber){ 
      state.selectedYearNumber=yearNumber;
    },

    changeSelectedWeekNumber(state,weekNumber){ 
      state.selectedWeekNumber=weekNumber;
    }


 },
 actions: { // assynchronous commit of changes

 }
});

/* 

userDataObj is MonitoredUser Ojject
userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekSessions[sIdx].sessionObservations[oIdx] 

MonitoredUser(uEMail,uId, uName) {
        this.userEMail = uEMail;
        this.userId = uId;
        this.userName = uName;
        parcels= [];
    
        this.toString = () => `user: email ${this.userEMail} id: ${this.userId} name ${this.userName}`;    
}

MonitoredParcel(pName, pUserEMail, pUserName, pUserId, pCoord) {
        this.parcelName = pName;

        this.parcelUserEMail = pUserEMail;
        this.parcelUserName = pUserName;
        this.parcelUserId = pUserId;

        this.parcelCoord = pCoord;
        this.parcelYears = [];
        
        this.toString = () => 'parcel: ' + this.parcelName;    
}

MonitoredYear{
        this.yearNumber = yNumber;
        this.yearWeeks = [];
        this.toString = function () { return `year: ${this.yearNumber}`; };
    }

MonitoredWeek{
    
        this.weekNumber = 0 ;
        this.weekLabel = ""; // e.g. 10/02 - 17/02
        this.weekFullDate = new Date();
        this.weekSessions = [];
    
        
        this.weekNbObservations = 0;
        
        this.weekNbObsFullGrowth = 0;
        this.weekNbObsSlowGrowth = 0;
        this.weekNbObsStoppedGrowth = 0;
        
        this.weekPrctFullGrowth = 0.0;
        this.weekPrctSlowGrowth = 0.0;
        this.weekPrctStoppedGrowth = 0.0;

        this.weekAVGrowth = 0;
        
        this.weekICApex = 0;
}
        


 */