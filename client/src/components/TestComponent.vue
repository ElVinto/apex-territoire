<template>
  <div class="apex-map" v-if="$store.state.userDataObj !== null">
    <h1>{{ `Hello ${$store.state.userDataObj.userName} ` }}</h1>
    <div
      class="parcels"
      v-for="(parcel, index) in $store.state.userDataObj.parcels"
      v-bind:item="parcel"
      v-bind:index="index"
      v-bind:key="parcel.parcelName"
    >
      <p class="text">
        {{
          `parcelName: ${parcel.parcelName} dataOwnerName: ${parcel.dataOwnerName} monitored years:[${parcel.parcelYears}]`
        }}
      </p>
    </div>

    <hr />

    <div class="controlWeekMetrics">
      <select v-model="selectedYearIdx">
        <option
          v-for="(elmt, index) in $store.getters.yearNumberList"
          v-bind:key="index"
          v-bind:value="index"
        >
          {{ elmt }}
        </option>
      </select>
      <select v-model="selectedWeekIdx">
        <option
          v-for="(elmt, index) in $store.getters.weekLabelList"
          v-bind:key="index"
          v-bind:value="index"
        >
          {{ elmt }}
        </option>
      </select>
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

    <div class="viewWeekMetrics">
      <p class="text">
        {{
          `nbObsFullGrowth: ${$store.getters.getSelectedWeekMetric.nbObsFullGrowth}, nbObsSlowGrowth: ${$store.getters.getSelectedWeekMetric.nbObsFullGrowth}, nbObsStoppedGrowth: ${$store.getters.getSelectedWeekMetric.nbObsStoppedGrowth}, (modified: ${$store.getters.getSelectedWeekMetric.modified})`
        }}
      </p>
    </div>

    <h1>{{ `Parcel Data Shared to someone ` }}</h1>
    <div
      class="parcels"
      v-for="(sharedParcelRow,index) in parcelRowsSharedToSomeone"
      v-bind:index="index"
      v-bind:key="index">
      <p class="text">
        {{
          `parcelName: ${sharedParcelRow.parcelName} dataOwner: ${sharedParcelRow.dataOwnerEMail} dataUser:  ${sharedParcelRow.dataUserEMail}`
        }}
      </p>
    </div>

    <h1>{{`Parcel Data Shared by someone ` }}</h1>
    <div
      class="parcels"
      v-for="(sharedParcelRow,index) in parcelRowsSharedBySomeone"
      v-bind:index="index"
      v-bind:key="index">
      <p class="text">
        {{
          `parcelName: ${sharedParcelRow.parcelName} dataOwner: ${sharedParcelRow.dataOwnerEMail} dataUser:  ${sharedParcelRow.dataUserEMail}`
        }}
      </p>
    </div>


  </div>
</template>

<script>
import ApexDataServices from "../ApexDataServices";

export default {
  name: "TestComponent",

  data() {
    return {
      selectedParcelIdx: 0,
      selectedYearIdx: 0,
      selectedWeekIdx: 0,

      parcelRowsSharedToSomeone: [],
      parcelRowsSharedBySomeone: []
    };
  },

  async created() {
    try {

      this.parcelRowsSharedToSomeone = await ApexDataServices.sendToParcelDataSharing(
        {
          transaction: "select_parceldatasharing",
          ownerEMail: this.$store.state.loggedUserEmail
        }
      );

      console.log("parcelRowsSharedToSomeone")
      console.log(this.parcelRowsSharedToSomeone)


      this.parcelRowsSharedBySomeone = await ApexDataServices.sendToParcelDataSharing(
        {
          transaction: "select_parceldatasharing",
          userEMail: this.$store.state.loggedUserEmail
        }
      );

      console.log("parcelRowsSharedBySomeone")
      console.log(this.parcelRowsSharedBySomeone)


    } catch (error) {

      console.log(error.message)
      this.error = error.message;
    }
  },

  watch: {
    selectedParcelIdx: function(val) {
      this.$store.commit("updateSelectedParcelIdx", val);
    },
    selectedYearIdx: function(val) {
      this.$store.commit("updateSelectedYearIdx", val);
    },
    selectedWeekIdx: function(val) {
      this.$store.commit("updateSelectedWeekIdx", val);
    }
  },

  methods: {
    async insertParcelDataSharedToSomeone() {
      await ApexDataServices.sendToParcelDataSharing({
        transaction: "insert_parceldatasharing",
        dataUserEMail: "TODO ADD",
        dataOwnerEMail: this.$store.state.userDataObj.userEMail,
        parcelName: "TODO ADD"
      });
      this.parcelRowsSharedToSomeone = await ApexDataServices.sendToParcelDataSharing(
        {
          transaction: "select_parceldatasharing",
          ownerEMail: this.$store.userDataObj.userEMail
        }
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
