<template>
  <div class="global">
    <div class="title">
      <hr />
      <h4>Bonjour {{ $store.state.userDataObj.userName }}</h4>
      <hr />
    </div>

    <div class="menu">
      <h5 id="menutitle">
        <b
          >Nouveau partage des observations collectées par
          {{ $store.state.userDataObj.userName }}
        </b>
      </h5>

      <label id="menulabel1"><b>Parcelle</b></label>
      <select
        id="menuselect"
        v-model="parcelp"
        class="custom-select"
        style="width:260px;margin-left : 10px"
      >
        <option
          v-for="(pName, index) in parcelNameListObservedByLoggedUser"
          v-bind:item="pName"
          v-bind:key="index"
        >
          {{ pName }}
        </option>
      </select>

      <label id="menulabel2" for="mail" style="margin-left : 10px"
        ><b>Mail Destinataire </b></label
      >
      <input
        id="menuinput"
        v-model="mailp"
        type="text"
        name="mailp"
        style="width: 200px; margin-left : 10px"
      />
      <button
        id="buttonverif"
        class="btn btn-info btn-sm"
        @click="checkEMailAndParcel()"
        style="margin-left : 10px"
      >
        Vérifier
      </button>
      <button
        id="buttoninsert"
        class="btn btn-success btn-sm"
        @click="insertParcelDataSharedToSomn()"
        style="weight: 360px; margin-left : 10px"
      >
        Ajouter
      </button>
      <p>{{ message }}</p>
    </div>

    <hr />
    <div class="body">
      <div class="obspartager">
        <h5>
          <b>
            Liste des observations partagées par
            {{ $store.state.userDataObj.userName }}</b
          >
        </h5>
        <table class="table-striped">
          <thead>
            <tr>
              <th>Observateur</th>
              <th>Destinataire</th>
              <th>Parcelle</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(sharedParcelRow, index) in parcelRowsSharedToSomeone"
              v-bind:index="index"
              v-bind:key="index"
            >
              <td>{{ sharedParcelRow.dataOwnerEMail }}</td>
              <td>{{ sharedParcelRow.dataUserEMail }}</td>
              <td>{{ sharedParcelRow.parcelName }}</td>
              <td>
                <button
                  @click="
                    deleteParcelDataSharedToSomn(
                      sharedParcelRow.dataOwnerEMail,
                      sharedParcelRow.dataUserEMail,
                      sharedParcelRow.parcelName
                    )
                  "
                  class="btn btn-danger btn-sm"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr />

      <div class="obsrecu">
        <h5>
          <b>Liste des observations partagées par un autre utilisateur</b>
        </h5>
        <table class="table-striped">
          <thead>
            <tr>
              <th>Observateur</th>
              <th>Destinataire</th>
              <th>Parcelle</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(sharedParcelRow, index) in parcelRowsSharedBySomeone"
              v-bind:index="index"
              v-bind:key="index"
            >
              <td>{{ sharedParcelRow.dataOwnerEMail }}</td>
              <td>{{ sharedParcelRow.dataUserEMail }}</td>
              <td>{{ sharedParcelRow.parcelName }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <hr />
  </div>
</template>

<script>
import ApexDataServices from "../services/ApexDataServices";

export default {
  name: "App",
  components: {},

  data() {
    return {
      dataOwnerEMail: "",
      dataUserEMail: "",
      parcelName: "",
      date: "",
      userDataObj: [],
      userDBRows: [],
      error: "",
      text: "",
      pIdx: 0,
      yIdx: "",
      wIdx: "",
      message: "",
      parcelp: "",
      mailp: "",
      parcelRowsSharedToSomeone: [],
      parcelRowsSharedBySomeone: [],
    };
  },

  async created() {
    if (!this.$store.state.loggedUserEmail) {
      this.$router.push("/");
    }

    try {
      this.parcelRowsSharedToSomeone = await ApexDataServices.sendToParcelDataSharing(
        {
          transaction: "select_parceldatasharing",
          ownerEMail: this.$store.state.loggedUserEmail,
        }
      );

      console.log("parcelRowsSharedToSomeone");
      console.log(this.parcelRowsSharedToSomeone);

      this.parcelRowsSharedBySomeone = await ApexDataServices.sendToParcelDataSharing(
        {
          transaction: "select_parceldatasharing",
          userEMail: this.$store.state.loggedUserEmail,
        }
      );

      console.log("parcelRowsSharedBySomeone");
      console.log(this.parcelRowsSharedBySomeone);
    } catch (error) {
      console.log(error.message);
      this.error = error.message;
    }
  },

  computed: {
    parcelNameListObservedByLoggedUser() {
      if (this.$store.state.userDataObj !== null) {
        if (this.$store.state.userDataObj.parcels !== null) {
          return this.$store.state.userDataObj.parcels.map((parcel) => {
            if (
              parcel.dataOwnerEMail === this.$store.state.userDataObj.userEMail
            ) {
              return parcel.parcelName;
            }
          });
        }
      }
      return [];
    },
  },

  methods: {
    async checkEMailAndParcel() {
      this.message = "";

      return new Promise((resolve, reject) => {
        let mailAndParcelAlreadyShared = false;
        for (let parcelDataSharingRow of this.parcelRowsSharedToSomeone) {
          if (
            parcelDataSharingRow.dataOwnerEMail ===
              this.$store.state.loggedUserEmail &&
            parcelDataSharingRow.dataUserEMail === this.mailp &&
            parcelDataSharingRow.parcelName === this.parcelp
          ) {
            
            this.message =
              "Les informations de la parcelle sont déjà partagées avec l'utilisateur";
            mailAndParcelAlreadyShared =true;
          }
        }
          if(mailAndParcelAlreadyShared){
            resolve(false)
          }else{
          try {
            ApexDataServices.checkEMail(this.mailp).then((emailIsvalid) => {
              if (emailIsvalid === true) {
                if (this.parcelp) {
                  this.message = "La parcelle et le mail sont valides";
                  this.parcelName = this.parcelp;
                  resolve(true);
                } else {
                  this.message = "Choisir la parcelle";
                  resolve(false);
                }
              } else {
                this.message = "Mail non valide";
                this.parcelName = "";
                resolve(true);
              }
            });
          } catch (err) {
            reject(err);
          }
        }
      });
    },

    async insertParcelDataSharedToSomn() {
      console.log("START insertParcelDataSharedToSomn");

      let mailAndParcelAreValid = await this.checkEMailAndParcel(this.mailp);

      console.log("mailAndParcelAreValid " + mailAndParcelAreValid);

      if(mailAndParcelAreValid){
        
        let resInsert = await ApexDataServices.sendToParcelDataSharing({
          transaction: "insert_parceldatasharing",
          dataUserEMail: this.mailp,
          dataOwnerEMail: this.$store.state.userDataObj.userEMail,
          parcelName: this.parcelp,
        });

        console.log("res insert_parceldatasharing " + resInsert);

        this.parcelRowsSharedToSomeone = await ApexDataServices.sendToParcelDataSharing(
          {
            transaction: "select_parceldatasharing",
            ownerEMail: this.$store.state.userDataObj.userEMail,
          }
        );

        this.message = "La parcelle et le mail destinataire ont été ajouté";
      }

      console.log("END insertParcelDataSharedToSomn");
    },

    async deleteParcelDataSharedToSomn(OwnerEMail, UserEMail, parcelName) {

      await ApexDataServices.sendToParcelDataSharing({
        transaction: "delete_parceldatasharing",

        dataUserEMail: UserEMail,
        dataOwnerEMail: OwnerEMail,
        parcelName: parcelName,
      });

      this.parcelRowsSharedToSomeone = await ApexDataServices.sendToParcelDataSharing(
        {
          transaction: "select_parceldatasharing",
          ownerEMail: this.$store.state.userDataObj.userEMail,
        }
      );
    },
  },

  watch: {
    selectedParcelIdx: function(val) {
      this.$store.commit("updateSelectedParcelIdx", val);
    },
  },
};
</script>
<style scoped>
.title {
  grid-area: tl;
  margin-top: 20px;
}
.menu {
  grid-area: mn;
  margin: 20px;
}
.body {
  grid-area: bd;
  margin-top: 20px;
}
h4 {
  background: gray;
}
p {
  font-weight: bold;
  width: auto;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
}
hr {
  border: 1px solid black;
  border-radius: 10px;
  grid-area: hr;
}
/*Phone*/
@media screen and (min-width: 1200px) {
  .global {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-areas:
      "tl"
      "mn"
      "bd";
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

/*Tablette*/
@media screen and (min-width: 600px) and (max-width: 1200px) {
  #menulabel1 {
    grid-area: mnlb1;
    position: relative;
    margin-top: 20px;
    text-align: center;
  }
  #menutitle {
    grid-area: mntl;
    position: relative;
    margin-top: 20px;
    text-align: center;
  }
  #menuselect {
    grid-area: mnsl;
    position: relative;
    margin-top: 20px;
    text-align: center;
  }
  #menuinput {
    grid-area: mnip;
    position: relative;
    margin-top: 20px;
    text-align: center;
  }
  #menulabel2 {
    grid-area: mnlb2;
    position: relative;
    margin-top: 20px;
    text-align: center;
  }
  #buttonverif {
    grid-area: btnvr;
    position: relative;
    margin-top: 20px;
    text-align: center;
  }
  #buttoninsert {
    grid-area: btnva;
    position: relative;
    margin-top: 20px;
    text-align: center;
  }

  .global {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-areas:
      "tl tl tl tl tl  "
      "mn mn bd bd bd"
      "mn mn bd bd bd";
  }

  .menu {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "mntl mntl"
      "mnlb1 mnsl "
      "mnlb2 mnip"
      "mnlb2 mnip"
      "btnvr btnva";
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

@media screen and (max-width: 600px) {
  .title {
    grid-area: tl;
    margin-top: 20px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
  .menu {
    grid-area: mn;
    margin: 20px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
  }
  .body {
    grid-area: bd;
    margin-top: 20px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
  #menulabel1 {
    grid-area: mnlb1;
    position: relative;
    margin-top: 20px;
    text-align: center;
  }
  #menutitle {
    grid-area: mntl;
    position: relative;
    margin-top: 20px;
    text-align: center;
  }
  #menuselect {
    grid-area: mnsl;
    position: relative;
    margin-top: 20px;
    text-align: center;
  }
  #menuinput {
    grid-area: mnip;
    position: relative;
    margin-top: 20px;
    text-align: center;
  }
  #menulabel2 {
    grid-area: mnlb2;
    position: relative;
    margin-top: 20px;
    text-align: center;
  }
  #buttonverif {
    grid-area: btnvr;
    position: relative;
    margin-top: 20px;
    text-align: center;
  }
  #buttoninsert {
    grid-area: btnva;
    position: relative;
    margin-top: 20px;
    text-align: center;
  }
  .global {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-areas:
      "tl"
      "mn "
      "bd ";
  }

  .menu {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "mntl mntl"
      "mnlb1 mnsl "
      "mnlb2 mnip"
      "mnlb2 mnip"
      "btnvr btnva";
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
    content: "Emetteur";
  }
  td:nth-of-type(2):before {
    content: "distinataire";
  }
  td:nth-of-type(3):before {
    content: "Parcelles";
  }
  td:nth-of-type(4):before {
    content: "Date ";
  }
  td:nth-of-type(5):before {
    content: "Operation ";
  }
}
</style>
