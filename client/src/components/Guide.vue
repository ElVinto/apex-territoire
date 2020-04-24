<template>
  <div class="global">
    
      <hr />
      <h4 class="title" style="background-color:grey">
        Bonjour {{ $store.getters.getDisplayedUserName }}
      </h4>
      <hr />
      
      <!-- User Demo Guide-->
      <div v-if="$store.state.demoUserEmail">
        <h5>Bienvenue sur l'application Apex Territoire</h5>

        <p>
          Dans la suite nous détaillons les objectifs et le guide d'utilisation d'Apex Territoire.
          Vous pouvez directement commencez et cliquer sur l'onglet <a href="#/map">Carte</a> puis
          revenir sur le guide d'utilisation pour avoir plus d'informations sur les fonctionalités implémentées.
          Apex Territoire est aussi disponible sur mobile et tablette.
        </p>

          <h5>Objectifs</h5>
        <p>
          Apex territoire fait suite, et est complémentaire à l'application Apex Vignes.
          L'objectif premier d'Apex Territoire est de proposer aux utilisateurs une
          <b> visualisation et une analyse spatio-temporelle de la croissance des apex telle qu'elle a été observée dans les parcelles de vignes.</b>
          Autour de cet objectif, nous avons implémentés de nouvelles fonctionnalités permettant 
          aux utilisateurs d'ajouter, de mettre à jour et de partager leurs observations.
          Ainsi, en plus de proposer une visualisation géolocalisées des indicateurs de croissance des apex,
          Apex Territoire est aussi une plate forme qui permet la mise-à-jour et le partage de résumés d'observations. 
          Ces dernières fonctionnalités permettent de comparer et de mieux comprendre la croissance des apex des vignes à travers différentes campagne et différentes parcelles.
          Pour satifaire ces objectifs plusieurs fonctionalités ont été implémentés:
        </p>

        
          
        

        <router-link to="/map" class="nav-link">Carte</router-link>
        <p>
          La carte permet de localiser par des icones à la fois : a) les parcelles observées par l'utilisateur 
          et aussi  b) les parcelles pour lesquelles l'utilisateur est destinataire du partage d'observations.
          Utiliser les menus de controles situé en haut de pages pour  recentrer la carte sur une campagne, une semaine et une parcelle d'intéret. 
          Cliquer sur une icone de parcelle pour accéder aux informations résumés sur la croissance des Apex de la parcelle.

          Chaque icone localisée sur la carte prend une couleur : du vert pale au vert foncé en fonction
          de son indice de croissance, ou grise si il n y a pas d observations. 
          
          Passer le curseur sur le bouton campagne précédente pour comparer la croissance des Apex de la campagne précédente. 
          
          Les indicateurs de croissance pour la semaine et la campagne, sont instantannément recalculé en fonction
          chaque de la campagne, de la semaine et de la parcelle sélectionnée.
          Ces indicateurs d'évolution de croissance proviennent de l'application Apex Vignes.
        </p>

        <router-link  to="/edit" class="nav-link">Editer</router-link>

        <p>
          Cette fonctionnalité permet d'ajouter ou de mettre à jour le résumé des observations collectées concernant l'état des Apex.
          Les informations mises à jour peuvent  concerner à la fois les résumés d'observations collectées par l'utilisateur ou encore
          les résumés d'observations reçu d'autres utilisateurs.
          Les mise-à-jours effectuées par un utilisateur sur les résumés d'observations collectés ou reçus restent locale à l'utilisateur.
          Ces mise-à-jours ne sont visibles que par l'utilisateur et ne modifient ni les observations collectées par l'utilisateur ni les observations partagées par un autre utilisateur.
          En cliquant sur Réinitialiser, tout utilisateur a la posibilité d'effacer ses mise-à-jours afin de retrouver les observations initialement collectées.
        </p>
        <router-link  to="/partage" class="nav-link">Patager</router-link>

        <p> 
          La fonctionnalité de partage permet de partager les observations collectées par un utilisateur sur une parcelle  avec un autre utilisateur.
          Les observations partagées ne concernent que le résumé des observations collectées sur le terrain par l'utilisateur.
          Le partage ne concerne pas les modifications de résumés qui eux restent locales à la session d'un utilisateur.
          Afin de controler le partage d'observations entre utilisateurs, un utilisateur ne peut partager que les résumés des observations qu'il a lui meme collecté.
          Un utilisateur ne peut pas re-partager les résumés d'observations qu'il a lui meme recu en partage.
          
        </p>

        <router-link  to="/partage" class="nav-link">Exporter</router-link>
        
        <p>
          Cette fonctionalité permet d'exporter au format pdf ou csv les résumés des observations collectés et recu par l'utilisateur
          Les résumés contiennet les indicateurs de croissances des apex et de contraintes hydriques d'une campagne sélectionnée.
        </p>

        <router-link  to="/profil" class="nav-link">Authentification</router-link>
          Cette fonctionalité va de paire avec le partage des données et permet aux utilisateurs de protéger l'accès à leurs espaces par un mot de passe.

        <h5>Contributeurs</h5>

        <p>
          L'application Apex Territoire est à l'initiative de Léo Pichon (porteur du projet).
          <b>Poute information contactez leo.pichon@gmail.com </b>.
          Cette aplication a bénéficié du développement de la cellule d'appui en informatique
          de l'institut de convergence #Digitag. 
          L'application a été développée par Vincent Armant et Amine Ouail avec la participation de Guilhem Brunel et Léo Pichon.
          Apex Territoire reprend les éléments graphiques et les indicateurs de croissance développés dans l’application ApeX Vigne.
        </p>
      </div>

    <!-- User Demo Guide-->

    </div>

</template>

<script>
export default {
  
  name: "Guide",
  

  created() {
    if (!this.$store.state.loggedUserEmail) {
      this.$router.push("/");
    }
  },

  mounted() {
    if (!this.$store.state.loggedUserEmail) {
      this.$router.push("/");
    }
  },

  methods: {},
};
</script>
<style scoped>
 .title {
    grid-area: tl;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }

p{
  text-align: justify;padding-left: 40px;padding-right: 40px;
}
.nav-link{
  text-align: center;
}

</style>
