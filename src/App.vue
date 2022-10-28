<template>
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
*,
::after,
::before {
  margin: 0;
  padding: 0;
}

html {
  padding-bottom: 0;
}

body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  background-color: #a9a9a9;
  background-size: cover;
}

nav {
  padding: 30px;
}

nav a,
nav div {
  font-weight: bold;
  margin-left: 20px;
  text-decoration: underline;
  cursor: pointer;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
