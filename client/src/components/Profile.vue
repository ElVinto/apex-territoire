<template>
  <div class="global">
    <br />
    <div class="menu">
      <hr />
      <h5 class="title" style="background-color:grey">
        Bonjour {{ $store.state.userDataObj.userName }}
      </h5>
      <hr />
      <p>email: {{ $store.state.userDataObj.userEMail }}</p>
      <div v-if="$store.state.loggedUserEmail != 'baptiste.oger@supagro.fr'">
        <router-link
          to="/addpsw"
          tag="button"
          class="btn btn-success btn-sm"
          style="margin-bottom:20px;"
          >Ajouter/Modifier un mot de passe
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},

  props: {
    userId: String,
  },

  computed: {},

  data() {
    return {};
  },

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
table {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  border-collapse: collapse;
}
tr:nth-of-type(odd) {
  background: #eee;
}
th {
  background: #333;
  color: white;
  font-weight: bold;
}
td,
th {
  padding: 6px;
  border: 1px solid #ccc;
  text-align: left;
}
</style>
