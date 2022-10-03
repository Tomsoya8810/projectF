<template>
  <div v-if="!logStatus" class="home">
    <h2>ログイン状態</h2>
    <h3>ログアウト中</h3>
  </div>
  <div v-else class="home">
    <h2>ログイン状態</h2>
    <h3>ログイン中</h3>
    <div class="login-nav">
      <h6 @:click="post">問題提起の投稿</h6>
      <h6 @:click.once="golog" @:click="log">投稿履歴</h6>
      <h6 @:click="rank">ランク情報</h6>
      <h6 @:click="goreview">他人の問題提起</h6>
    </div>
    <goPostVue v-if="page === 1" />
    <div v-if="page === 2">
      <h2>投稿履歴</h2>
      <div id="mine">
        <h2>一覧</h2>
      </div>
      <div v-for="(Syutoku, index) in syutoku" :key="index">
        {{ index + 1 }}： {{ Syutoku.title }}<br />
        {{ Syutoku.content }}<br />
        ----------------------------------
      </div>
    </div>
    <div v-if="page === 3">
      <h2>ランク情報</h2>
    </div>
    <div v-if="page === 4">
      <h2>他の人の問題提起</h2>
      <div id="other">
        <h2>一覧</h2>
      </div>
    </div>
  </div>
  <button @click="test">テスト</button>
</template>

<script>
import { getAuth, onAuthStateChanged } from "@firebase/auth";
// @ is an alias to /src
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase.js";
import goPostVue from "@/components/goPost.vue";

export default {
  name: "HomeView",
  data() {
    return {
      logStatus: false,
      page: 1,
      syutoku: [],
      syutokuOther: [],
      // newComment: "",
      otherCard: "",
      newFollowUsers: [],
      removeFollowUsers: [],
      alreadyFollowUsers: [],
      alreadyLikedPosts: [],
      newLikedPosts: [],
      removeLikedPosts: [],
      newArr: [],
    };
  },
  methods: {
    post() {
      this.page = 1;
    },
    log() {
      this.page = 2;
    },
    async golog() {
      if (this.syutoku.length === 0) {
        const auth = getAuth();
        const q = query(
          collection(db, "posts"),
          where("user", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((e) => {
          // doc.data() is never undefined for query doc snapshots
          // this.syutoku.push(doc.data());

          this.syutoku.unshift(e.data());
          const postData = {
            // comment: this.syutoku[0].comment,
            content: this.syutoku[0].content,
            index: this.syutoku[0].index,
            title: this.syutoku[0].title,
            likedCount: this.syutoku[0].likedCount,
          };
          // const number = postData.index;
          const mine = document.getElementById("mine");
          const postCard = document.createElement("div");
          const postTitle = document.createElement("h3");
          postTitle.textContent = "タイトル：" + postData.title;
          const postContent = document.createElement("h4");
          postContent.textContent = "本文：" + postData.content;
          const postLIkedCount = document.createElement("h4");
          postLIkedCount.textContent = "いいね" + postData.likedCount;
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "この投稿を削除";
          deleteButton.onclick = async function () {
            await deleteDoc(doc(db, "posts", `post${postData.index}`));
          };
          // 表示エリア
          // const commentArea = document.createElement("div");
          // const commentLog = document.createElement("div");
          // const commentInput = document.createElement("textarea");
          // const commentButton = document.createElement("button");
          // commentButton.textContent = "コメントする";
          // const comments = this.syutoku[0].comment;
          // commentLog.textContent = comments;
          // commentButton.onclick = async function () {
          //   comments.push(commentInput.value);
          //   commentLog.textContent = comments;
          //   const comRef = doc(db, "posts", `post${number}`);
          //   await updateDoc(comRef, {
          //     comment: arrayUnion(commentInput.value),
          //   });
          //   commentInput.value = "";
          // };
          // // コメントエリア
          // commentArea.append(commentInput, commentButton, commentLog);
          postCard.append(
            postTitle,
            postContent,
            // commentArea,
            postLIkedCount,
            deleteButton
          );
          mine.append(postCard);
        });
      }
    },
    rank() {
      this.page = 3;
    },
    async goreview() {
      this.page = 4;
      if (this.syutokuOther.length === 0) {
        const auth = getAuth();
        const userRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        this.alreadyLikedPosts = docSnap.data().likedPosts;
        this.alreadyFollowUsers = docSnap.data().followUsers;
        const q = query(
          collection(db, "posts"),
          where("user", "!=", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((e) => {
          // doc.data() is never undefined for query doc snapshots
          this.syutokuOther.unshift(e.data());
          const postData = {
            // comment: this.syutokuOther[0].comment,
            content: this.syutokuOther[0].content,
            index: this.syutokuOther[0].index,
            title: this.syutokuOther[0].title,
            user: this.syutokuOther[0].user,
            likedCount: this.syutokuOther[0].likedCount,
          };
          // const number = postData.index;
          let varIsLike = this.alreadyLikedPosts.some((e) => {
            return e.index == postData.index;
          });
          const other = document.getElementById("other");
          const postCard = document.createElement("div");
          const postTitle = document.createElement("h3");
          postTitle.textContent = "タイトル：" + postData.title;
          const postContent = document.createElement("h4");
          postContent.textContent = "本文：" + postData.content;
          const postUser = document.createElement("h4");
          postUser.textContent = "投稿者：" + postData.user;
          const followButton = document.createElement("button");
          followButton.textContent = "フォロー";
          let isFollow = this.alreadyFollowUsers.some((e) => {
            return e == postData.user;
          });
          const followState = document.createElement("h4");
          followState.textContent = isFollow;
          followButton.onclick = function () {
            isFollow = !isFollow;
            followState.textContent = isFollow;
            if (isFollow == true) {
              if (
                this.alreadyFollowUsers.some((e) => {
                  return e == postData.user;
                })
              ) {
                this.removeFollowUsers = this.removeFollowUsers.filter((e) => {
                  return JSON.stringify(e) !== JSON.stringify(postData.user);
                });
              } else {
                this.newFollowUsers.push(postData.user);
              }
            } else {
              if (
                this.alreadyFollowUsers.some((e) => {
                  return e == postData.user;
                })
              ) {
                this.removeFollowUsers.push(postData.user);
              } else {
                this.newFollowUsers = this.newFollowUsers.filter((e) => {
                  return JSON.stringify(e) !== JSON.stringify(postData.user);
                });
              }
            }
          }.bind(this);
          const postLIkedCount = document.createElement("h4");
          postLIkedCount.textContent = "いいね" + postData.likedCount;
          const likeButton = document.createElement("button");
          const isLike = document.createElement("h4");
          likeButton.textContent = "いいね";
          isLike.textContent = varIsLike;
          likeButton.onclick = function () {
            varIsLike = !varIsLike;
            isLike.textContent = varIsLike;
            if (varIsLike === true) {
              if (
                this.alreadyLikedPosts.some((e) => {
                  return e.index == postData.index;
                })
              ) {
                this.removeLikedPosts = this.removeLikedPosts.filter((e) => {
                  return JSON.stringify(e) !== JSON.stringify(postData);
                });
              } else {
                this.newLikedPosts.push(postData);
              }
            } else {
              if (
                this.alreadyLikedPosts.some((e) => {
                  return e.index == postData.index;
                })
              ) {
                this.removeLikedPosts.push(postData);
              } else {
                this.newLikedPosts = this.newLikedPosts.filter((e) => {
                  return JSON.stringify(e) !== JSON.stringify(postData);
                });
              }
            }
            console.log(this.removeLikedPosts);
          }.bind(this);
          // 表示エリア
          // const commentArea = document.createElement("div");
          // const commentLog = document.createElement("div");
          // const commentInput = document.createElement("textarea");
          // const commentButton = document.createElement("button");
          // commentButton.textContent = "コメントする";
          // const comments = this.syutokuOther[0].comment;
          // commentLog.textContent = comments;
          // commentButton.onclick = async function () {
          //   comments.push(commentInput.value);
          //   commentLog.textContent = comments;
          //   const comRef = doc(db, "posts", `post${number}`);
          //   await updateDoc(comRef, {
          //     comment: arrayUnion(commentInput.value),
          //   });
          //   commentInput.value = "";
          // };
          // // コメントエリア
          // commentArea.append(commentInput, commentButton, commentLog);
          postCard.append(
            postTitle,
            postContent,
            postUser,
            followButton,
            followState,
            // commentArea,
            postLIkedCount,
            likeButton,
            isLike
          );
          other.append(postCard);
        });
      }
    },
    test() {
      this.$router.push("/NewPage");
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.logStatus = true;
      } else {
        this.logStatus = false;
      }
    });
  },
  async unmounted() {
    if (this.logStatus === true) {
      if (this.newLikedPosts !== [] && this.removeLikedPosts !== []) {
        const auth = getAuth();
        const docRef = doc(db, "users", auth.currentUser.uid);
        if (this.newLikedPosts !== []) {
          this.newLikedPosts.forEach((e) => {
            updateDoc(docRef, {
              likedPosts: arrayUnion(e),
            });
            const countRef = doc(db, "posts", `post${e.index}`);
            updateDoc(countRef, {
              likedCount: increment(1),
            });
          });
        }
        if (this.removeLikedPosts !== []) {
          this.removeLikedPosts.forEach((e) => {
            e.likedCount = e.likedCount - 1;
            updateDoc(docRef, {
              likedPosts: arrayRemove(e),
            });
            const countRef = doc(db, "posts", `post${e.index}`);
            updateDoc(countRef, {
              likedCount: increment(-1),
            });
          });
        }
        if (this.newFollowUsers !== []) {
          this.newFollowUsers.forEach((e) => {
            updateDoc(docRef, {
              followUsers: arrayUnion(e),
            });
          });
        }
        if (this.removeFollowUsers !== []) {
          this.removeFollowUsers.forEach((e) => {
            updateDoc(docRef, {
              followUsers: arrayRemove(e),
            });
          });
        }
        this.newLikedPosts = this.removeLikedPosts = [];
      }
    }
  },
  components: { goPostVue },
};
</script>

<style scoped>
.login-nav {
  display: flex;
}

.login-nav h6 {
  margin-left: 20px;
  cursor: pointer;
}
</style>
