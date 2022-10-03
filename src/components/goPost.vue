<template>
  <div>
    <h2>問題提起の投稿</h2>
    <h3>タイトル</h3>
    <input type="text" v-model="postTitle" />
    <h3>本文</h3>
    <textarea cols="30" rows="10" v-model="postContent"></textarea>
    <button @click="gopost">投稿</button>
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
