<template>
  <div class="footer">
    <h1>{{ msg }}</h1>
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return{
      msg: "Place the footer here"
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
