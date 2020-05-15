<template>
  <div
    class="login"
    style="background-image:url(images/tuscany-vigne.jpg) ;background-size: 2200px 800px;padding:30px;margin: 1px;"
  >
  <div><h1>ApeX Territoire</h1></div>
    <div class="col-md-12">
      <div class="card card-container">
        <img
          id="profile-img"
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          class="profile-img-card"
        />
        <h2>Login</h2>

        <div class="form-group">
          
          <label for="EMail"><b>Mail</b></label>
          <input
            v-if="!$store.state.loggedUserEmail"
            v-model="EMail"
            type="text"
            class="form-control"
            name="EMail"
          />
          <label v-if="$store.state.loggedUserEmail"> 
            {{$store.state.loggedUserEmail}}
          </label>


          <p id="p" style="display:block">
            Visiteur en mode démo :
            cliquer directement sur  
          </p>
          <button
            id="div1"
            @click="continueToNextStep()"
            class="btn btn-primary btn-block"
            style="display:block"
          >
          
            <span>Continuer</span>
          </button>
          <p>{{ msg }}</p>
        </div>

        <div class="form-group" v-if="$store.state.mailpresent">
          <label for="password"><b>Mot de passe</b></label>
          <p>Voulez vous enregistrer un mot de passe</p>
          <button @click="Oui" class="btn btn-primary btn-block">
            <span>Oui</span>
          </button>
          <button @click="Non" class="btn btn-primary btn-block">
            <span>Non</span>
          </button>
        </div>

        <div class="form-group" v-if="$store.state.PasswordRequire">
          <label for="password"><b>Mot de passe</b></label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            name="password"
          />
          <button @click="login()" class="btn btn-primary btn-block">
            <span>Login</span>
          </button>

          <!-- <p>Mot de passe oublie <a href="#/resetp">cliquer ici</a></p>-->
          <p>{{ message }}</p>
        </div>

        <div
          v-if="
            $store.state.loggedUserEmail !== '' &&
              $store.state.activedNavbar === ''
          "
        >
          <p> 
            <b>Chargement</b> 
            <b-spinner small label="Small Spinner" type="grow"></b-spinner>
            <b-spinner small label="Small Spinner" type="grow"></b-spinner>
            <b-spinner small label="Small Spinner" type="grow"></b-spinner>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ApexDataServices from "../services/ApexDataServices";
export default {
  data() {
    return {
      EMail: "",
      msg: "",
      message: "",
      password: "",
      activedNavbar: "",
      mailpresent: "",
      PasswordRequire: "",
    };
  },

  methods: {
    

  async continueToNextStep() {
      if (this.EMail === "") {

        let loggedUserEmail = "visiteur.demo@apex-territoire.fr"; // baptiste.oger@supagro.fr visiteur.demo@apex-territoire.fr
        this.$store.commit("initDemoUserEmail", loggedUserEmail);

        await this.loadUserData(loggedUserEmail);

        console.log("Routing to guide");
        this.$router.push("/map");
      
      } else {
        let loggedUserEmail = this.EMail;

        ApexDataServices.checkEMail(loggedUserEmail).then((emailIsvalid) => {
          if (emailIsvalid === true) {
            this.$store.commit("initLoggedUserEmail", loggedUserEmail);
            ApexDataServices.checkEMailAuth(loggedUserEmail).then(
              (emailAuthIsvalid) => {
                if (emailAuthIsvalid === true) {
                  ApexDataServices.checkpasswordRequire(loggedUserEmail).then(
                    (passwordRequireIsvalid) => {
                      if (passwordRequireIsvalid === true) {
                        document.getElementById("div1").style.display = "none";
                        document.getElementById("p").style.display = "none";
                        let PasswordRequire = "true";
                        this.$store.commit(
                          "initPasswordRequire",
                          PasswordRequire
                        );
                      } else {

                        this.loadUserData(loggedUserEmail).then(() =>{
                          console.log("Routing to ApexMap");
                          this.$router.push("/map");
                        })

                      }
                    }
                  );
                } else {

                  this.loadUserData(loggedUserEmail).then( () =>{

                    document.getElementById("div1").style.display ="none";
                    document.getElementById("p").style.display = "none";
                    let mailpresent = "true";
                    this.$store.commit("initmailpresent", mailpresent);
                    ApexDataServices.mailAddToAuth(loggedUserEmail).then((mailad) => {
                    if (mailad === true) {
                      console.log("mail ajouté à l'authentification");
                    } else {
                      ("mail non ajouté à l'authentification");
                      }
                    });
                  });

                }
              }
            );
          } else {
            this.msg = "mail inconnu, vérifier que le mail est enregistré dans ApeX Vignes";
          }
        });
      }
    },



    async loadUserData(loggedUserEmail){

      this.$store.commit("initLoggedUserEmail", loggedUserEmail);
      
      let userInfo = await ApexDataServices.getUserInfo(loggedUserEmail);

      console.log('userInfo')
      console.log(userInfo)

      let tmpUserDataObj = new ApexDataServices.MonitoredUser(
        userInfo.userEMail,
        userInfo.userId,
        userInfo.userName
      );

      console.log('tmpUserDataObj after userInfo')
      console.log(tmpUserDataObj)

      await ApexDataServices.addParcelObservations(tmpUserDataObj);


      console.log('tmpUserDataObj after addParcelObservations')
      console.log(tmpUserDataObj)

      await ApexDataServices.addSharedParcelObservations(tmpUserDataObj);

      console.log('tmpUserDataObj after addSharedParcelObservations')
      console.log(tmpUserDataObj)


      await ApexDataServices.addInitializedWeekMetrics(tmpUserDataObj);

      console.log('tmpUserDataObj after addInitializedWeekMetrics')
      console.log(tmpUserDataObj)


      ApexDataServices.addWeeksToUserDataObj(tmpUserDataObj);
      ApexDataServices.enforceConsistencyOfUserDataObj(tmpUserDataObj);
      ApexDataServices.sortUserDataObjByYearByWeek(tmpUserDataObj);

      this.$store.commit("initUserDataObj", tmpUserDataObj);

      console.log("updated $store.state.userDataObj: ");
      console.log(this.$store.state.userDataObj);

      await this.$store.dispatch("initUserModifiedWeekMetrics")
      
      this.$store.commit("initActivedNavbar", "true");

    },

    

    async Non() {
      let loggedUserEmail = this.EMail;
      let activedNavbar = true;
      this.$store.commit("initActivedNavbar", activedNavbar);
      this.loadUserData(loggedUserEmail).then( () =>{
        console.log("Routing to ApexMap");
        this.$router.push("/map");
      })
    },

    async Oui() {
      let loggedUserEmail = this.EMail;
      this.$store.commit("initLoggedUserEmail", loggedUserEmail);

      this.loadUserData(loggedUserEmail).then( () =>{
        console.log("Routing to addpsw");
        this.$router.push("/addpsw");
      })

      // ApexDataServices.getObservations(loggedUserEmail).then((userDBRows) => {
      //   let userDataObj = ApexDataServices.extractUserDataObjFrom(userDBRows);
      //   console.log("userDataObj");
      //   console.log(userDataObj);
      //   ApexDataServices.addSharedParcelObservations(userDataObj).then(() => {
      //     ApexDataServices.addWeeksToUserDataObj(userDataObj);
      //     ApexDataServices.enforceConsistencyOfUserDataObj(userDataObj);
      //     ApexDataServices.sortUserDataObjByYearByWeek(userDataObj);
      //     this.$store.commit("initUserDataObj", userDataObj);

      //     this.$store.dispatch("initUserModifiedWeekMetrics").then(() => {
      //       let activedNavbar = "true";
      //       this.$store.commit("initActivedNavbar", activedNavbar);

      //       console.log("Routing to addpsw");

      //       this.$router.push("/addpsw");
      //     });
      //   });

      // });
    },

    async login() {
      try {
        let password = this.password;
        let loggedUserEmail = this.EMail;

        // console.log("password");
        // console.log(password);

        ApexDataServices.checkPassword(password, loggedUserEmail).then(
          (passwordIsvalid) => {
            if (passwordIsvalid === true) {
              let activedNavbar = "true";
              this.$store.commit("initActivedNavbar", activedNavbar);
              this.loadUserData(loggedUserEmail).then( () =>{
                console.log("Routing to ApexMap");
                this.$router.push("/map");
              })
            } else {
              console.log("mot de passe non valide");
              this.message = "mot de passe non valide";
            }
          }
        );
      } catch (error) {
        this.error = error.message;
      }
    },
  },
};
</script>

<style scoped>

h1{color:white;}

.login{text-align: center;margin-left: auto;margin-right: auto;padding: 5px;}
button {
  margin-top: 15px;
  margin-bottom: 15px;
}

label {
  display: block;
  margin-top: 10px;
}
.col {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100%;
}
.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>
