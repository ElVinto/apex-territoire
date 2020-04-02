import Vue from "vue";
import Vuex from "vuex";
import ApexDataServices from '../ApexDataServices';

Vue.use(Vuex);

export default new Vuex.Store({
   state: {

      /* corresponding user email  ex:
         baptiste.oger@supagro.fr (userId:14 userId:47 )  
         Toto@tu.ti (userId:35), 
         Pichon.leo@gmail.com (userId:35)
      */
      loggedUserEmail: "baptiste.oger@supagro.fr"

      // MonitoredUser Object computed and reorganised logged-in user data pour from the database 
      , userDataObj: null // in a component call: this.$store.state.userDataObj

      // selected index mapping to the MonitoredParcel object in state.userDataObj.parcels[selectedYearIdx] 
      , selectedParcelIdx: 0

      // selected index mapping to the MonitoredYear state.userDataObj.parcels[selectedYearIdx].parcelYears[selectedYearIdx]
      , selectedYearIdx: 0

      // selected index mapping to the MonitoredWeek state.userDataObj.parcels[selectedYearIdx].parcelYears[selectedYearIdx].yearWeeks[selectedWeekIdx]
      , selectedWeekIdx: 0 // 

      , userModifiedWeekMetrics: new Map()


   },

   // userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekSessions[sIdx].sessionObservations[oIdx]
   getters: { // computed methods

      parcelNameList: (state) => {
         if (state.userDataObj !== null && state.userDataObj.parcels !== null) {
            return state.userDataObj.parcels.map(parcel => parcel.parcelName)
         } else {
            return [];
         }
      },

      yearNumberList: (state) => {
         if (state.userDataObj !== null && state.userDataObj.parcels[state.selectedParcelIdx] !== null) {
            return state.userDataObj.parcels[state.selectedParcelIdx].parcelYears.map(year => year.yearNumber)
         } else {
            return [];
         }
      },

      weekLabelList: (state) => {
         if (state.userDataObj !== null
            && state.userDataObj.parcels[state.selectedParcelIdx] !== null
            && state.userDataObj.parcels[state.selectedParcelIdx].parcelYears[state.selectedYearIdx] !== null
            && state.userDataObj.parcels[state.selectedParcelIdx].parcelYears[state.selectedYearIdx].yearWeeks !== null
         ) {

            return state.userDataObj
               .parcels[state.selectedParcelIdx]
               .parcelYears[state.selectedYearIdx]
               .yearWeeks.map(week => week.weekLabel)
         } else {
            return [];
         }
      },

      getParcelIdx: (state) => (parcelName, dataOwnerEMail) => {
         if (state.userDataObj !== null) {
            return state.userDataObj.parcels.findIndex(p => (p.parcelName === parcelName && p.dataOwnerEMail === dataOwnerEMail))
         } else {
            return null;
         }

      },

      getYearIdx: (state) => (yearNumber) => {
         if (state.userDataObj !== null) {
            // recall that  all parcels in userDataObj  are uniform and have equal list of sorted years
            return state.userDataObj.parcels[0].parcelYears.findIndex(y => y.yearNumber === yearNumber);
         } else {
            return -1;
         }
      },

      getWeekIdx: (state) => (weekNumber) => {
         if (state.userDataObj !== null) {
            // recall that  all years in userDataObj are uniform and have equal list of sorted weeks
            return state.userDataObj.parcels[0].parcelYears[0].yearWeeks.findIndex(w => w.weekNumber === weekNumber);
         } else {
            return -1;
         }
      },


      getSelectedWeekMetric: (state,getters) =>{
         return getters.getWeekMetric(state.selectedParcelIdx, state.selectedYearIdx, state.selectedWeekIdx)
      },

      getWeekMetric: (state) => (pIdx,yIdx,wIdx) => {

         let pIdx_yIdx_wIdx_mapkey = `pIdx:${pIdx} yIdx:${yIdx} wIdx:${wIdx}`;

         console.log("pIdx_yIdx_wIdx_mapkey")
         console.log(pIdx_yIdx_wIdx_mapkey);

         if(state.userModifiedWeekMetrics.has(pIdx_yIdx_wIdx_mapkey)){
            console.log("modified week metrics");
            console.log(state.userModifiedWeekMetrics.get(pIdx_yIdx_wIdx_mapkey));

            return state.userModifiedWeekMetrics.get(pIdx_yIdx_wIdx_mapkey);
         }else{

            state.userDataObj.parcels[state.selectedParcelIdx].parcelYears[state.selectedYearIdx]
            let date = new Date(state.userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekFullDate);

            let weekmetrics= {
               dataUserEMail: state.userDataObj.dataUserEMail
               , dataOwnerEMail: state.userDataObj.parcels[pIdx].dataOwnerEMail
               , parcelName: state.userDataObj.parcels[pIdx].parcelName
               , yearNumber: state.userDataObj.parcels[pIdx].parcelYears[yIdx].yearNumber
               , weekNumber: state.userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekNumber
               , nbObsFullGrowth: state.userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekNbObsFullGrowth
               , nbObsSlowGrowth: state.userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekNbObsSlowGrowth
               , nbObsStoppedGrowth: state.userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekNbObsStoppedGrowth 
               , dateTimeInMs: date.getTime()
               , modified : false
           }

           console.log("initially computed week metrics");
           console.log(weekmetrics);
           return weekmetrics;

         }

      }


   },

   mutations: { // synchronous  commit of changes of state

      initLoggedUserEmail(state, userMail) {
         state.loggedUserEmail = userMail;
      },

      // in component uses: this.$store.commit("initUserDataObj", usrDataObj);
      initUserDataObj(state, usrDataObj) {
         state.userDataObj = usrDataObj;
      },

      // TODO chack that pIdx is not out of range
      updateSelectedParcelIdx(state, pIdx) {
         console.log(" updated selectedParcelIdx store " + pIdx)
         state.selectedParcelIdx = pIdx;
      },

      // in a component uses:  this.$store.commit("changeSelectedYear", yearNumber);
      updateSelectedYearIdx(state, yIdx) {
         state.selectedYearIdx = yIdx;
      },

      updateSelectedWeekIdx(state, wIdx) {
         state.selectedWeekIdx = wIdx;
      },

      initUserModifiedWeekMetrics(state) {

         console.log("initUserModifiedWeekMetrics");

         ApexDataServices.sendToModifiedWeekMetrics(
            {
               transaction: "select_modifiedweekmetrics",
               userEMail: state.userDataObj.userEMail
            }
         ).then(modifiedWeekMetricsDBrows => {
            
            console.log(modifiedWeekMetricsDBrows)

            let modifiedWeekMetrics = new Map();
            for (let row of modifiedWeekMetricsDBrows) {

               // let pIdx <=> getters.getParcelIdx(row.parcelName, row.dataOwnerEMail); unfortunately  getters are not accessible
               let pIdx = state.userDataObj.parcels.findIndex(p => (p.parcelName === row.parcelName && p.dataOwnerEMail === row.dataOwnerEMail))

               // let yIdx <=> getters.getYearIdx(row.yearNumber) unfortunately  getters are not accessible
               let yIdx =state.userDataObj.parcels[0].parcelYears.findIndex(y => y.yearNumber === row.yearNumber);

               // let wIdx = getters.getWeekIdx(row.weekNumber) unfortunately  getters are not accessible
               let wIdx =state.userDataObj.parcels[0].parcelYears[0].yearWeeks.findIndex(w => w.weekNumber === row.weekNumber);

               // WARNING TO DO NOT DEFINE OBJECT EQUALITY each key in modifiedWeekMetrics map is a composed String
               row.modified =true;

               modifiedWeekMetrics.set(`pIdx:${pIdx} yIdx:${yIdx} wIdx:${wIdx}`, row)
               //

            }
            console.log("modifiedWeekMetrics")
            console.log(modifiedWeekMetrics)

            state.userModifiedWeekMetrics = modifiedWeekMetrics;
         });

      },

      saveSelectedWeekMetric(state, week_metric){

         // WARNING NOTE THAT  week_metric should corresponds to the result of getter.getSelectedWeekMetric
         // Weird things in vuex we connot acces getters from mutations
         week_metric.modified =true;

         state.modifiedWeekMetrics.set(`pIdx:${state.selectedParcelIdx} yIdx:${state.selectedYearIdx} wIdx:${state.selectedYearIdx}`, week_metric)

         // record in database
         week_metric.transaction = "alter_modifiedweekmetrics";
         ApexDataServices.sendToModifiedWeekMetrics(week_metric).then(res =>{
            console.log(res);
         });

      },

      deleteSelectedWeekMetric(state, week_metric){

         console.log("deleteSelectedWeekMetric ");
         // WARNING NOTE THAT week_metric should corresponds to the result of getter.getSelectedWeekMetric
         // Weird things in vuex we connot acces getters from mutations

         if(week_metric.modified ){
            state.modifiedWeekMetrics.delete(`pIdx:${state.selectedParcelIdx} yIdx:${state.selectedYearIdx} wIdx:${state.selectedYearIdx}`, week_metric)
            week_metric.transaction = "delete_modifiedweekmetrics";
            
            ApexDataServices.sendToModifiedWeekMetrics(week_metric).then(res =>{
               console.log(res);
            });


         }else{
            console.log("only modified week metrics can be deleted ");
         }

         

         // record in database
         

      },


   },
   actions: { // assynchronous commit of changes

   }
});

/*

userDataObj is MonitoredUser Ojject

userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekSessions[sIdx].sessionObservations[oIdx]

MonitoredUser(uEMail,uId, uName) {
        this.dataUserEMail = uEMail;
        this.userId = uId;
        this.userName = uName;
        parcels= [];

        this.toString = () => `user: email ${this.userEMail} id: ${this.userId} name ${this.userName}`;
}

 MonitoredParcel(pName, ownerEMail, ownerName, ownerId, pCoord) {
        this.parcelName = pName;

        this.dataOwnerEMail = ownerEMail;
        this.dataOwnerName = ownerName;
        this.dataOwnerId = ownerId;

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