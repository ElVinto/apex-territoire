<template>
  <div class="global" v-if="$store.state.userDataObj !== null">
    <br />
    <div class="title">
      <hr />
      <h4>Bonjour {{ $store.getters.getDisplayedUserName }}</h4>
      <hr />
    </div>

    <div class="menu">
      <div class="divmenu">
        <label id="label"><b>Campagne</b></label>
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
          >
            {{ elmt }}
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
            >{{ pName }} ({{
              $store.getters.getDisplayedUserNameIfNeeded(
                $store.state.userDataObj.parcels[index].dataOwnerEMail,
                $store.state.userDataObj.parcels[index].dataOwnerName
              )
            }})
          </option>
        </select>
      </div>
    </div>

    <div class="graphe" id="graphe">
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
      <div>
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
        <apex-growth-pie-chart
          class="item"
          id="graphe1"
        ></apex-growth-pie-chart>
      </div>
      <hr />

      <!-- évolution par rapport à semaine précédente
      <hr> -->
      <div id="graphe21">
        évolution de la croissance des apex
        {{
          this.$store.getters.yearNumberList[this.$store.state.selectedYearIdx]
        }}
        <apex-growth-line-chart
          class="item"
          id="graphe2"
        ></apex-growth-line-chart>
      </div>
      <hr />
      <div>
        évolution de la contrainte hydrique
        {{
          this.$store.getters.yearNumberList[this.$store.state.selectedYearIdx]
        }}
        <apex-hydric-constraint-line-chart
          class="item"
          id="graphe3"
        ></apex-hydric-constraint-line-chart>
      </div>
    </div>

    <div class="export" style="margin-top:10px">
      <hr />
      <button
        id="expdf"
        @click="
          exportPDF()
        "
        class="btn btn-danger btn-sm"
      >
        Export en PDF
      </button>
      <button
        id="excsv"
        @click="
          ExportCSV()
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
      hydricConstraint: 3,
      prctSlowGrowth: 0,
      prctFullGrowth: 0,
      avgGrowth: 0,
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

    exportPDF(nbObsStoppedGrowth, nbObsSlowGrowth, nbObsFullGrowth) {
      
      
      let columns = [
        "parcelle",
        "campagne",
        "semaine",
        "# Pleine croiss.",
        "# Croiss. ralentie",
        "# Croiss. arrêtée",
        
        "% Pleine croiss",
        "% Croiss. ralentie",
        "% Croiss. arrêtée",
        
        "ic-Apex",
        "constraintes hydrique",
      ];

      let rows = [];

      let selectedParcelYearWeekLabelList = this.$store.getters.weekLabelList;
      let nbWeeks = selectedParcelYearWeekLabelList.length;
      for (let wIdx = 0; wIdx < nbWeeks; wIdx++) {
        let week_metric = this.$store.getters.getWeekMetric(
          selectedParcelIdx,
          selectedYearIdx,
          wIdx
        );

        let row =[];
        row.push(this.$store.getters.parcelNameList[this.selectedParcelIdx]);
        row.push(this.$store.getters.yearNumberList[this.selectedYearIdx]);
        row.push(this.$store.getters.weekLabelList[this.selectedWeekIdx]);

        rows.push(row)

        console.log(week_metric);
      }

      var parcelName = this.$store.state.userDataObj.parcels[
        this.$store.state.selectedParcelIdx
      ].parcelName;
      var yearNumber = this.$store.getters.yearNumberList;
      var weekNumber = this.$store.getters.weekLabelList;

      var nbTotalObs =
        parseInt(nbObsFullGrowth) +
        parseInt(nbObsSlowGrowth) +
        parseInt(nbObsStoppedGrowth);
      console.log(nbTotalObs);

      if (nbTotalObs > 0) {
        var prctFullGrowth = Math.round((nbObsFullGrowth / nbTotalObs) * 100);
        var prctSlowGrowth = Math.round((nbObsSlowGrowth / nbTotalObs) * 100);
        var avgGrowth = (prctSlowGrowth * 0.5 + prctFullGrowth) / 100.0;
      }

      if (avgGrowth >= 0.75) {
        this.hydricConstraint = 0;
      } else {
        if (prctSlowGrowth >= 5) {
          this.hydricConstraint = 1;
        } else {
          if (prctSlowGrowth <= 90) {
            this.hydricConstraint = 2;
          }
        }
      }
      if (nbTotalObs <= 0) {
        this.hydricConstraint = 0;
      }

      
      var rows = [
        [
          parcelName,
          yearNumber,
          weekNumber,
          nbObsStoppedGrowth,
          nbObsSlowGrowth,
          nbObsFullGrowth,
          prctSlowGrowth,
          prctFullGrowth,
          avgGrowth,
          this.hydricConstraint,
        ],
      ];``
      var pdf = new jsPDF("landscape");

      var graphe1 = document.getElementById("pie-chart");
      var graphe2 = document.getElementById("line-chart");
      var graphe3 = document.getElementById("graphe3").children[1];

      var graphe1Img = graphe1.toDataURL();
      var graphe2Img = graphe2.toDataURL();
      var graphe3Img = graphe3.toDataURL();

      //                    colonne ligne  largueur hauteur
      pdf.addImage(graphe1Img, "NPG", 10, 60, 60, 60);
      pdf.addImage(graphe2Img, "NPG", 90, 60, 90, 60);
      pdf.addImage(graphe3Img, "NPG", 210, 60, 60, 60);
      pdf.text(130, 10, "Les grahiques");

      pdf.addPage("a4", "l");
      pdf.text(120, 10, "Donnes des parcelles");
      pdf.autoTable(columns, rows, {
        margin: { top: 20, halign: "center" },
        rowStyles: { 0: { halign: "center" } },
      });

      pdf.save("table.pdf");
    },

    ExportCSV(nbObsFullGrowth, nbObsSlowGrowth, nbObsStoppedGrowth) {
      var NomParcel = "Nom de parcelle";
      var Compagne = "Compagne";
      var Semaine = "Semaine";
      var croissanceaccelere = "Pleine.croiss";
      var croissancerelentie = "Croiss.ralentie";
      var croissancestoppe = "Croiss.arrêtée";
      var Croissralentie = "Croiss.ralentie";
      var Pleinecroiss = "Pleine.croiss";
      var avgGrowthOb = "avgGrowth";
      var hydricConstraintsOb = "hydricConstraints";

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
      ].weekLabel;
      var nbTotalObs =
        parseInt(nbObsFullGrowth) +
        parseInt(nbObsSlowGrowth) +
        parseInt(nbObsStoppedGrowth);

      if (nbTotalObs > 0) {
        var prctFullGrowth = Math.round((nbObsFullGrowth / nbTotalObs) * 100);
        var prctSlowGrowth = Math.round((nbObsSlowGrowth / nbTotalObs) * 100);
        var avgGrowth = (prctSlowGrowth * 0.5 + prctFullGrowth) / 100.0;
      }

      if (avgGrowth >= 0.75) {
        this.hydricConstraint = 0;
      } else {
        if (prctSlowGrowth >= 5) {
          this.hydricConstraint = 1;
        } else {
          if (prctSlowGrowth <= 90) {
            this.hydricConstraint = 2;
          }
        }
      }
      if (nbTotalObs <= 0) {
        this.hydricConstraint = 0;
      }

      var hydricConstraint = this.hydricConstraint;
      var arrObject = [
        {
          NomParcel,
          Compagne,
          Semaine,
          croissanceaccelere,
          croissancerelentie,
          croissancestoppe,
          Pleinecroiss,
          Croissralentie,
          avgGrowthOb,
          hydricConstraintsOb,
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
          prctFullGrowth,
          prctSlowGrowth,
          avgGrowth,
          hydricConstraint,
        },
      ];

      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += [
        arrObject.map((item) => Object.values(item).join(";")),
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
  },
};
</script>
<style scoped>
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
  padding: 10px;
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
hr {
  border: 0.5px solid black;
  border-radius: 10px;
  grid-area: hr;
}

@media screen and (min-width: 1200px) {
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

@media screen and (min-width: 600px) and (max-width: 1200px) {
  .global {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-areas:
      "tl tl tl gr"
      "mn mn mn gr"
      "bd bd bd gr"
      "ex ex ex gr";
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

@media screen and (max-width: 600px) {
  .title {
    grid-area: tl;
    margin-top: 20px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
  .global {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "tl tl"
      "mn mn"
      "bd bd"
      "gr gr"
      "ex ex";
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
