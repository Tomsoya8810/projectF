<template>
  <div>
    <h1>This is new page.</h1>
  </div>
  <questionButtonView />
  <p>
    sectionやdivやpなど、ブロック要素をボーダーで囲うと、全幅（親要素の幅）になります。そのブロック要素の中のコンテンツが少なく、ボーダーの幅をコンテンツのサイズに合わせたい場合は、どう実装していますか？
    ブロック要素のままでは親要素の幅になってしまうので、通常はdisplay:
    inline;やdisplay: inline-block;を加えると思います。
    しかし、ブロック要素のwidthにfit-content値を使用すると、ブロック要素のまま（displayの値を変更せずに）コンテンツのサイズに合わせることができます。
  </p>
</template>

<script>
import questionButtonView from "@/components/questionButton.vue";
export default {
  name: "NewPageView",
  components: { questionButtonView },
};
</script>

<style></style>
