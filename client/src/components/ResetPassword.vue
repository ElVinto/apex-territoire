<template>
  <div class="container" style="margin-bottom: 50px;">
    <div class="row justify-content-center">
      <div class="col-6">
        <div class="card card-default">
          <div class="card-header">Reset Password</div>
          <div class="card-body">
            <form autocomplete="off" @submit.prevent="requestResetPassword" method="post">
              <div class="form-group">
                  <label for="email">E-mail</label>
                  <input type="email" id="email" class="form-control" placeholder="user@example.com" v-model="email" required>
              </div>
              <button type="submit" class="btn btn-primary">Send Password Reset Link</button>
            </form>
           
          </div>
           <p>{{message}}</p>
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
        message:''
      }
    },
    methods: {
        requestResetPassword() {
     let loggedUserEmail = this.email
      
       ApexDataServices.checkEMail(loggedUserEmail).then(emailIsvalid => {
        if(emailIsvalid === true){
            this.message = 'mail trouvé'
            
          
           
      
        }else{this.message = 'mail non enregistré'}
    })
}},
}
</script>