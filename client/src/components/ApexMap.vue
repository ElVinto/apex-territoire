<template>
  <div class="apex-map">
    
    <div class="parcels-container" v-if="$store.state.userDataObj!==null">
      <h1> usermail {{ $store.state.loggedUserEmail}} </h1>
      
      <div class="parcels" 
        v-for="(parcel, index) in $store.state.userDataObj.parcels"
        v-bind:item="parcel"
        v-bind:index="index"
        v-bind:key="parcel.parcelName">
        <p class="text">{{`parcelName: ${parcel.parcelName} parcelOwner: ${parcel.parcelOwner} monitored years:[${parcel.parcelYears}]`}}</p>
      </div>
 
    </div> 

    <div class="parcelNames-container" v-if="$store.state.userDataObj!==null">
      <h1> Parcel Name List from Store</h1>
      <div class="userParcelNames"
        v-for="(pName, index) in $store.getters.parcelNameList"
        v-bind:item="pName"
        v-bind:index="index"
        v-bind:key="pName">
        <p class="text">{{`parcelName: ${pName}`}}</p>
      </div>
    </div>

    <div class="parcelNames-container" v-if="$store.state.userDataObj!==null">
     <h1>  year Numbers list from Store </h1>
      <div class="userParcelNames"
        v-for="(yNumber, index) in $store.getters.yearNumberList"
        v-bind:item="yNumber"
        v-bind:index="index"
        v-bind:key="yNumber">
        <p class="text">{{`yearNumber: ${yNumber}`}}</p>
      </div>
    </div>

    <div class="parcelNames-container" v-if="$store.state.userDataObj!==null">
     <h1>  week Label list from Store </h1>
      <div class="userParcelNames"
        v-for="(wLabel, index) in $store.getters.weekLabelList"
        v-bind:item="wLabel"
        v-bind:index="index"
        v-bind:key="wLabel">
        <p class="text">{{`wLabel: ${wLabel}`}}</p>
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

  computed:{
   
     // TODO FIX do not work : this.$store is unknown perhaps because it is not load yet ?

    // parcelNames: () =>  this.$store.getters().parcelList
    
    // ,yearNumbers:() => this.$store.getters.yearList

    // ,weekLabels:() => this.$store.getters.weekLabelList

  },

  methods: {

    /*
     TODO 
      updatedWeekmetrics has been created in agrotic_apex ()
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
