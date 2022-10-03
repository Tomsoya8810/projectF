<template>
  <signInVue @goUp="goSignUp" v-if="isin" />
  <signUpVue @goIn="goSignIn" v-else />
</template>

<script>
import signInVue from "@/components/signIn.vue";
import signUpVue from "@/components/signUp.vue";

export default {
  data() {
    return {
      isin: true,
    };
  },

  methods: {
    goSignUp(e) {
      this.isin = e;
    },
    goSignIn(e) {
      this.isin = e;
    },
  },
  components: { signInVue, signUpVue },
};
</script>
