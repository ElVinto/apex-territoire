import Vue from 'vue'
import Router from 'vue-router'
import Profil from '../components/Profile.vue';
import Login from '../components/Login.vue';
import Informations from '../components/Informations.vue';

import Partage from '../components/Partage';
import ApexMap from '../components/ApexMap';
import Addpsw from '../components/Addpsw';
import ResetP from '../components/ResetPassword';
import Export from '../components/Export';



Vue.use(Router)

export default new Router({
  routes: [

    {
      path: '/partage',
      name: 'partage',
      component: Partage
    },

    {
      path: '/profil',
      name: 'profil',
      component: Profil
    },
    {
      path: '/export',
      name: 'export',
      component: Export
    },


    {
      path: '/informations',
      name: 'informations',
      component: Informations
    }, 
    
    {
      path: '/',
      name: 'login',
      component: Login
    },
    
    {
      path: '/addpsw',
      name: 'addpsw',
      component: Addpsw
    },

    {
      path: '/resetp',
      name: 'resetp',
      component: ResetP
    },

    {
      path: '/map',
      name: 'map',
      component: ApexMap
    },



  ]
})
