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
          Le projet Apex Territoire est porté par Léo Pichon et a bénéficié du développement de la cellule d'appui en informatique
          des projets soutenus par #Digitag. Poute information contactez leo.pichon@gmail.com.
          Dans la suite nous détaillons les objectifs et le guide d'utilisation d'Apex Territoire.
          Vous pouvez directement commencez et cliquer sur l'onglet <a href="#/map">Carte</a> puis
          revenir sur le guide d'utilisation pour avoir plus d'informations sur les fonctionalités implémentées.
        </p>

          <h5>Objectifs</h5>
        <p>
          Apex territoire fait suite et est complémentaire à l'application Apex Vignes.
          L'objectif premier d'Apex Territoire est de proposer aux utilisateurs une
          <b> visualisation et une analyse spatio-temporelle de la croissance des apex observées.</b>
          Autour de cet objectif, nous avons implémentés de nouvelles fonctionnalités permettant 
          aux utilisateurs d'ajouter, de mettre à jour et de partager leurs observations.
          Ainsi, en plus de proposer une visualisation géolocalisées des indicateurs de croissance des apex,
          Apex Territoire est aussi une plate forme qui permet la mise-à-jour et le partage d'indicateurs 
          qui permettront de mieux comprendre et comparer la croissance des apex de vignes à travers différentes campagne et différents parcelles.
          Pour satifaire ces objectifs plusieurs fonctionalités ont été implémentés:
        </p>

        
          
        

        <router-link to="/map" class="nav-link">Carte</router-link>
        <p>
          La carte permet de localiser par des icones les parcelles observées par l'utilisateur 
          mais aussi les parcelles pour lesquelles l'utilisateur est destinataire du partage d'observations.
          Recentrer la carte sur une campagne, une semaine et une parcelle d'intéret à l'aide des menus de controles situé en haut de pages. 
          Cliquer sur une icone de parcelle pour accéder aux informations résumés sur la croissance des Apex de la parcelle.

          Chaque icone localisée sur la carte prend une couleur du vert pale au vert foncé dépendant
          de l'indice de croissance.
          Comparer la croissance des Apex de la campagne précédente en passant le curseur sur le bouton campagne précédente.
          
          Les indicateurs de croissance pour la semaine et la campagne, sont instantannément recalculé en fonction
          chaque de la campagne, de la semaine et de la parcelle sélectionnée.
          Ces indicateurs d'évolution de croissance sont issus d'Apex Vignes.
        </p>

        <router-link  to="/edit" class="nav-link">Editer</router-link>

        <p>
          Cette fonctionnalité permet d'ajouter ou de mettre à jour le résumé des observations collectées concernant l'état des Apex.
          Les informations mises à jour peuvent  concerner à la fois les résumés d'observations collectées par l'utilisateur ou encore
          les résumés d'observations partagés par d'autres utilisateurs.
          Les modifications effectuées par un utilisateur sur les résumés d'observations collectées ou recues, sont implémentées par de vues modifiables sur les données.
          Ces vues ne sont visibles que par l'utilisateur et ne modifie ni les observations collectées par l'utilisateur ni les observations partagées par un autre utilisateur.
          En cliquant sur Réinitialiser, tout utilisateur a la posibilité d'effacer les modifications qu'il a effectué pour une parcelle donnée afin de se baser à nouveau sur les observations collectées.
        </p>
        <router-link  to="/partage" class="nav-link">Patager</router-link>

        <p> 
          La fonctionnalité de partage permet de partager les observations collectées par un utilisateur sur une parcelle  avec un autre utilisateur.
          Les observations partagées ne concernent que le résumé de données collectées sur le terrain par l'utilisateur.
          Afin de controler le partage d'observations un utilisateur ne peut pas partager les résumés d'observations qu'il a lui meme recu en partage.
          Sur la page de Partage un utilisateur peut 
        </p>

        <router-link  to="/partage" class="nav-link">Exporter</router-link>
        
        <p>
          Cette fonctionalité permet d'exporter au format pdf ou csv les résumés des observations et 
          les indicateurs de croissances des apex sur une campagne sélectionnée.
          
        </p>


        <h5>Contributeurs</h5>

        L'application Apex Territoire est à l'initiative de Léo Pichon (porteur du projet) et reprend les éléments de la charte graphique et les indicateurs de croissance  développés par Guilhem Brunel et Léo Pichon dans l’application ApeX Vigne.
        L'application Apex Territoire a été développé par la cellule d'appui en informatique de #Digitag (Vincent Armant responsable du développement et Amine Ouail développeur). 

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
