<template>
  <div
    class="global"
    style="background-image:url(images/tuscany-vigne.jpg) ;background-size: 2200px 800px;padding:30px;margin: 1px;height: 800px"
  >
  <div id="title"><h1>ApeX Territoire</h1></div>

  
   
     <div id="btnVisiteur">
          <button @click="continueToNextStep()" class="btn btn-secondary btn-block"><b-avatar  size="80px"><img src=images/1.png/></b-avatar>
            <span>Visiteur</span>
          </button>
         
         
    </div>
    <div id="btnUtilisateur">
    <router-link class="btn btn-secondary btn-block" to="/login" style="margin-top:15px"><b-avatar  size="80px"><img src=images/utilisateur.png/></b-avatar>Utilisateur</router-link>
          <p>{{ msg }}</p>
    </div>
     

     <div id="btnGuide">
     <b-button id="btnGuide" variant="dark" v-b-toggle.sidebar-footer><b-avatar  size="60px"><img src=images/guide.png/></b-avatar><br>
     <span>Mode emploie</span></b-button>
     </div>
    <b-sidebar id="sidebar-footer" aria-label="Sidebar with custom footer" no-header shadow>
      <template v-slot:footer="{ hide }">
        <b-button size="sm" @click="hide">Close</b-button>
      </template>
      <div class="px-3 py-2">
        <p>
         <h5>Bienvenue sur l'application Apex Territoire</h5>

        <p>
          Dans la suite nous détaillons les objectifs et le guide d'utilisation d'Apex Territoire.
          Vous pouvez directement commencer et cliquer sur l'onglet <a href="#/map">Carte</a> puis
          revenir sur le guide d'utilisation pour avoir plus d'informations sur les fonctionalités implémentées.
          Apex Territoire est aussi accessible sur mobile et tablette.
        </p>

          <h5>Objectifs</h5>
        <p>
          Apex territoire fait suite, et  complémentaire à l'application Apex Vigne.
          L'objectif premier d'Apex Territoire est de proposer aux utilisateurs une
          <b> visualisation et une analyse spatio-temporelle de la croissance des apex telle qu'elle a été observée dans les parcelles de vignes.</b>
          Autour de cet objectif, nous avons implémentés de nouvelles fonctionnalités permettant 
          aux utilisateurs d'<b>ajouter</b>, de <b>mettre à jour</b> de <b>partager</b> et d' <b>exporter</b> les résumés de leurs observations.
          Ainsi, en plus de proposer une visualisation géolocalisées des indicateurs de croissance des apex,
          Apex Territoire est aussi une plate forme qui permet la mise à jour et le partage de résumés d'observations. 
          Ces dernières fonctionnalités permettent de comparer et de mieux comprendre la croissance des apex des vignes à travers différentes campagnes et différentes parcelles.
          Pour satifaire ces objectifs les fonctionalités suivantes ont été implémentées :
        </p>

        
          
        <router-link to="/map" class="nav-link">Carte</router-link>
        <p>
          La carte permet de localiser par des icones à la fois : a) les parcelles observées par l'utilisateur 
          et b) les parcelles pour lesquelles l'utilisateur est destinataire d'un partage d'observations.<br/>
          <b> * Sélectionner une campagne, une semaine et une parcelle d'intéret </b> à l'aide des menus de controles situé en haut de pages pour  recentrer la carte sur . <br/>
          
          <b> * Accéder aux informations résumés sur la croissance des Apex </b>  en cliquant sur l'icone représentant la parcelle.
          Chaque icone localisée sur la carte prend une couleur du vert pale au vert foncé en fonction
          de son indice de croissance, ou grise si il n y a pas d observations.<br/>
          
          
          <b> * Comparer la croissance des Apex de la campagne précédente</b> en passant le curseur sur le bouton campagne précédente. <br/>
          
          <b> * Visualiser les indicateurs de croissance de la parcelle </b> pour la semaine et la campagne séletionnées, dans le panneau de droite.
          Ces indicateurs de croissance  proviennent de l'application Apex Vigne et sont instantannément recalculés en fonction des nouvelles données mises-à-jour par l'utilisateur.
        </p>

        <router-link  to="/edit" class="nav-link">Editer</router-link>

        <p>
          Cette fonctionnalité permet d'ajouter ou de <b> mettre à jour le résumé des observations  sur l'état des Apex </b>  collectées dans les parcelles.
          Les informations mises à jour peuvent concerner à la fois, les résumés d'observations collectées par l'utilisateur, ou encore
          les résumés d'observations reçus d'autres utilisateurs.
          Les mises à jour effectuées par un utilisateur sur les résumés d'observations collectés ou reçus restent locales à l'utilisateur.
          Ces mises à jour ne sont visibles que par l'utilisateur et ne suppriment, ni les observations collectées par l'utilisateur, ni les observations partagées par un autre utilisateur.
          En cliquant sur Réinitialiser, tout utilisateur a la posibilité d' <b> effacer ses mises à jour afin de retrouver les résumés d'observations initialement collectées </b>.
        </p>
        <router-link  to="/partage" class="nav-link">Partager</router-link>

        <p> 
          La fonctionnalité de partage permet de <b>  partager les observations collectées par un utilisateur sur une parcelle  avec un autre utilisateur </b> .
          Les observations partagées ne concernent que le résumé des observations collectées sur le terrain par l'utilisateur avec l'application Apex Vigne.
          Le partage ne concerne pas les mises à jour de résumés qui eux restent locales à la session d'un utilisateur.
          Afin de controler le partage d'observations entre utilisateurs, un utilisateur ne peut partager que les résumés des observations qu'il a lui meme collecté.
          Un utilisateur ne peut pas re-partager les résumés d'observations qu'il a reçu d'un autre utilisateur.
          Un utilisateur peut décider d'<b>arrêter le partage des informations sur une parcelle avec un autre utilisateur </b> en cliquant sur supprimer.
          
        </p>

        <router-link  to="/partage" class="nav-link">Exporter</router-link>
        
        <p>
          Cette fonctionalité permet d'exporter au format pdf ou csv les résumés d'observations collectés et reçus par l'utilisateur.
          <b>Les résumés d'observations se composent les indicateurs de croissances des apex et de contraintes hydriques d'une campagne sélectionnée </b>.
          L'export de données présente en plus dans un tableau récapitulatif contenant la valeur de tous les indicateurs calculés pour chaque semain de la campagne.
        </p>
         
        <router-link  to="/profil" class="nav-link">Authentification</router-link>

        
        <p>
          Cette fonctionalité accompagne le partage des résumés d'observations collectées par les utilisateurs.
          Elle permet aux utilisateurs qui le souhaitent de <b>protéger l'accès à leurs données </b> par un mot de passe.
        </p>
        


        <h5>Contributeurs</h5>

        <p>
          L'application Apex Territoire est à l'initiative de Léo Pichon (porteur du projet).
          <b>Pour toute information contactez leo.pichon@supagro.fr</b>.
          Cette aplication a bénéficié du développement de la cellule d'appui en informatique
          de l'institut de convergence <a href="https://www.hdigitag.fr/fr/" target="_blank"> #Digitag</a>. 
          L'application a été développée par Vincent Armant et Amine Ouail à la demande de Léo Pichon et Guilhem Brunel.
          L'application reprend les éléments graphiques et les indicateurs de croissance développés dans <a href="https://play.google.com/store/apps/details?id=ag.GB.apex&hl=en">ApeX Vignes</a>.
        </p>

        
       
      </div>
    </b-sidebar>
        

        
      


        <div v-if="authorizedToContinue" id="chargement">
          <p> 
            <b style="color:white;">Chargement</b> 
            <b-spinner small label="Small Spinner" type="grow"></b-spinner>
            <b-spinner small label="Small Spinner" type="grow"></b-spinner>
            <b-spinner small label="Small Spinner" type="grow"></b-spinner>
          </p>
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

      authorizedToContinue:false,
      userInfo: null
    };
  },

  methods: {
    

    async continueToNextStep() {
      if (this.EMail === "") {

        let loggedUserEmail = "visiteur.demo@apex-territoire.fr"; // baptiste.oger@supagro.fr visiteur.demo@apex-territoire.fr
        this.authorizedToContinue =true

        this.$store.commit("initDemoUserEmail", loggedUserEmail);
        await this.initLoggedUserIfNeeded(loggedUserEmail)
        await this.loadUserData(loggedUserEmail);

        console.log("Routing to map");
        this.$router.push("/map");
      
      } else {
        let loggedUserEmail = this.EMail;

        await this.initLoggedUserIfNeeded(loggedUserEmail)

        // userInfo ={
        //     userEMail:loggedUserEmail,
        //     userName:loggedUserEmail,
        //     userId: -1,
        //     userExistsInUserTable :false,
        //     userExistsInAuthTable: false,
        //     userRequiredPassword:false,
        // };

        if(this.userInfo.userExistsInAuthTable){

          if(!this.userInfo.userRequiredPassword){
            this.authorizedToContinue =true
            await this.loadUserData(loggedUserEmail);
            console.log("Routing to ApexMap");
            this.$router.push("/map");
          }else{
            // document.getElementById("div1").style.display = "none";
            // document.getElementById("p").style.display = "none";
            let PasswordRequire = "true";
            this.$store.commit(
              "initPasswordRequire",
              PasswordRequire
            );
          }
          
        }else{

          if(this.userInfo.userExistsInUserTable){

            // await this.loadUserData(loggedUserEmail)
            // document.getElementById("div1").style.display ="none";
            // document.getElementById("p").style.display = "none";
            let mailpresent = "true";
            this.$store.commit("initmailpresent", mailpresent);
            let mailad = await ApexDataServices.mailAddToAuth(loggedUserEmail,this.userInfo.userName)
            if (mailad) {
              console.log(" mail added to authentification");
            } else {
              console.log("WARNING mail NOT added to authentification");
            }
         }else{
           this.msg = "mail inconnu, vérifier que le mail est enregistré dans ApeX Vignes";
         }
        }

      }
    },


    async initLoggedUserIfNeeded(loggedUserEmail){
      if(!this.$store.loggedUserEmail){
        this.$store.commit("initLoggedUserEmail", loggedUserEmail);
      }
      
      if(!this.userInfo){
        this.userInfo = await ApexDataServices.getUserInfo(loggedUserEmail);
      }
      
    },

    async loadUserData(loggedUserEmail){

      console.log('loadUserData')

      await this.initLoggedUserIfNeeded(loggedUserEmail)

      console.log('this.userInfo')
      console.log(this.userInfo)

      let tmpUserDataObj = new ApexDataServices.MonitoredUser(
        this.userInfo.userEMail,
        this.userInfo.userId,
        this.userInfo.userName
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
      this.authorizedToContinue =true
      await this.loadUserData(loggedUserEmail)
      console.log("Routing to ApexMap");
      this.$router.push("/map");
      
    },

    async Oui() {
      let loggedUserEmail = this.EMail;
      this.authorizedToContinue =true
      await this.loadUserData(loggedUserEmail)
      console.log("Routing to addpsw");
      this.$router.push("/addpsw");
    },

    async login() {
      try {
        let password = this.password;
        let loggedUserEmail = this.EMail;
        this.message =""
        // console.log("password");
        // console.log(password);

        this.authorizedToContinue = await ApexDataServices.checkPassword(password, loggedUserEmail)
        if (this.authorizedToContinue ) {
           this.message = "mot de passe valide";
          await this.loadUserData(loggedUserEmail)
          console.log("Routing to ApexMap");
          this.$router.push("/map");
          
        } else {
          console.log("mot de passe non valide");
          this.message = "mot de passe non valide";
        }
          
        
      } catch (error) {
        this.error = error.message;
      }
    },
  },
};
</script>

<style scoped>


h1{color:white;}

.global{text-align: center;margin-left: auto;margin-right: auto;padding: 5px;}
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

#title{grid-area:ti;}
#btnVisiteur{grid-area: btnv; width: 100px; }
#btnUtilisateur{grid-area: btnu;width: 100px;}
#btnGuide{grid-area: btng;}


@media screen and (min-width: 900px) {
.global {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
}
 #title {
  grid-column: 3 / 8;
  grid-row: 1 / 9;
}
#btnVisiteur { 
  grid-column: 6 / 9;
  grid-row: 2 / 9;
}
#btnUtilisateur {
  grid-column: 4 / 9;
  grid-row: 2 / 9;
}

#btnGuide {
  grid-column: 2/9;
  grid-row: 4/ 9;
}

#chargement{color: honeydew;font-size: 20px;
     grid-column: 2/9;
  grid-row: 6/ 9;
}}


@media screen and (max-width: 900px) {

.global {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  grid-auto-rows: repeat(4, 1fr);
}
 #title {
  grid-column: 2;
  grid-row: 1;
}
#btnVisiteur { 
  grid-column: 3;
  grid-row: 2;
}
#btnUtilisateur {
  grid-column: 1;
  grid-row: 2;
}

#btnGuide {
  grid-column: 2/3;
  grid-row: 3;
}

#chargement{color: honeydew;font-size: 20px;
     grid-column: 2;
  grid-row: 4;
}





}

</style>
