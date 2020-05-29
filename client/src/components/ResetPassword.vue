<template>
  <div class="container" style="margin-bottom: 50px;margin-top:20px;">
    <div class="row justify-content-center">
      <div class="col-6">
        <div class="card card-default">
          <div class="card-header">Mot de passe oublie</div>
          <div class="card-body">
            <form autocomplete="off" @submit.prevent="requestResetPassword" method="post">
              <div class="form-group">
                  <label for="email">E-mail</label>
                  <input type="email" id="email" class="form-control" placeholder="user@example.com" v-model="email" required>
              </div>
              <button type="submit" class="btn btn-primary">Envoyer le mot de passe </button>
            </form>
           
          </div>
           <p id="message"><b>{{message}}</b></p><p id="msg"><b>{{msg}}</b></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import ApexDataServices from '../services/ApexDataServices';
export default {
    data() {
      return {
        email: null,
        has_error: false,
        message:'',
        msg:''
       

      }
    },
    methods: {
           requestResetPassword() {
     let loggedUserEmail = this.email
       console.log(loggedUserEmail);
       
       ApexDataServices.checkEMail(loggedUserEmail).then(mailexist => {

         if(mailexist===true){
           ApexDataServices.ResetPassword(loggedUserEmail).then(resetPass => {
            if(resetPass===true){
              console.log('Mot de passe envoyer')
              this.msg='Mot de passe envoyer'
              this.message=''}
            else{
                this.message='Mot de passe non envoyer'
                this.msg=''
                console.log('mot de passe non envoye') }})
            
            }else{
            console.log('mail existe pas')
              this.message='Votre Mail est incorrect'
              this.msg=''}
          })
    }
    },
    }
</script>
<style>
#message{color:red}
#msg{color:green}
</style>