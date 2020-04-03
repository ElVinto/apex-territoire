<template>
  <div class="apex-map" v-if="$store.state.userDataObj!==null">
    
    <div class="Map">
      <p v-if="centre"> Lat: {{ centre.lat }}, lon {{ centre.lng }} </p>
      <div id="mapId"></div>
    </div>

  </div>
</template>

<script>

import 'leaflet'
const L = window.L;



export default {
  name: 'ApexMap',
    
  data(){
    return {
      selectedParcelIdx:0
      ,selectedYearIdx:0
      ,selectedWeekIdx:0

      ,map:[]
      ,centre:{lat:43.6195,lng:3.85722}
    }
  },

  // async created() {
    
  //   this.selectedParcelIdx = this.$store.state.selectedParcelIdx;
  //   this.selectedYearIdx = this.$store.state.selectedYearIdx
  //   this.selectedWeekIdx = this.$store.state.selectedWeekIdx

  //   this.center = this.$store.state.userDataObj.parcels[this.selectedParcelIdx].parcelCoord

  //   console.log("this.center") 
  //   console.log(this.center)
    
  // },

  mounted() {

      


    // <link rel="stylesheet" 
    //     href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
    //     integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
    //     crossorigin="" />
     
    //  let leaflet_stylesheet = document.createElement('link')
    //   leaflet_stylesheet.setAttribute('rel','stylesheet')
    //   leaflet_stylesheet.setAttribute('href','https://unpkg.com/leaflet@1.6.0/dist/leaflet.css')
    //   leaflet_stylesheet.setAttribute('integrity','sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==')
    //   leaflet_stylesheet.setAttribute('crossorigin','')
    //   document.head.appendChild(leaflet_stylesheet)

      // <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
      //   integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
      //   crossorigin="">

      // let leaflet_script = document.createElement('script')
      // leaflet_script.setAttribute('rel','https://unpkg.com/leaflet@1.6.0/dist/leaflet.js')
      // leaflet_script.setAttribute('integrity','sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==')
      // leaflet_script.setAttribute('crossorigin','')
      // document.head.appendChild(leaflet_script)



    

    // const map = L.map('mapId').setView([this.centre.lat, this.centre.lng], 12);
    //     L.tileLayer(
    //         'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    //         , {
    //             maxZoom: 18,
    //             attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    //                 '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    //                 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //             id: 'mapbox/satellite-v9'
    //         }).addTo(map);
    // this.map = map;
  


    const map = L.map('mapId').setView([37.4501001, -121.9107704], 4)
    L.tileLayer('https://{s}.tiles.mapbox.com/v4/{user}.{mapId}/{z}/{x}/{y}.png?access_token={token}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      mapId: 'i81oam9h',
      user: 'skycatch-dev',
      token: 'pk.eyJ1Ijoic2t5Y2F0Y2gtZGV2IiwiYSI6Ik1PVjVYNEkifQ.j2X9OOZDz7ABqUvHk4kesw'
    }).addTo(map)
    this.map = map
    // this.addPlaces(this.places)


    
  },


  watch:{
    selectedParcelIdx: function(val){
      this.$store.commit("updateSelectedParcelIdx",val);
    }
    ,selectedYearIdx: function(val){
      this.$store.commit("updateSelectedYearIdx",val);
    }
    ,selectedWeekIdx: function(val){
      this.$store.commit("updateSelectedWeekIdx",val);
    }

  },

  

}

</script>



<style scoped>
@import "../../node_modules/leaflet/dist/leaflet.css";
/* @import "../../node_modules/leaflet.markercluster/dist/MarkerCluster.css"; */

mapId {
  width: 100%;
  height: 400px;
  font-weight: bold;
  font-size: 13px;
  text-shadow: 0 0 2px #fff;
  /* leaflet-shadow-pane > .leaflet-marker-shadow
    display: none; */
}
</style>