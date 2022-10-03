<template>
  <div>
    <h3>メールアドレス</h3>
    <input type="emali" v-model="email" />
    <h3>パスワード</h3>
    <input type="text" v-model="password" />
    <br /><button @:click="signIn">サインイン</button>
    <button @:click="auto">自動</button>
  </div>
  <div>
    <h4>
      まだアカウントをお持ちでない方は<span @:click="goSignUp">こちら</span>
    </h4>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default {
  name: "signInVue",
  data() {
    return {
      email: "",
      password: "",
      isin: true,
    };
  },

  methods: {
    signIn() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(this.$router.push("/"))
        .catch((error) => {
          alert(error.message);
        });
    },
    auto() {
      this.email = "test5@t.jp";
      this.password = "testtest5";
      this.signIn();
    },
    goSignUp() {
      this.isin = !this.isin;
      this.$emit("goUp", this.isin);
      console.log(this.isin);
    },
  },
};
</script>

<style scoped>
h4 span {
  cursor: pointer;
  text-decoration: underline;
}
</style>
