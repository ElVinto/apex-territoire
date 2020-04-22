<template>
  <div
    id="ApexMap"
    class="global"
    style="position:relative; left: 20px; width: 100%; "
    v-if="$store.state.userDataObj !== null"
  >
    <div class="body">
      <div class="menu">
        <!-- Selecting Year Parcel -->
        <div class="case">
          <div class="campagne ">
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

          <div class="semaine">
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
        </div>
        <div class=" parcelle">
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
        <div class="campagnepr">
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

      <hr />

      <div class="map">
        <div class="headermap" v-if="$store.state.viewMode === 'debug'">
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

        <div class="bodymap">
          <l-map
            ref="parcelInfoMap"
            :zoom="currentZoom"
            :center="currentCenter"
            :options="mapOptions"
            style=" height: 100%; "
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
                      <b> parcelle</b> : {{ parcel.parcelName }} <br />
                      <b>observateur</b> : {{ parcel.dataOwnerName }} <br />

                      <b>semaine du </b>:
                      {{ $store.getters.weekLabelList[selectedWeekIdx] }}
                      {{ $store.getters.yearNumberList[selectedYearIdx] }}<br />

                      <template
                        class="text"
                        v-if="
                          $store.getters.getSelectedWeekMetricTotalNbObs > 0
                        "
                      >
                        <b>Contrainte hydrique</b> :
                        {{
                          $store.getters.getSelectedWeekMetricHydricConstraint
                        }}
                        <br />
                        <b>Indice de croissance</b> :
                        {{ $store.getters.getSelectedWeekMetricAvgGrowth }}
                        <br />
                        <b>observations</b> :
                        {{ $store.getters.getSelectedWeekMetricTotalNbObs }}
                        <br />
                        # Pleine croissance :
                        {{
                          $store.getters.getSelectedWeekMetric.nbObsFullGrowth
                        }}
                        <br />
                        # Croissance ralentie :
                        {{
                          $store.getters.getSelectedWeekMetric.nbObsSlowGrowth
                        }}
                        <br />
                        # Croissance arrêtée :
                        {{
                          $store.getters.getSelectedWeekMetric
                            .nbObsStoppedGrowth
                        }}
                        <br />
                      </template>
                      <template v-else> (pas d'observations)<br /> </template>
                      <router-link to="/informations" class="nav-link" style="text-align:right">éditer</router-link>
                    </p>
                  </div>
                </l-popup>
              </l-marker>
            </div>
          </l-map>
        </div>
      </div>
    </div>

    <!-- Indicators Components  -->
    <div class="graphe">
      <div id="title">
        <p style="font-size:20px">
          parcelle:
          {{
            this.$store.getters.parcelNameList[
              this.$store.state.selectedParcelIdx
            ]
          }}
        </p>
        
      </div>

      <hr /> 

      <div id="graphe1">
        <p style="font-size:20px">
          croissance des apex semaine du
          {{
            this.$store.getters.weekLabelList[this.$store.state.selectedWeekIdx]
          }}
          {{
            this.$store.getters.yearNumberList[
              this.$store.state.selectedYearIdx
            ]
          }}
        </p>
        <apex-growth-pie-chart class="item"></apex-growth-pie-chart>
      </div>
      <hr />

      <!-- évolution par rapport à semaine précédente
      <hr> -->
      <div id="graphe2">
        <p style="font-size:20px;">
          évolution de la croissance des apex
          {{
            this.$store.getters.yearNumberList[
              this.$store.state.selectedYearIdx
            ]
          }}
          <apex-growth-line-chart class="item"></apex-growth-line-chart>
        </p>
      </div>
      <hr />
      <div id="graphe3">
        évolution de la contrainte hydrique
        {{
          this.$store.getters.yearNumberList[this.$store.state.selectedYearIdx]
        }}
        <apex-hydric-constraint-line-chart
          class="item"
        ></apex-hydric-constraint-line-chart>
      </div>
      <hr />
      <router-link to="/informations" class="nav-link" >éditer</router-link>
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

import ApexMapServices from "../services/ApexMapServices";

// import subcomponents librairies and

import ApexGrowthPieChart from "./apexMapComponents/ApexGrowthPieChart";
import ApexGrowthLineChart from "./apexMapComponents/ApexGrowthLineChart";
import ApexHydricConstraintLineChart from "./apexMapComponents/ApexHydricConstraintLineChart";

// import styles librairies

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

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
    ApexHydricConstraintLineChart,
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

      currentZoom: 18,
      currentCenter: latLng(43.6452, 3.87189),

      mapOptions: {
        zoomSnap: 0.5,
      },

      prevYearIsShowned: false, // flag for previous year
      msgPrevYear: null,
    };
  },


  async created() {
    if (!this.$store.state.loggedUserEmail) {
      this.$router.push("/");
    }

    this.selectedParcelIdx = this.$store.state.selectedParcelIdx;
    this.selectedYearIdx = this.$store.state.selectedYearIdx;
    this.selectedWeekIdx = this.$store.state.selectedWeekIdx;

    
  },

  mounted() {
    if (!this.$store.state.loggedUserEmail) {
      this.$router.push("/");
    }


    this.selectedParcelIdx = this.$store.state.selectedParcelIdx;
    this.selectedYearIdx = this.$store.state.selectedYearIdx;
    this.selectedWeekIdx = this.$store.state.selectedWeekIdx;

    this.$store.commit("incrementForceComponentUpdateCounter");
    
    // this.$nextTick(() => {
      
    //   this.selectedParcelIdx = this.$store.state.selectedParcelIdx;
    //   this.selectedYearIdx = this.$store.state.selectedYearIdx;
    //   this.selectedWeekIdx = this.$store.state.selectedWeekIdx;

    //   this.$store.commit("incrementForceComponentUpdateCounter");

    // });
  },

  watch: {
    selectedParcelIdx: function(val) {
      console.log(" watch update selectedParcelIdx val");
      console.log(val);

      this.$store.commit("updateSelectedParcelIdx", val);
      this.parcelMarkerClick(val);
    },

    selectedYearIdx: function(val) {
      console.log(" watch update selectedYearIdx val");
      console.log(val);

      this.$store.commit("updateSelectedYearIdx", val);
    },

    selectedWeekIdx: function(val) {
      console.log(" watch update selectedWeekIdx val");
      console.log(val);

      this.$store.commit("updateSelectedWeekIdx", val);
    },

    currentCenter: function(val) {
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

      // console.log("this.$refs.parcelInfoMap");
      // console.log(this.$refs.parcelInfoMap);
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
        avgGrowth = Math.round(avgGrowth *100)/100.0
      }

      console.log("createIcon pIdx: " + pIdx + " avgGrowth: " + avgGrowth);

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
.body {
  grid-area: bo;
  height: 110%;
  position: relative;
  margin-bottom: 20px;
  margin-right: 15px;
}
.menu {
  grid-area: me;
  height: 0px;
  width: 100%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  padding-top: 10px;
}
.campagne {
  grid-area: ca;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
.semaine {
  grid-area: se;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
.parcelle {
  grid-area: pa;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
.graphe {
  grid-area: gr;
  margin-right: 10px;
}
.campagnepr {
  grid-area: cap;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
#graphe1 {
  grid-area: gr1;
}
#graphe2 {
  grid-area: gr2;
}
#graphe3 {
  grid-area: gr3;
}
#title {
  grid-area: ti;
}
.case {
  grid-area: case;
}
.headermap {
  height: 0px;
  grid-area: hm;
  width: 0px;
}
.item {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0px;
  margin-top: 10px;
  width: 300px;
  height: 150px;
  padding: 00px;
}
.map {
  grid-area: ma;
  height: 100%;
  width: 100%;
  
  margin-top: 10px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
.bodymap {
  grid-area: bdm;
}

@media (min-width: 1200px) {
  .global {
    display: grid;
    grid-template-columns: repeat(4, 10fr);

    grid-template-areas: "bo bo bo gr  ";
  }

  .body {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-auto-rows: repeat(12, 1fr);
    grid-template-areas:
      "me"
      "ma"
      "ma"
      "ma"
      "ma"
      "ma"
      "ma"
      "ma"
      "ma"
      "ma"
      "ma"
      "ma";
  }
  .map {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-areas: "bdm";
  }
  .menu {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas: "case pa cap ";
  }
  .case {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: "ca se ";
  }
}

@media screen and (min-width: 600px) and (max-width: 1200px) {
}
@media (max-width: 600px) {
  .global {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-template-areas:
      "bo"
      "gr";
  }

  .body {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-auto-rows: repeat(14, 1fr);
    grid-template-areas:
      "me"
      "ma"
      "ma"
      "ma"
      "ma"
      "ma"
      "ma"
      "ma"
      "ma"
      "ma";
  }
  .menu {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-areas:
      "case "
      "pa "
      "cap ";
  }
  .case {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-areas:
      "ca "
      "se ";
  }
}
</style>
