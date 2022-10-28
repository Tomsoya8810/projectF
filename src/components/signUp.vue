<template>
  <div class="signup">
    <router-link to="/" class="to-home-button">
      <div>×</div>
      <h5>Home</h5>
    </router-link>
    <div class="signin-button-area button" @:click="goSignIn">
      <h3>登録済の方</h3>
      <h5>T o S i g n I n</h5>
    </div>
    <div class="title-box">
      <h1 class="title">Sign In</h1>
    </div>
    <div class="signup-box">
      <div class="email-box">
        <h3>E-mail</h3>
        <input type="emali" v-model="email" />
      </div>
      <div class="password-box">
        <h3>Password</h3>
        <input type="text" v-model="password" />
      </div>
    </div>
    <div class="register-button button" @:click="signUp">
      <div class="button-in-box">
        <h3>登 録</h3>
        <h5>S i g n U p</h5>
      </div>
    </div>
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

.signup {
  height: 100vh;
  overflow-y: scroll;
}
.signup::-webkit-scrollbar {
  display: none;
}
.to-home-button {
  display: block;
  color: #fff;
  width: 10vw;
  height: 10vh;
  text-decoration: none;
  color: #ff6c6c;
}
.to-home-button div {
  width: 6vh;
  height: 6vh;
  margin-left: auto;
  margin-right: auto;
  border: solid #ff6c6c 1px;
  border-radius: 50%;
  font-size: 5.1vh;
}
.to-home-button h5 {
  margin: 0;
}

.signin-button-area {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 25vw;
  height: 15vw;
  background-color: #3c3c3c;
  color: #fff;
  position: fixed;
  top: 0;
  right: 0;
  text-decoration: none;
  z-index: 10;
}
.signin-button-area h3 {
  display: inline-block;
  margin: 0;
  margin-top: 1vh;
  font-size: 3vw;
  line-height: 4vw;
}
.signin-button-area h3::after {
  content: "";
  display: inline-block;
  background-color: #fff;
  width: 15vw;
  height: 2px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0vh;
}
.signin-button-area h5 {
  display: inline-block;
  margin: 0;
  margin-bottom: 2vh;
  font-size: 1.5vw;
  letter-spacing: 0.2em;
}

.title {
  margin-left: auto;
  margin-right: auto;
  margin-top: 0;
  font-size: calc(6vh + 3vw);
  line-height: 5vh;
}
.title-box::after {
  content: "";
  display: inline-block;
  background-color: #fff;
  width: 10vh;
  height: 1vh;
  margin-left: auto;
  margin-right: auto;
  margin-top: 7vh;
}
.signup-box {
  height: 35vh;
  width: 80vw;
  margin-top: 10vh;
  margin-left: auto;
  margin-right: auto;
  border: solid #fff 2px;
  border-radius: 10vh;
  padding: 3vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.email-box {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.email-box h3 {
  font-size: 4vh;
}
.email-box input {
  width: 40vw;
}
.password-box {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.password-box h3 {
  font-size: 4vh;
}
.password-box input {
  width: 40vw;
}

.register-button {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 25vh;
  height: 15vh;
  background-color: #3c3c3c;
  color: #fff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3vh;
  padding: 1vh;
}
.register-button h3 {
  display: inline-block;
  margin: 0;
  margin-top: 2vh;
  font-size: 4vh;
  line-height: 2.5vh;
}
.register-button h3::after {
  content: "";
  display: inline-block;
  background-color: #fff;
  width: 20vh;
  height: 2px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0vh;
}
.register-button h5 {
  display: inline-block;
  margin: 0;
  margin-bottom: 2vh;
  font-size: 2.5vh;
  letter-spacing: 0.2em;
}
.button-in-box {
  border: #fff solid 1px;
}
</style>
