import Vue from 'vue'
import Router from 'vue-router'

import ApexMap from '../components/ApexMap';
import Edit from '../components/Edit.vue';
import Partage from '../components/Partage';
import Export from '../components/Export';
import Profil from '../components/Profile.vue';
import Guide from '../components/Guide.vue';

import Login from '../components/Login.vue';
import Addpsw from '../components/Addpsw';
import ResetP from '../components/ResetPassword';


Vue.use(Router)

export default new Router({
  routes: [

    {
      path: '/map',
      name: 'map',
      component: ApexMap
    },

    {
      path: '/edit',
      name: 'edit',
      component: Edit
    },

    {
      path: '/partage',
      name: 'partage',
      component: Partage
    },

    {
      path: '/export',
      name: 'export',
      component: Export
    },

    {
      path: '/profil',
      name: 'profil',
      component: Profil
    },

    {
      path: '/guide',
      name: 'guide',
      component: Guide
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

  ]
})