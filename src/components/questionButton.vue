<template>
  <div>
    <div class="help-button button" @click="show">
      <div class="button-icon"></div>
      <h4 class="button-text">Help</h4>
    </div>
    <div class="help-text-area" id="help-text-area">
      <div class="help-hidden-button" @click="hidden">×</div>
      <p>
        〇このアプリについて
        このアプリは自分の悩みを投稿、そして他の人の悩みを見られるアプリです。<br />
        特徴として、悩みに対してアドバイスをするのではなく、共感リアクションを送ることができます。<br />
        --------------------------------------------------------------------------<br /><br />
        〇悩みの投稿について<br />
        悩みの投稿は、Postから行うことができます。<br />
        それぞれタイトルと本文を記入し、投稿ボタンを押すと投稿できます。<br />
        --------------------------------------------------------------------------<br /><br />
        〇投稿履歴について<br />
        自分の過去の投稿は、Logから見ることができます。<br />
        タイトルと投稿日時、共感リアクションの数を確認でき、本文の確認や投稿の削除など、より詳細に見たい場合は開くボタンを押します。
        投稿の削除は開くボタンを押すと出てくる削除ボタンを押すと可能です。<br />
        --------------------------------------------------------------------------<br /><br />
        〇あなたの情報について<br />
        あなたの情報は、Mydataから確認できます。<br />
        Prolileから名前の変更が行えます。デフォルトの名前にはランダムな英数字が割り振られているので、新しいユーザーネームを入力して、編集ボタンを押してください。<br />
        Rankには、今までにされた共感リアクションの数と、それに基づくランクが表示されています。<br />
        --------------------------------------------------------------------------<br /><br />
        〇他の人の悩みについて<br />
        他の人の悩みは、Reviewから見ることができます。<br />
        投稿履歴と同様に、タイトルと投稿日時、共感リアクションの数を確認でき、本文をより詳細に見たい場合、投稿者をフォローしたい場合は開くボタンを押します。<br />
        また、共感リアクションをすることができ、共感ボタンを押すとリアクションが送れます。<br />
        さらに、開くボタンを押したときに表示されるフォローするボタンを押すと投稿者をフォローすることもできます。画面左上のフォローユーザーの投稿のみを見るボタンを押すと、今までフォローしたユーザーの投稿のみが表示されます。<br />
        フォローを解除する場合はフォロー解除ボタンを押します。
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "help-button",
  data() {
    return {};
  },
  methods: {
    show() {
      const helpTextArea = document.getElementById("help-text-area");
      helpTextArea.classList.add("isShow");
    },
    hidden() {
      const helpTextArea = document.getElementById("help-text-area");
      helpTextArea.classList.remove("isShow");
    },
  },
};
</script>

<style scoped>
.help-button {
  width: 50px;
  cursor: pointer;
}
.button-icon {
  display: inline-block;
  background-image: url(@/assets/？.png);
  background-size: 100%;
  background-repeat: no-repeat;
  background-color: red;
  width: 50px;
  height: 50px;
  border-radius: 100%;
}

.button-text {
  margin: 10px 0 10px 0;
}

.help-hidden-button {
  background-color: red;
  font-size: 25px;
  height: 30px;
  width: 30px;
  position: sticky;
  top: 5px;
  left: 5px;
}
.help-hidden-button:hover {
  transform: scale(1.3);
  transition: 0.3s;
  cursor: pointer;
}

.help-text-area {
  width: 88vw;
  margin-left: auto;
  margin-right: auto;
  border: solid 2px;
  height: calc(100vh - 100px);
  overflow: scroll;
  position: fixed;
  top: 20vh;
  right: 5vw;
  color: white;
  background-color: rgba(30, 30, 30, 0.5);
  display: none;
  z-index: -1;
  transition-duration: 1s;
}
.help-text-area::-webkit-scrollbar {
  display: none;
}
.help-text-area p {
  text-align: left;
  display: inline-block;
  width: 90%;
  margin: 10px auto 50px auto;
}

.isShow {
  display: block;
  transition-duration: 1s;
  z-index: 10;
}
</style>
