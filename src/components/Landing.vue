<template>
  <router-link to="/SignIn" class="login-button-area button">
    <h3>ログイン＆登録</h3>
    <h5>T o L o g i n & S i g n U p</h5>
  </router-link>
  <div class="main-message-area">
    <div class="main-message-box">
      <h1>No Answer</h1>
      <h4>この世には、答えのない問いが多すぎる。</h4>
    </div>
  </div>
  <div class="about-area">
    <div class="about-title">
      <h3 class="about-title-first">What's this website?</h3>
      <h3 class="about-title-second">できること</h3>
    </div>
    <div class="for-after"></div>
    <div class="about-contents">
      <div class="about-contents-box">
        <div class="about-contents-left">
          <h5>悩みを投稿する</h5>
          <h5>↓</h5>
          <h5>人から共感リアクションを得る</h5>
          <h5>↓</h5>
          <h5>履歴で確認する</h5>
          <h4 class="box-in-left">About You</h4>
        </div>
        <div class="about-contents-right">
          <h5>他人の悩みを閲覧する</h5>
          <h5>↓</h5>
          <h5>共感リアクションをする</h5>
          <h5>↓</h5>
          <h5>共感ランクUP</h5>
          <h4 class="box-in-right">About Others</h4>
        </div>
      </div>
      <h2 class="about-contents-message">
        悩みには共感を。<br />
        正解などないのだから。
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "LandingVue",
};
</script>

<style scoped>
.login-button-area {
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
.login-button-area h3 {
  display: block;
  margin-top: 2.5vw;
  font-size: 3vw;
}
.login-button-area h3::after {
  content: "";
  display: block;
  background-color: #fff;
  width: 22vw;
  height: 0.15vw;
  margin: 1.5vw auto 2vw auto;
}
.login-button-area h5 {
  display: block;
  margin: 0;
  margin-bottom: 2.5vw;
  font-size: 1.5vw;
  letter-spacing: 0.1vw;
}

.main-message-area {
  height: 80vh;
  display: flex;
  align-items: center;
}
.main-message-box {
  width: 88vw;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  position: relative;
}
.main-message-area h1 {
  margin: 0;
  font-size: 12vw;
  line-height: 1.33;
}
.main-message-area h1::after {
  content: "";
  display: block;
  background-color: #fff;
  width: 65vw;
  height: 2px;
}
.main-message-area h4 {
  font-size: 3vw;
  margin-top: 2.5vw;
  letter-spacing: 0.2vw;
}

.about-area {
  height: 100vh;
}
.about-title {
  width: 80vw;
  height: 15vh;
  margin-left: auto;
  margin-right: auto;
}
.about-title::after {
  content: "";
  display: block;
  background-color: #fff;
  width: 65vw;
  height: 0.2vw;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3vh;
  margin-bottom: 4vh;
}
.about-title h3 {
  display: inline-block;
  font-size: 4vw;
  margin-top: auto;
  margin-bottom: auto;
  line-height: 100%;
  margin-top: 4vh;
}
.about-title-first {
  position: relative;
}
.about-title-second {
  margin-left: 4.3vw;
}
.about-title-first::after {
  content: "";
  display: block;
  background-color: #fff;
  width: 0.3vw;
  height: 4vw;
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  top: 0;
  left: calc(100% + 2vw);
}
.for-after {
  content: "";
  display: block;
  background-color: #fff;
  width: 12vw;
  height: 1vh;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3vh;
}
.about-contents {
  width: 88vw;
  height: 60vh;
  margin: 6vh auto 0vh auto;
  border: solid #fff 2px;
  border-radius: 10vh;
}
.about-contents-box {
  display: flex;
  justify-content: flex-start;
  width: 78vw;
  margin-left: 5vw;
  margin-right: 5vw;
  margin-top: 5vh;
}
.about-contents-left {
  text-align: left;
  position: relative;
  width: 38vw;
}
.about-contents-left h5 {
  margin-top: 1vh;
  margin-bottom: 1vh;
  font-size: calc(0.75vh + 1.1vw);
}
.about-contents-left :first-child,
.about-contents-right :first-child {
  margin-top: 3vh;
}
.box-in-left {
  right: 2vw;
}
.about-contents-left::after {
  content: "";
  display: block;
  background-color: #fff;
  width: 0.3vw;
  height: calc(100% - 2vh);
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  top: 2vh;
  left: calc(100% + 1vw);
}
.about-contents-right {
  text-align: right;
  position: relative;
  width: 38vw;
  margin-left: 2vw;
}
.box-in-right {
  left: 2vw;
}
.about-contents-right h5 {
  margin: 1vh;
  font-size: calc(0.75vh + 1.1vw);
}
.box-in-left,
.box-in-right {
  position: absolute;
  margin: 0;
  bottom: 1vh;
  border: #fff solid 1px;
  border-radius: 2vh;
  padding: 3%;
  font-size: 2vw;
}
.about-contents-message {
  font-size: 6vh;
  text-align: left;
  margin-left: 5vw;
  margin-top: 5vh;
  margin-bottom: 5vh;
}
</style>
