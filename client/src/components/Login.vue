<template>
  <div
    class="login"
    style="background-image:url(images/imagee.png) ;background-size: 2000px 1000px;padding:30px;margin: 1px;"
  >
    <div class="col-md-12">
      <div class="card card-container">
        <img
          id="profile-img"
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          class="profile-img-card"
        />
        <h1>Login</h1>

        <div class="form-group">
          
          <label for="EMail"><b>Mail</b></label>
          <input
            v-model="EMail"
            type="text"
            class="form-control"
            name="EMail"

          />
          <p id="p" style="display:block">
            Visiteur en mode démo :
            cliquer directement sur  
          </p>
          <button
            id="div1"
            @click="checkEMail()"
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
          <p>chargement ...</p>
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
    async checkEMail() {
      if (this.EMail === "") {

        let loggedUserEmail = "Toto@tu.ti"; // baptiste.oger@supagro.fr

        this.$store.commit("initLoggedUserEmail", loggedUserEmail);
        this.$store.commit("initDemoUserEmail", loggedUserEmail);
        

        ApexDataServices.getObservations(loggedUserEmail).then((userDBRows) => {
          let userDataObj = ApexDataServices.extractUserDataObjFrom(userDBRows);
          console.log(userDataObj);
          ApexDataServices.addSharedParcelObservations(userDataObj).then(() => {
            ApexDataServices.addWeeksToUserDataObj(userDataObj);
            ApexDataServices.enforceConsistencyOfUserDataObj(userDataObj);
            ApexDataServices.sortUserDataObjByYearByWeek(userDataObj);

            this.$store.commit("initUserDataObj", userDataObj);

            console.log("updated $store.state.userDataObj: ");
            console.log(this.$store.state.userDataObj);

            this.$store.dispatch("initUserModifiedWeekMetrics").then(() => {
              let activedNavbar = "true";
              this.$store.commit("initActivedNavbar", activedNavbar);

              console.log("Routing to ApexMap");

              this.$router.push("/guide");
            });
          });
        });


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
                        ApexDataServices.getObservations(loggedUserEmail).then(
                          (userDBRows) => {
                            let userDataObj = ApexDataServices.extractUserDataObjFrom(
                              userDBRows
                            );
                            console.log(userDataObj);
                            ApexDataServices.addSharedParcelObservations(
                              userDataObj
                            ).then(() => {
                              ApexDataServices.addWeeksToUserDataObj(
                                userDataObj
                              );
                              ApexDataServices.enforceConsistencyOfUserDataObj(
                                userDataObj
                              );
                              ApexDataServices.sortUserDataObjByYearByWeek(
                                userDataObj
                              );
                              this.$store.commit(
                                "initUserDataObj",
                                userDataObj
                              );

                              console.log("updated $store.state.userDataObj: ");
                              console.log(this.$store.state.userDataObj);

                              this.$store
                                .dispatch("initUserModifiedWeekMetrics")
                                .then(() => {
                                  let activedNavbar = "true";
                                  this.$store.commit(
                                    "initActivedNavbar",
                                    activedNavbar
                                  );
                                  console.log("Routing to ApexMap");

                                  this.$router.push("/map");
                                });
                            });
                          }
                        );
                      }
                    }
                  );
                } else {
                  ApexDataServices.getObservations(loggedUserEmail).then(
                    (userDBRows) => {
                      let userDataObj = ApexDataServices.extractUserDataObjFrom(
                        userDBRows
                      );
                      console.log(userDataObj);
                      ApexDataServices.addSharedParcelObservations(
                        userDataObj
                      ).then(() => {
                        ApexDataServices.addWeeksToUserDataObj(userDataObj);
                        ApexDataServices.enforceConsistencyOfUserDataObj(
                          userDataObj
                        );
                        ApexDataServices.sortUserDataObjByYearByWeek(
                          userDataObj
                        );
                        this.$store.commit("initUserDataObj", userDataObj);

                        console.log("updated $store.state.userDataObj: ");
                        console.log(this.$store.state.userDataObj);

                        this.$store.dispatch("initUserModifiedWeekMetrics").then(() => {
                            let activedNavbar = "true";
                            this.$store.commit(
                              "initActivedNavbar",
                              activedNavbar
                            );

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
                      });
                    }
                  );
                }
              }
            );
          } else {
            this.msg = "mail inconnu, vérifier que le mail est enregistré dans ApeX Vignes";
          }
        });
      }
    },

    async Non() {
      let loggedUserEmail = this.EMail;

      ApexDataServices.getObservations(loggedUserEmail).then((userDBRows) => {
        let activedNavbar = true;
        this.$store.commit("initActivedNavbar", activedNavbar);
        let userDataObj = ApexDataServices.extractUserDataObjFrom(userDBRows);
        console.log(userDataObj);
        ApexDataServices.addSharedParcelObservations(userDataObj).then(() => {
          ApexDataServices.addWeeksToUserDataObj(userDataObj);
          ApexDataServices.enforceConsistencyOfUserDataObj(userDataObj);
          ApexDataServices.sortUserDataObjByYearByWeek(userDataObj);
          this.$store.commit("initUserDataObj", userDataObj);
          console.log("updated $store.state.userDataObj: ");
          console.log(this.$store.state.userDataObj);
          this.$store.dispatch("initUserModifiedWeekMetrics").then(() => {
            let activedNavbar = "true";
            this.$store.commit("initActivedNavbar", activedNavbar);

            console.log("Routing to ApexMap");
            this.$router.push("/map");
          });
        });
      });
    },

    async Oui() {
      let loggedUserEmail = this.EMail;
      this.$store.commit("initLoggedUserEmail", loggedUserEmail);

      console.log("Routing to addpsw");

      this.$router.push("/addpsw");

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
              ApexDataServices.getObservations(loggedUserEmail).then(
                (userDBRows) => {
                  let userDataObj = ApexDataServices.extractUserDataObjFrom(
                    userDBRows
                  );
                  console.log(userDataObj);
                  ApexDataServices.addSharedParcelObservations(
                    userDataObj
                  ).then(() => {
                    ApexDataServices.addWeeksToUserDataObj(userDataObj);
                    ApexDataServices.enforceConsistencyOfUserDataObj(
                      userDataObj
                    );
                    ApexDataServices.sortUserDataObjByYearByWeek(userDataObj);
                    this.$store.commit("initUserDataObj", userDataObj);
                    console.log("updated $store.state.userDataObj: ");
                    console.log(this.$store.state.userDataObj);
                    this.$store
                      .dispatch("initUserModifiedWeekMetrics")
                      .then(() => {
                        let activedNavbar = "true";
                        this.$store.commit("initActivedNavbar", activedNavbar);

                        console.log("Routing to ApexMap");

                        this.$router.push("/map");
                      });
                  });
                }
              );
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
