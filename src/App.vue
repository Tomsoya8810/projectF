<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/SignIn" v-if="logStatus === false">SignIn</router-link>
    <div v-else style="display: inline" @:click="signOut">SignOut</div>
  </nav>
  <router-view />
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "@firebase/auth";

export default {
  data() {
    return {
      logStatus: false,
    };
  },
  methods: {
    signOut() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          alert("サインアウト");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.logStatus = true;
      } else {
        this.logStatus = false;
      }
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a,
nav div {
  font-weight: bold;
  color: #2c3e50;
  margin-left: 20px;
  text-decoration: underline;
  cursor: pointer;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
