<template>
  <div class="apex-map">
    <h1> userId {{ userId }}</h1>

    <div class="parcels-container">
      <!-- userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekSessions[sIdx].sessionObservations[oIdx] -->
      <div class="parcels" 
        v-for="(parcel, index) in userDataObj.parcels"
        v-bind:item="parcel"
        v-bind:index="index"
        v-bind:key="parcel.parcelName">
        <p class="text">{{`parcelName: ${parcel.parcelName} parcelOwner: ${parcel.parcelOwner} monitored years:[${parcel.parcelYears}]`}}</p>
      </div>
      Todo add the map
    </div> 

  </div>
</template>

<script>

import ApexDataServices from '../ApexDataServices';

export default {
  name: 'ApexMap',
  
  props:{
    userId:String
  },

  data(){
    return {
      userDataObj: {},
      error: '',
      text: ''
    }
  },

  // life cycle method call when the component is created
  async created(){
    try {

      let userDBRows = await ApexDataServices.getObservations(this.userId);
      this.userDataObj = ApexDataServices.extractUserDataObjFrom(userDBRows);
      ApexDataServices.addWeeksToUserDataObj(this.userDataObj);
      ApexDataServices.enforceConsistencyOfUserDataObj(this.userDataObj);
      ApexDataServices.sortUserDataObjByYearByWeek(this.userDataObj);

      console.log("userDataObj")
      console.log(this.userDataObj)

      
    } catch (error) {
        this.error = error.message;
    } 
  }

  ,methods: {

    // TODO update weeks info

    /*
     TODO 
        Create Table WeekMetrics in agrotic_apex ()
        handle the post query on the server side
     */
    async updateWeekMetrics(parcel, year, week){

      await ApexDataServices.postQuery(
        {
          transaction : "update"
          , dbUserID: parcel.userDBID //  TODO add to Monitored Parcel
          , dbParcelId: parcel.parcelDBId // TODO add to Monitored User
          , yearNumber: year.yearNumber
          , weekNumber: week.weekNumber
          , weekLabel: week.weekLabel
          , nbObservations: week.weekNbObservations
          , nbObsFullGrowth: week.weekNbObsFullGrowth 
          , nbObsSlowGrowth: week.weekNbObsSlowGrowth
          , NbObsStoppedGrowth: week.weekNbObsStoppedGrowth 
          , metricsDateInMs : new Date().getTime()
        } 
      );
      this.posts = await ApexDataServices.getObservations();

    }
  },

}



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
