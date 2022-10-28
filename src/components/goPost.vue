<template>
  <div>
    <div class="title-box">
      <h1 class="title">Post</h1>
    </div>
    <div class="post-box">
      <div class="post-title-box">
        <h3>Title</h3>
        <h4>タイトル</h4>
        <input type="text" v-model="postTitle" />
      </div>
      <div class="line"></div>
      <div class="post-content-box">
        <h3>Content</h3>
        <h4>本文</h4>
        <textarea cols="30" rows="5" v-model="postContent"></textarea>
      </div>
    </div>
    <div class="post-button button" @click="gopost">
      <div class="button-in-box">
        <h3>投 稿</h3>
        <h5>P o s t</h5>
      </div>
    </div>
    <div class="margin"></div>
  </div>
</template>

<script>
import { getAuth } from "@firebase/auth";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  orderBy,
  limit,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "goPostVue",
  data() {
    return {
      postTitle: "",
      postContent: "",
      newIndex: 0,
      // postComment: [],
    };
  },
  methods: {
    async gopost() {
      const syutoku = [];
      const auth = getAuth();
      let count = 0;
      const colRef = collection(db, "posts");
      const lengthRef = await getDocs(colRef);
      lengthRef.forEach((doc) => {
        syutoku.push(doc.data());
      });
      await getDocs(query(colRef, orderBy("index", "desc"), limit(1))).then(
        (e) => {
          e.forEach((doc) => {
            this.newIndex = doc.data().index + 1;
          });
        }
      );
      const data = {
        user: auth.currentUser.uid,
        title: this.postTitle,
        content: this.postContent,
        // comment: this.postComment,
        index: this.newIndex + count,
        likedCount: 0,
      };
      await setDoc(doc(colRef, `post${data.index}`), data);
      this.postContent = this.postTitle = "";
      count = count + 1;
    },
  },
};
</script>

<style scoped>
body {
  overflow-x: visible;
  overflow-y: visible;
}
.title {
  margin-left: auto;
  margin-right: auto;
  margin-top: 4vh;
  font-size: calc(6vh + 3vw);
  line-height: 0.5vh;
}
.title-box::after {
  content: "";
  display: inline-block;
  background-color: #fff;
  width: 10vh;
  height: 1vh;
  margin-left: auto;
  margin-right: auto;
  margin-top: 8vh;
}

.post-box {
  border: #fff solid 2px;
  height: 40vh;
  width: 80vw;
  border-radius: 10vh;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-top: 3vh;
}
.post-title-box h3,
.post-title-box h4,
.post-title-box input,
.post-content-box h3,
.post-content-box h4,
.post-content-box input {
  display: block;
}
.post-title-box,
.post-content-box {
  display: flex;
  align-items: center;
}
.post-title-box h3,
.post-content-box h3 {
  margin-left: 5vw;
  font-size: calc(2vw + 2vh);
  position: relative;
  letter-spacing: 0.2vw;
}
.post-title-box h3::after,
.post-content-box h3::after {
  content: "";
  display: block;
  background-color: #fff;
  width: 0.3vw;
  height: calc(2.5vw + 2.5vh);
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  top: 0;
  left: calc(100% + 2vw);
}
.post-title-box h4,
.post-content-box h4 {
  font-size: calc(1vw + 1vh);
  margin-left: 5vw;
  letter-spacing: 1.5vw;
}
.post-title-box input,
.post-content-box textarea {
  margin-left: 5vw;
  width: 35vw;
}
.post-content-box textarea {
  height: 10vh;
}
.post-title-box,
.post-content-box {
  width: 90vw;
  position: relative;
}
.post-content-box {
  margin-bottom: 4vw;
}
.post-title-box {
  margin-top: 3vw;
}
.line {
  border: #fff solid 1px;
  background-color: #fff;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.post-button {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 20vh;
  height: 12vh;
  background-color: #3c3c3c;
  color: #fff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3vh;
  padding: 2vh;
  z-index: 3;
  border-radius: 2vh;
}
.post-button h3 {
  display: inline-block;
  margin: 0;
  margin-top: 2vh;
  font-size: 3.5vh;
  line-height: 2.2vh;
}
.post-button h3::after {
  content: "";
  display: inline-block;
  background-color: #fff;
  width: 18vh;
  height: 2px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0vh;
}
.post-button h5 {
  display: inline-block;
  margin: 0;
  margin-bottom: 2vh;
  font-size: 2.2vh;
  letter-spacing: 0.2em;
}
.button-in-box {
  border: #fff solid 1px;
}
.margin {
  height: 3vh;
}

.button:hover {
  transform: scale(1.1);
  transition-duration: 0.3s;
  cursor: pointer;
}
</style>
