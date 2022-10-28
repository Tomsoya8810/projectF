<template>
  <div class="help-button button" @click="show">
    <div class="button-icon"></div>
    <h4 class="button-text">Help</h4>
  </div>
  <div class="help-text-area" id="help-text-area">
    <div class="help-hidden-button" @click="hidden"></div>
    <p>
      z-indexとは
      z-indexはボックスの重なりの優先順位(スタックレベル)を指定するプロパティです。
      通常では後に記述されたものが画面では手前に配置されますが、z-indexを使用することによって自由に優先順位を設定できます。
      z-indexの書き方 z-indexは以下のように記述します。 z-index: 値;
      値は整数（負の値も指定可能、小数点は不可）で入力し、大きい数値のものほど手前に表示されます。
      z-indexを使用するには、その要素にpositionプロパティでstatic(初期値)以外の値が適用されている必要があります。
      autoを入力した場合は親要素と同じ値が設定されます。
      親要素でz-indexの指定がされていない場合、値は0です。(初期値)
      Transformは要素に動きをつけるためのプロパティである。
      transitionとよく似ているが、transitionが2状態間の変化を指定するプロパティであったのに対し、
      transformは状態にかかわらず、要素そのものの属性を変化させることができる。なお、インライン要素には聞かないので注意。
      transformには4つのプロパティがある。Translate(移動効果)、rotate(回転効果)、scale(伸縮効果)、skew(歪曲効果)である。
      すべてX軸とY軸の効果距離を設定できる。Z軸方向にも設定したい場合、XX(effect
      name)3dとするとよい。
    </p>
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
  height: 30px;
  width: 30px;
}

.help-text-area {
  width: 88vw;
  margin-left: auto;
  margin-right: auto;
  border: solid 2px;
  height: calc(100vh - 100px);
  overflow: scroll;
  position: fixed;
  top: 50px;
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

.isShow {
  display: block;
  transition-duration: 1s;
  z-index: 2;
}
</style>
