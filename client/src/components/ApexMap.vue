<template>
  <div
    id="ApexMap"
    class="row"
    style="position:relative; left: 20px; width: 100%; "
    v-if="$store.state.userDataObj !== null"
  >

  
    <div class="col-md-9">

      <div class="row">
       <!-- Selecting Year Parcel -->
      
        <div class="col-md-2">
          campagne :
          <select v-model="selectedYearIdx">
            <option
              v-for="(elmt, index) in $store.getters.yearNumberList"
              v-bind:key="index"
              v-bind:value="index"
            >
              {{ elmt }}
            </option>
          </select>
        </div>

        <div class="col-md-2">
          semaine :
          <select v-model="selectedWeekIdx">
            <option
              v-for="(elmt, index) in $store.getters.weekLabelList"
              v-bind:key="index"
              v-bind:value="index"
            >
              {{ elmt }}
            </option>
          </select>
        </div>

        <div class="col-md-5">
          parcelle :
          <select v-model="selectedParcelIdx">
            <option
              v-for="(pName, index) in $store.getters.parcelNameList"
              v-bind:key="index"
              v-bind:value="index"
            >
              {{ pName }} ({{
                $store.state.userDataObj.parcels[index].dataOwnerName
              }})
            </option>
          </select>
        </div>

      <!-- Previous year -->  
        <div class="col-md-3">
          <button
            id="viewPrevYear"
            @mouseover="showPrevYear(true)"
            @mouseout="showPrevYear(false)"
          >
            <i class="far fa-eye"></i> campagne précédente
          </button>
          <label v-if="msgPrevYear !== null">
            {{ msgPrevYear }}
          </label>
        </div>

      </div>


      <hr>
      
      <!-- Map -->  

      <div class="row" v-if=" $store.state.viewMode === 'debug' ">
        <p class="text">
          {{
            `nbObsFullGrowth: ${$store.getters.getSelectedWeekMetric.nbObsFullGrowth}, nbObsSlowGrowth: ${$store.getters.getSelectedWeekMetric.nbObsSlowGrowth}, nbObsStoppedGrowth: ${$store.getters.getSelectedWeekMetric.nbObsStoppedGrowth}, (modified: ${$store.getters.getSelectedWeekMetric.modified})`
          }}
        </p>
        <p class="text">
          {{
            `currentzoom: ${currentZoom}, currentCenter: ${currentCenter})`
          }}

        </p>

      </div> 

      <div class="row" 
        style="height: 70%;" >

        <l-map
          ref="parcelInfoMap"
          :zoom="currentZoom"
          :center="currentCenter"
          :options="mapOptions"

          style="height: 100%;" 

          @update:center="centerUpdate"
          @update:zoom="zoomUpdate"
        >
          <l-tile-layer :url="url" :attribution="attribution" />

          <div
            class="parcels"
            v-for="(parcel, index) in $store.state.userDataObj.parcels"
            v-bind:item="parcel"
            v-bind:index="index"
            v-bind:key="index"
          >
            <l-marker
              :lat-lng="getLatLng(parcel.parcelCoord)"
              :icon="createIcon(index)"
              @click="parcelMarkerClick(index)"
            >
              <l-popup>
                <div>
                  <p class="text">
                    parcelle : {{ parcel.parcelName }} <br />
                    observateur : {{ parcel.dataOwnerName }} <br />

                    semaine du :
                    {{ $store.getters.weekLabelList[selectedWeekIdx] }}
                    {{ $store.getters.yearNumberList[selectedYearIdx] }}<br />

                    <template
                      class="text"
                      v-if="$store.getters.getSelectedWeekMetricTotalNbObs > 0"
                    >
                      observations :
                      {{ $store.getters.getSelectedWeekMetricTotalNbObs }} <br />
                      - pleine croissance :
                      {{ $store.getters.getSelectedWeekMetric.nbObsFullGrowth }}
                      <br />
                      - croissance ralentie :
                      {{ $store.getters.getSelectedWeekMetric.nbObsSlowGrowth }}
                      <br />
                      - croissance arrêtée :
                      {{ $store.getters.getSelectedWeekMetric.nbObsStoppedGrowth }}
                      <br />
                    </template>
                    <template v-else> (pas d'observations)<br /> </template>
                  </p>
                </div>
              </l-popup>
            </l-marker>
          </div>
        </l-map>
      </div> 

    
    </div>

    <!-- Indicators Components  -->
    <div class="col-md-3" style="max-height: 80%; max-width: 25%; margin: auto;">
      

      <h2>Suivi de croissance </h2>
      parcelle: {{this.$store.getters.parcelNameList[this.$store.state.selectedParcelIdx]}} <br>
    
      <hr>

      semaine du
        {{this.$store.getters.weekLabelList[this.$store.state.selectedWeekIdx]}} {{this.$store.getters.yearNumberList[this.$store.state.selectedYearIdx]}}
        <br>
      <apex-growth-pie-chart class="pieChartStyle"></apex-growth-pie-chart>
      <hr>

      <!-- évolution par rapport à semaine précédente
      <hr> -->

      évolution de la croissance {{this.$store.getters.yearNumberList[this.$store.state.selectedYearIdx]}}
      <apex-growth-line-chart></apex-growth-line-chart>
      <hr>

      évolution de la contrainte hydrique {{this.$store.getters.yearNumberList[this.$store.state.selectedYearIdx]}}
      <apex-hydric-constraint-line-chart></apex-hydric-constraint-line-chart>
      <hr>

    </div>

    
  </div>


</template>

<script>




// import map libraries and components
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";

import { Icon } from "leaflet";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

import ApexMapServices from "../ApexMapServices";

// import subcomponents librairies and 

import ApexGrowthPieChart from "./apexMapComponents/ApexGrowthPieChart"
import ApexGrowthLineChart from "./apexMapComponents/ApexGrowthLineChart"
import ApexHydricConstraintLineChart from "./apexMapComponents/ApexHydricConstraintLineChart"


// import styles librairies

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

export default {
  name: "ApexMap",

  components: {

    // map components
    LMap,
    LTileLayer,
    LMarker,
    LPopup,

    // other apex indicators sub components

    ApexGrowthPieChart,
    ApexGrowthLineChart,
    ApexHydricConstraintLineChart

  },

  data() {
    return {
      selectedParcelIdx: 0,
      selectedYearIdx: 0,
      selectedWeekIdx: 0,


      // url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      // url: "'https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
      url:
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",

      // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      // attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",

      currentZoom: 13,
      currentCenter: latLng(43.6452, 3.87189),

      mapOptions: {
        zoomSnap: 0.5,
      },

      prevYearIsShowned: false, // flag for previous year
      msgPrevYear: null,
    };
  },

  computed: {},

  async created() {
    this.selectedParcelIdx = this.$store.state.selectedParcelIdx;
    this.selectedYearIdx = this.$store.state.selectedYearIdx;
    this.selectedWeekIdx = this.$store.state.selectedWeekIdx;
  },

  // mounted: function() {
  //   // In theory this call happen after the elements have been attached to the HTML DOM
  //   this.$nextTick(function () {
  //     // console.log(this.$refs.parcelInfoMap)
  //   })
  // },

  watch: {
    selectedParcelIdx: function (val) {
      this.$store.commit("updateSelectedParcelIdx", val);
      this.parcelMarkerClick(val);
    },
    selectedYearIdx: function (val) {
      this.$store.commit("updateSelectedYearIdx", val);
    },
    selectedWeekIdx: function (val) {
      this.$store.commit("updateSelectedWeekIdx", val);
    },

    currentCenter: function (val) {
      this.$refs.parcelInfoMap.setCenter(val);
    },
  },

  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },

    centerUpdate(center) {
      this.currentCenter = center;
    },

    innerClick() {
      alert("Click!");
    },

    getLatLng(coord) {
      return latLng(coord.lat, coord.lng);
    },

    parcelMarkerClick(pIdx) {
      console.log("parcelMarkerClick pIdx: " + pIdx);

      if (pIdx !== this.selectedParcelIdx) {
        this.selectedParcelIdx = parseInt(pIdx);
      }

      let lat = this.$store.state.userDataObj.parcels[pIdx].parcelCoord.lat;
      let lng = this.$store.state.userDataObj.parcels[pIdx].parcelCoord.lng;

      this.currentCenter = latLng(lat, lng);

      console.log("this.$refs.parcelInfoMap");

      console.log(this.$refs.parcelInfoMap);
    },

    showPrevYear(show) {
      if (show) {
        if (this.selectedYearIdx === 0) {
          this.msgPrevYear =
            "pas d'observations avant " +
            this.$store.getters.yearNumberList[this.selectedYearIdx];
        } else {
          this.selectedYearIdx = this.selectedYearIdx - 1;
          this.prevYearIsShowned = show;
        }
      } else {
        if (this.prevYearIsShowned) {
          this.selectedYearIdx = this.selectedYearIdx + 1;
          this.prevYearIsShowned = show;
        }
        this.msgPrevYear = null;
      }
    },

    createIcon(pIdx) {
      let avgGrowth = -1;
      let nbTotalObs = this.$store.getters.getTotalNbObs(
        pIdx,
        this.selectedYearIdx,
        this.selectedWeekIdx
      );
      if (nbTotalObs > 0) {
        avgGrowth = this.$store.getters.getAvgGrowth(
          pIdx,
          this.selectedYearIdx,
          this.selectedWeekIdx
        );
      }

      console.log("pIdx: " + pIdx + " avgGrowth: " + avgGrowth);

      let color = ApexMapServices.avgGrowthToGreenColor(avgGrowth);

      if (this.prevYearIsShowned === true) {
        console.log(" color pin border : ");
        color = color + "_bordered";
      }

      return new Icon({
        iconUrl: "images/my_" + color + "_pin.png",
        iconSize: [22, 35],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
      });
    },
  },
};
</script>

<style scoped>

.pieChartStyle{
  height: auto;
  width: 40%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

</style>