<template>
  <div>
    <h3>メールアドレス</h3>
    <input type="emali" v-model="email" />
    <h3>パスワード</h3>
    <input type="text" v-model="password" />
    <br /><button @:click="signUp">サインアップ</button>
  </div>
  <div>
    <h4>アカウントをお持ちの方は<span @:click="goSignIn">こちら</span></h4>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "@/firebase.js";
import { doc, setDoc } from "firebase/firestore";

export default {
  name: "signUpVue",
  data() {
    return {
      email: "",
      password: "",
      isin: false,
    };
  },

  methods: {
    signUp() {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
        })
        .then(() => {
          const userData = {
            profile: { name: "", comments: "", icon: "" },
            rankPoints: 0,
            followUsers: [],
            likedPosts: [],
            commentedPosts: [],
          };
          setDoc(doc(db, "users", auth.currentUser.uid), userData);
        })
        .then(this.$router.push("/"))
        .catch((error) => {
          alert(error.message);
        });
    },
    goSignIn() {
      this.isin = !this.isin;
      this.$emit("goIn", this.isin);
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
