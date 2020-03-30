<template>
  <div class="apex-map">
    
    <div class="parcels-container" v-if="$store.state.userDataObj!==null">
      <h1> usermail {{ $store.state.loggedUserEmail}} </h1>
      <!-- userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekSessions[sIdx].sessionObservations[oIdx] -->
      <div class="parcels" 
        v-for="(parcel, index) in $store.state.userDataObj.parcels"
        v-bind:item="parcel"
        v-bind:index="index"
        v-bind:key="parcel.parcelName">
        <p class="text">{{`parcelName: ${parcel.parcelName} parcelOwner: ${parcel.parcelOwner} monitored years:[${parcel.parcelYears}]`}}</p>
      </div>
      
    </div> 

  </div>
</template>

<script>

import ApexDataServices from '../ApexDataServices';

export default {
  name: 'ApexMap',
  

  data(){
    return {
      
      error: '',
      text: ''
    }
  },

  methods: {

    // TODO update weeks info

    /*
     TODO 
        Create Table WeekMetrics in agrotic_apex ()
        handle the post query on the server side
     */
    async updateWeekMetrics(parcel, year, week){

      // userId
      await ApexDataServices.postQuery(
        {
          transaction : "update_WeekMetrics"
          , userId: parcel.parcelUserId //  TODO add to Monitored Parcel
          , parcelId: parcel.parcelDBId // TODO add to Monitored User
          , yearNumber: year.yearNumber
          , weekNumber: week.weekNumber
          , weekLabel: week.weekLabel
          , nbObservations: week.weekNbObservations
          , nbObsFullGrowth: week.weekNbObsFullGrowth 
          , nbObsSlowGrowth: week.weekNbObsSlowGrowth
          , nbObsStoppedGrowth: week.weekNbObsStoppedGrowth 
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
