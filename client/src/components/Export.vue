<template>
  <div class="global" v-if="$store.state.userDataObj !== null">
    <br />

    <div class="title">
      <hr />
      <h4>
        Bonjour {{ $store.getters.getDisplayedUserName }}
      </h4>
      <hr />
    </div>

    <div class="menu">
      <div class="divmenu">
        <label id="label"><b>Compagne</b></label>
        <select
          id="select"
          v-model="selectedYearIdx"
          class="custom-select"
          style="width:260px;"
        >
          <option
            v-for="(elmt, index) in $store.getters.yearNumberList"
            v-bind:key="index"
            v-bind:value="index"
            >{{ elmt }}
          </option>
        </select>
      </div>

      <div class="divmenu">
        <label id="label">Semaine</label>
        <select
          id="select"
          v-model="selectedWeekIdx"
          class="custom-select"
          style="width:260px;"
        >
          <option
            v-for="(elmt, index) in $store.getters.weekLabelList"
            v-bind:key="index"
            v-bind:value="index"
            >{{ elmt }}
          </option>
        </select>
      </div>

      <div class="divmenu">
        <label id="label">Parcelle</label>
        <select
          id="select"
          v-model="selectedParcelIdx"
          class="custom-select"
          style="width:260px;"
        >
          <option
            v-for="(pName, index) in $store.getters.parcelNameList"
            v-bind:key="index"
            v-bind:value="index"
            >{{ pName }} 
            ({{
              $store.getters.getDisplayedUserNameIfNeeded(
                $store.state.userDataObj.parcels[index].dataOwnerEMail,
                $store.state.userDataObj.parcels[index].dataOwnerName
              )
            }})
          </option>
        </select>
      </div>
    </div>

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
      
    </div>

    <div class="export" style="margin-top:10px">
      <hr />
      <button
        id="expdf"
        @click="
          exportPDF(
            $store.getters.getSelectedWeekMetric.nbObsFullGrowth,
            $store.getters.getSelectedWeekMetric.nbObsSlowGrowth,
            $store.getters.getSelectedWeekMetric.nbObsStoppedGrowth
          )
        "
        class="btn btn-danger btn-sm"
      >
        Export en PDF
      </button>
      <button
        id="excsv"
        @click="
          ExportCSV(
            $store.getters.getSelectedWeekMetric.nbObsFullGrowth,
            $store.getters.getSelectedWeekMetric.nbObsSlowGrowth,
            $store.getters.getSelectedWeekMetric.nbObsStoppedGrowth
          )
        "
        class="btn btn-success btn-sm"
      >
        Export en CSV
      </button>
      <hr />
    </div>
  </div>
</template>

<script>
import { latLng } from "leaflet";
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
import * as jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  name: "App",
  components: {
    ApexGrowthPieChart,
    ApexGrowthLineChart,
    ApexHydricConstraintLineChart,
  },
  props: { userId: String },

  data() {
    return {
      userDataObj: [],
      userDBRows: [],
      error: "",
      selectedParcelIdx: 0,
      selectedYearIdx: 0,
      selectedWeekIdx: 0,
      parceld: "",
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
    
    this.$nextTick(() => {
      
      this.selectedParcelIdx = this.$store.state.selectedParcelIdx;
      this.selectedYearIdx = this.$store.state.selectedYearIdx;
      this.selectedWeekIdx = this.$store.state.selectedWeekIdx;

      this.$store.commit("incrementForceComponentUpdateCounter");

    });

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

    async sendToModif(nbObsFullGrowth, nbObsSlowGrowth, nbObsStoppedGrowth) {
      var week_metric = {
        transaction: "alter_modifiedweekmetrics",
        dataUserEMail: this.$store.state.userDataObj.userEMail,
        dataOwnerEMail: this.$store.state.userDataObj.userEMail,
        parcelName: this.$store.state.userDataObj.parcels[
          this.$store.state.selectedParcelIdx
        ].parcelName,
        yearNumber: this.$store.state.userDataObj.parcels[
          this.$store.state.selectedParcelIdx
        ].parcelYears[this.$store.state.selectedYearIdx].yearNumber,
        weekNumber: this.$store.state.userDataObj.parcels[
          this.$store.state.selectedParcelIdx
        ].parcelYears[this.$store.state.selectedYearIdx].yearWeeks[
          this.$store.state.selectedWeekIdx
        ].weekNumber,
        nbObsFullGrowth: parseInt(nbObsFullGrowth),
        nbObsSlowGrowth: parseInt(nbObsSlowGrowth),
        nbObsStoppedGrowth: parseInt(nbObsStoppedGrowth),
        dateTimeInMs: new Date(),
      };

      await this.$store.commit("saveSelectedWeekMetric", week_metric);
    },

    async sendToDelete() {},

    exportPDF(nbObsFullGrowth, nbObsSlowGrowth, nbObsStoppedGrowth) {
      var parcelName = this.$store.state.userDataObj.parcels[
        this.$store.state.selectedParcelIdx
      ].parcelName;
      var yearNumber = this.$store.state.userDataObj.parcels[
        this.$store.state.selectedParcelIdx
      ].parcelYears[this.$store.state.selectedYearIdx].yearNumber;
      var weekNumber = this.$store.state.userDataObj.parcels[
        this.$store.state.selectedParcelIdx
      ].parcelYears[this.$store.state.selectedYearIdx].yearWeeks[
        this.$store.state.selectedWeekIdx
      ].weekNumber;
      var columns = [
        "parcelle",
        "compagne",
        "semaine",
        "Croissance arrêtée",
        "Croissance ralentie",
        "Pleine croissance",
      ];
      var rows = [
        [
          parcelName,
          yearNumber,
          weekNumber,
          nbObsStoppedGrowth,
          nbObsSlowGrowth,
          nbObsFullGrowth,
        ],
      ];
      var pdf = new jsPDF("p", "pt");

      pdf.autoTable(columns, rows);
      pdf.save("table.pdf");
    },

    ExportCSV(nbObsFullGrowth, nbObsSlowGrowth, nbObsStoppedGrowth) {
      var NomParcel = "Nom de parcelle";
      var Compagne = "Compagne";
      var Semaine = "Semaine";
      var croissanceaccelere = "croissance accelere";
      var croissancerelentie = "croissance ralentie ";
      var croissancestoppe = "croissance stopper";
      var parcelName = this.$store.state.userDataObj.parcels[
        this.$store.state.selectedParcelIdx
      ].parcelName;
      var yearNumber = this.$store.state.userDataObj.parcels[
        this.$store.state.selectedParcelIdx
      ].parcelYears[this.$store.state.selectedYearIdx].yearNumber;
      var weekNumber = this.$store.state.userDataObj.parcels[
        this.$store.state.selectedParcelIdx
      ].parcelYears[this.$store.state.selectedYearIdx].yearWeeks[
        this.$store.state.selectedWeekIdx
      ].weekNumber;
      var arrObject = [
        {
          NomParcel,
          Compagne,
          Semaine,
          croissanceaccelere,
          croissancerelentie,
          croissancestoppe,
        },
      ];
      var arrData = [
        {
          parcelName,
          yearNumber,
          weekNumber,
          nbObsFullGrowth,
          nbObsSlowGrowth,
          nbObsStoppedGrowth,
        },
      ];

      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += [
        Object.keys(arrObject[0]).join(";"),
        arrData.map((item) => Object.values(item).join(";")),
      ]
        .join("\n")
        .replace(/(^\[)|(\]$)/gm, "");

      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", "export.csv");
      link.click();
    },
  },

  computed: {
    depletedProducts() {
      return this.$store.getters.getSelectedWeekMetric;
    },
  },

  watch: {
    selectedParcelIdx: function(val) {
      this.$store.commit("updateSelectedParcelIdx", val);
      this.parcelMarkerClick(val);
    },
    selectedYearIdx: function(val) {
      this.$store.commit("updateSelectedYearIdx", val);
    },
    selectedWeekIdx: function(val) {
      this.$store.commit("updateSelectedWeekIdx", val);
    },

    currentCenter: function(val) {
      this.$refs.parcelInfoMap.setCenter(val);
    },
  },
};
</script>
<style scoped>
.global{padding: 10px;}
.divmenu {
  margin-top: 20px;
}
#label {
  margin-right: 20px;
  font-weight: bold;
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
.menu {
  grid-area: mn;
  margin: 20px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
.export {
  grid-area: ex;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
.graphe {
  grid-area: gr;
  height: 100%;
  width: 100%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  padding: 10px;
}

.title {
  grid-area: tl;
  padding: 0px;
}
.topnav {
  grid-area: nv;
}
#expdf {
  margin-right: 20px;
}
h4 {
  background: gray;
}



@media screen and (min-width: 1100px) {
  .global {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-areas:
      "tl tl  tl gr"
      "mn mn  mn gr "
      "bd bd  bd gr "
      "ex ex  ex gr";
  }

  .menu {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas: "co se pr";
  }

  table {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    border-collapse: collapse;
  }
  tr:nth-of-type(odd) {
    background: #eee;
  }
  th {
    background: #333;
    color: white;
    font-weight: bold;
  }
  td,
  th {
    padding: 6px;
    border: 1px solid #ccc;
    text-align: left;
  }
}


@media screen and (max-width: 1100px) {
  .title {
    grid-area: tl;
    margin-top: 0px;
   
  }
  .global {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-areas:
      "tl"
      "mn"
      "bd"
      "gr"
      "ex";
  }
  .menu {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-areas:
      "co"
      "se"
      "pr";
  }
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
  tr {
    border: 1px solid #ccc;
  }
  td {
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
  }
  td:before {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
  }
  td:nth-of-type(1):before {
    content: "Pleine croissance ";
  }
  td:nth-of-type(2):before {
    content: "Croissance ralentie";
  }
  td:nth-of-type(3):before {
    content: "Croissance arrêtée";
  }
  td:nth-of-type(4):before {
    content: "Operation";
  }
}
</style>