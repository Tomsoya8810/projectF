<template>
  <LandingVue v-if="!logStatus" />
  <div v-else class="home">
    <div class="mypage-nav">
      <div class="mypage-nav-button button" @:click="post">
        <h4>Post</h4>
        <h5>悩みの投稿</h5>
      </div>
      <div class="mypage-nav-button button" @:click.once="goLog" @click="log">
        <h4>Log</h4>
        <h5>投稿履歴</h5>
      </div>
      <div
        class="mypage-nav-button button"
        @:click.once="goRank"
        @:click="rank"
      >
        <h4>Mydata</h4>
        <h5>あなたの情報</h5>
      </div>
      <div
        class="mypage-nav-button button"
        @:click.once="goReview"
        @click="review"
      >
        <h4>Review</h4>
        <h5>他の人の悩み</h5>
      </div>
      <div class="signout-button button" @click="signOut">
        <div>×</div>
        <h5>SignOut</h5>
      </div>
    </div>
    <div class="question-button">
      <questionButtonView />
    </div>
    <div class="page-contents">
      <goPostVue :style="{ display: isPostShow }" />
      <div :style="{ display: isLogShow }">
        <div class="title-box">
          <h1 class="title">Log</h1>
        </div>
        <div id="mine"></div>
      </div>
      <div :style="{ display: isRankShow }" class="mydata">
        <div class="title-box">
          <h1 class="title">Mydata</h1>
        </div>
        <div class="mydata-box">
          <div class="profile-area">
            <div class="profile-area-head">
              <h3>Profile</h3>
              <h4>プロフィール</h4>
              <div class="edit-button button" @:click="edit">
                <div class="button-in-box">
                  <h4>編 集</h4>
                  <h6>E d i t</h6>
                </div>
              </div>
            </div>
            <div class="profile-area-content">
              <div class="profile-name-box">
                <h3>Name</h3>
                <input type="text" class="name-input" v-model="nameInput" />
              </div>
            </div>
          </div>
          <div class="rank-area">
            <div class="rank-area-head">
              <h3>Rank</h3>
              <h4>ランク情報</h4>
            </div>
            <div class="rank-area-content">
              <h3>共感{{ rankPoints }}ゲット！！</h3>
              <div class="rank-show-box">
                <h4>あなたのランクは<br />{{ grade }}<br />です</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div :style="{ display: isReviewShow }" class="review">
        <div class="title-box">
          <h1 class="title">Review</h1>
        </div>
        <div class="follow-or-all button" @click="onlyFollow">
          <h4 class="follow" id="is-follow-text">
            フォローユーザーの<br />投稿のみを見る
          </h4>
        </div>
        <div id="other"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "@firebase/auth";
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
import LandingVue from "@/components/Landing.vue";
import questionButtonView from "@/components/questionButton.vue";

export default {
  name: "HomeView",
  data() {
    return {
      logStatus: false,
      syutoku: [],
      syutokuOther: [],
      myPostData: [],
      otherPostData: [],
      myPostDataCount: 0,
      otherPostDataCount: 0,
      otherCard: "",
      newFollowUsers: [],
      removeFollowUsers: [],
      alreadyFollowUsers: [],
      alreadyLikedPosts: [],
      newLikedPosts: [],
      removeLikedPosts: [],
      nameInput: "",
      rankPoints: 0,
      rankSyutoku: 0,
      grade: "",
      isPostShow: "block",
      isLogShow: "none",
      isRankShow: "none",
      isReviewShow: "none",
      unmountedOnce: true,
      isOnlyFollow: false,
      changeLikeAndFollow: function () {
        if (
          this.logStatus === true &&
          (this.newLikedPosts.length !== 0 ||
            this.removeLikedPosts.length !== 0 ||
            this.newFollowUsers.length !== 0 ||
            this.removeFollowUsers.length !== 0)
        ) {
          const auth = getAuth();
          const docRef = doc(db, "users", auth.currentUser.uid);
          if (this.newLikedPosts.length !== 0) {
            this.newLikedPosts.forEach((e) => {
              updateDoc(docRef, {
                likedPosts: arrayUnion(e),
              });
              const countRef = doc(db, "posts", `post${e}`);
              updateDoc(countRef, {
                likedCount: increment(1),
              });
              this.alreadyLikedPosts.push(e);
            });
          }
          if (this.removeLikedPosts.length !== 0) {
            this.removeLikedPosts.forEach((e) => {
              updateDoc(docRef, {
                likedPosts: arrayRemove(e),
              });
              const countRef = doc(db, "posts", `post${e}`);
              updateDoc(countRef, {
                likedCount: increment(-1),
              });
              this.alreadyLikedPosts = this.alreadyLikedPosts.filter((ele) => {
                return ele !== e;
              });
            });
          }
          if (this.newFollowUsers.length !== 0) {
            this.newFollowUsers.forEach((e) => {
              updateDoc(docRef, {
                followUsers: arrayUnion(e),
              });
            });
          }
          if (this.removeFollowUsers.length !== 0) {
            this.removeFollowUsers.forEach((e) => {
              updateDoc(docRef, {
                followUsers: arrayRemove(e),
              });
            });
          }
          this.newLikedPosts = [];
          this.removeLikedPosts = [];
          this.newFollowUsers = [];
          this.removeFollowUsers = [];
        }
      },
    };
  },
  methods: {
    post() {
      this.isLogShow = this.isRankShow = this.isReviewShow = "none";
      this.isPostShow = "block";
      this.changeLikeAndFollow();
    },
    log() {
      this.isPostShow = this.isRankShow = this.isReviewShow = "none";
      this.isLogShow = "block";
      this.changeLikeAndFollow();
    },
    async goLog() {
      const mine = document.querySelector("#mine");
      const auth = getAuth();
      const q = query(
        collection(db, "posts"),
        where("uid", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((e) => {
        this.syutoku.unshift(e.data());
        this.myPostData.push({
          content: this.syutoku[0].content,
          index: this.syutoku[0].index,
          title: this.syutoku[0].title,
          likedCount: this.syutoku[0].likedCount,
          date: this.syutoku[0].date,
        });
      });
      for (let n = 0; n <= this.syutoku.length - 1; n++) {
        const postDate = new Date(this.myPostData[n].date);
        const postCard = document.createElement("div");
        postCard.classList.add("post-box");
        // title
        const titleArea = document.createElement("div");
        const TitleInEnglish = document.createElement("h3");
        const TitleInJapanese = document.createElement("h4");
        const postTitle = document.createElement("h5");
        titleArea.classList.add("title-area");
        postTitle.classList.add("post-title");
        TitleInEnglish.textContent = "Title";
        TitleInJapanese.textContent = "タイトル";
        postTitle.textContent = this.myPostData[n].title;
        titleArea.append(TitleInEnglish, TitleInJapanese, postTitle);

        //content
        const contentArea = document.createElement("div");
        const contentInEnglish = document.createElement("h3");
        const contentInJapanese = document.createElement("h4");
        const postContent = document.createElement("h5");
        contentArea.classList.add("content-area");
        postContent.classList.add("content");
        contentInEnglish.textContent = "Content";
        contentInJapanese.textContent = "本文";
        postContent.textContent = this.myPostData[n].content;
        contentArea.append(contentInEnglish, contentInJapanese, postContent);
        contentArea.style.display = "none";

        //other
        const otherArea = document.createElement("div");
        otherArea.classList.add("other-area");
        const deleteAndTime = document.createElement("div");
        deleteAndTime.classList.add("delete-and-time");
        //deleteButton
        const deleteButton = document.createElement("div");
        const buttonInBoxForDelete = document.createElement("div");
        const deleteInJapanese = document.createElement("h4");
        const deleteInEnglish = document.createElement("h6");
        deleteButton.onclick = async function () {
          await deleteDoc(doc(db, "posts", `post${this.myPostData[n].index}`));
          postCard.remove();
        }.bind(this);
        deleteButton.classList.add("delete-button", "button");
        buttonInBoxForDelete.classList.add("button-in-box");
        deleteInEnglish.textContent = "Delete";
        deleteInJapanese.textContent = "削除";
        buttonInBoxForDelete.append(deleteInJapanese, deleteInEnglish);
        deleteButton.append(buttonInBoxForDelete);
        deleteButton.style.display = "none";

        //timestamp
        const timeStamp = document.createElement("h4");
        timeStamp.textContent = `${postDate.getFullYear()}/${
          postDate.getMonth() + 1
        }/${postDate.getDate()}`;
        timeStamp.classList.add("time");
        deleteAndTime.append(deleteButton, timeStamp);

        //openCloseButton
        const openCloseButton = document.createElement("div");
        const buttonInBoxForOC = document.createElement("div");
        const openCloseInJapanese = document.createElement("h3");
        const openCloseInEnglish = document.createElement("h5");
        openCloseButton.classList.add("open-close-button", "button");
        buttonInBoxForOC.classList.add("button-in-box-foroc");
        openCloseInEnglish.textContent = "Open";
        openCloseInJapanese.textContent = "開く";
        let isopened = false;
        openCloseButton.onclick = function () {
          if (isopened === false) {
            contentArea.style.display = deleteButton.style.display = "flex";
            deleteButton.style.flexDirection = "column";
            deleteButton.style.marginBottom = "2vw";
            openCloseInEnglish.textContent = "Close";
            openCloseInJapanese.textContent = "閉じる";
            isopened = true;
          } else {
            contentArea.style.display = deleteButton.style.display = "none";
            openCloseInEnglish.textContent = "Open";
            openCloseInJapanese.textContent = "開く";
            isopened = false;
          }
        };
        buttonInBoxForOC.append(openCloseInJapanese, openCloseInEnglish);
        openCloseButton.append(buttonInBoxForOC);

        //likedcount
        const likedCountArea = document.createElement("div");
        const postLikedCount = document.createElement("h4");
        postLikedCount.textContent = "共感" + this.myPostData[n].likedCount;
        likedCountArea.classList.add("liked-count-area");
        likedCountArea.append(postLikedCount);
        otherArea.append(deleteAndTime, openCloseButton, likedCountArea);
        postCard.append(titleArea, contentArea, otherArea);
        mine.append(postCard);
      }
    },
    rank() {
      this.isPostShow = this.isLogShow = this.isReviewShow = "none";
      this.isRankShow = "block";
      this.page = 3;
      this.changeLikeAndFollow();
    },
    async goRank() {
      const auth = getAuth();
      const ref = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(ref);
      this.rankPoints = docSnap.data().rankPoints;
      this.nameInput = docSnap.data().name;
      if (this.rankPoints <= 1) {
        this.grade = "ブロンズ";
      } else if (this.rankPoints <= 100) {
        this.grade = "シルバー";
      } else {
        this.grade = "ゴールド";
      }
    },
    async edit() {
      const auth = getAuth();
      const ref = doc(db, "users", auth.currentUser.uid);
      await updateDoc(ref, {
        name: this.nameInput,
      });
      this.nameInput = "";
    },
    review() {
      this.isPostShow = this.isLogShow = this.isRankShow = "none";
      this.isReviewShow = "block";
      this.changeLikeAndFollow();
    },
    async goReview() {
      const auth = getAuth();
      const userRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(userRef);
      this.alreadyLikedPosts = docSnap.data().likedPosts;
      this.alreadyFollowUsers = docSnap.data().followUsers;
      const q = query(
        collection(db, "posts"),
        where("uid", "!=", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((e) => {
        this.syutokuOther.unshift(e.data());
        const postData = {
          content: this.syutokuOther[0].content,
          index: this.syutokuOther[0].index,
          title: this.syutokuOther[0].title,
          user: this.syutokuOther[0].user,
          uid: this.syutokuOther[0].uid,
          likedCount: this.syutokuOther[0].likedCount,
          date: this.syutokuOther[0].date,
        };
        let varIsLike = this.alreadyLikedPosts.some((e) => {
          return e == postData.index;
        });
        const postDate = new Date(postData.date);
        const other = document.getElementById("other");
        const postCard = document.createElement("div");
        postCard.classList.add("review-post-box");
        //こ
        //こ
        //か
        //ら
        //コ
        //ピ
        //ー
        // title
        const titleArea = document.createElement("div");
        const TitleInEnglish = document.createElement("h3");
        const TitleInJapanese = document.createElement("h4");
        const postTitle = document.createElement("h5");
        titleArea.classList.add("title-area");
        postTitle.classList.add("post-title");
        TitleInEnglish.textContent = "Title";
        TitleInJapanese.textContent = "タイトル";
        postTitle.textContent = postData.title;
        titleArea.append(TitleInEnglish, TitleInJapanese, postTitle);

        //content
        const contentArea = document.createElement("div");
        const contentInEnglish = document.createElement("h3");
        const contentInJapanese = document.createElement("h4");
        const postContent = document.createElement("h5");
        contentArea.classList.add("content-area");
        postContent.classList.add("content");
        contentInEnglish.textContent = "Content";
        contentInJapanese.textContent = "本文";
        postContent.textContent = postData.content;
        contentArea.append(contentInEnglish, contentInJapanese, postContent);
        contentArea.style.display = "none";

        //other
        const otherArea = document.createElement("div");
        otherArea.classList.add("other-area");
        const followAndTime = document.createElement("div");
        followAndTime.classList.add("follow-and-time");
        const followArea = document.createElement("div");
        followArea.classList.add("follow-area");
        //user
        const postUser = document.createElement("h4");
        postUser.textContent = postData.user + "さん";
        postUser.classList.add("post-user");

        //followButton
        // const followButton = document.createElement("div");
        // const followInJapanese = document.createElement("h4");
        // const followInEnglish = document.createElement("h6");
        // followButton.classList.add("follow-button", "button");
        // followInEnglish.textContent = "follow";
        // followInJapanese.textContent = "フォロー";
        // followButton.append(followInJapanese, followInEnglish);
        // followButton.style.display = "none";
        const followButton = document.createElement("div");
        const buttonInBoxForFollow = document.createElement("div");
        const followInJapanese = document.createElement("h4");
        const followInEnglish = document.createElement("h6");
        buttonInBoxForFollow.classList.add("button-in-box");
        followButton.classList.add("follow-button", "button");
        buttonInBoxForFollow.append(followInJapanese, followInEnglish);
        followButton.append(buttonInBoxForFollow);
        let isFollow = this.alreadyFollowUsers.some((e) => {
          return e == postData.user;
        });
        if (isFollow === true) {
          postUser.style.color = "#ff0000";
          followInEnglish.textContent = "Unfollow";
          followInJapanese.textContent = "フォロー解除";
        } else {
          followInEnglish.textContent = "Follow";
          followInJapanese.textContent = "フォロー";
        }
        followButton.onclick = function () {
          isFollow = !isFollow;
          if (isFollow == true) {
            postUser.style.color = "#ff0000";
            followInEnglish.textContent = "Unfollow";
            followInJapanese.textContent = "フォロー解除";
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
            followInEnglish.textContent = "Follow";
            followInJapanese.textContent = "フォローする";
            postUser.style.color = "#ffffff";
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
        followButton.style.display = "none";

        //deleteButton
        // const deleteButton = document.createElement("div");
        // const deleteInJapanese = document.createElement("h4");
        // const deleteInEnglish = document.createElement("h6");
        // deleteButton.onclick = async function () {
        //   await deleteDoc(doc(db, "posts", `post${postData.index}`));
        // }.bind(this);
        // deleteButton.classList.add("delete-button", "button");
        // deleteInEnglish.textContent = "Delete";
        // deleteInJapanese.textContent = "削除";
        // deleteButton.append(deleteInJapanese, deleteInEnglish);
        // deleteButton.style.display = "none";
        //timestamp
        const timeStamp = document.createElement("h4");
        timeStamp.textContent = `${postDate.getFullYear()}/${
          postDate.getMonth() + 1
        }/${postDate.getDate()}`;
        timeStamp.classList.add("time");

        followArea.append(postUser, followButton);
        followAndTime.append(followArea, timeStamp);

        //openCloseButton
        const openCloseButton = document.createElement("div");
        const buttonInBoxForOC = document.createElement("div");
        const openCloseInJapanese = document.createElement("h3");
        const openCloseInEnglish = document.createElement("h5");
        buttonInBoxForOC.classList.add("button-in-box-foroc");
        openCloseButton.classList.add("open-close-button", "button");
        openCloseInEnglish.textContent = "Open";
        openCloseInJapanese.textContent = "開く";
        let isopened = false;
        openCloseButton.onclick = function () {
          if (isopened === false) {
            contentArea.style.display = followButton.style.display = "flex";
            openCloseInEnglish.textContent = "Close";
            openCloseInJapanese.textContent = "閉じる";
            isopened = true;
          } else {
            contentArea.style.display = followButton.style.display = "none";
            openCloseInEnglish.textContent = "Open";
            openCloseInJapanese.textContent = "開く";
            isopened = false;
          }
        };
        buttonInBoxForOC.append(openCloseInJapanese, openCloseInEnglish);
        openCloseButton.append(buttonInBoxForOC);

        //likedcount
        const likedCountArea = document.createElement("div");
        const postLikedCount = document.createElement("h4");
        postLikedCount.textContent = postData.likedCount;
        likedCountArea.classList.add("liked-count-area");
        likedCountArea.append(postLikedCount);

        //likeButton
        const likeButton = document.createElement("div");
        likeButton.textContent = "共感";
        if (varIsLike === true) {
          likeButton.style.color = "#ff0000";
        }

        //likearea
        const likeArea = document.createElement("div");
        likeArea.classList.add("like-area", "button");
        likeArea.onclick = function () {
          varIsLike = !varIsLike;
          if (varIsLike === true) {
            likeButton.style.color = "#ff0000";
            postLikedCount.textContent = Number(postLikedCount.textContent) + 1;
            if (
              this.alreadyLikedPosts.some((e) => {
                return e == postData.index;
              })
            ) {
              this.removeLikedPosts = this.removeLikedPosts.filter((e) => {
                return e !== postData.index;
              });
            } else {
              this.newLikedPosts.push(postData.index);
            }
          } else {
            postLikedCount.textContent = Number(postLikedCount.textContent) - 1;
            likeButton.style.color = "#ffffff";
            if (
              this.alreadyLikedPosts.some((e) => {
                return e == postData.index;
              })
            ) {
              this.removeLikedPosts.push(postData.index);
            } else {
              this.newLikedPosts = this.newLikedPosts.filter((e) => {
                return e !== postData.index;
              });
            }
          }
        }.bind(this);

        likeArea.append(likeButton, likedCountArea);
        otherArea.append(followAndTime, openCloseButton, likeArea);

        //append
        postCard.append(
          titleArea,
          contentArea,
          otherArea
          // deleteButton,
        );
        postCard.classList.add(`${postData.user}`);
        //こ
        //こ
        //ま
        //で
        //コ
        //ピ
        //ー
        other.append(postCard);
      });
    },
    onlyFollow() {
      let posts = document.querySelectorAll(`.review-post-box`);
      const isFollowText = document.querySelector(`#is-follow-text`);
      if (this.isOnlyFollow === false) {
        posts.forEach((e) => {
          if (
            this.alreadyFollowUsers.some((followUserName) => {
              return e.className.includes(followUserName);
            })
          ) {
            e.style.display = "flex";
          } else {
            e.style.display = "none";
          }
        });
        this.isOnlyFollow = !this.isOnlyFollow;
        isFollowText.textContent = "全ての投稿を見る";
      } else {
        posts.forEach((e) => {
          e.style.display = "flex";
        });
        this.isOnlyFollow = !this.isOnlyFollow;
        isFollowText.innerText = `フォローユーザーの\n投稿のみを見る`;
      }
    },
    signOut() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          alert("サインアウト");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.logStatus = true;
      } else {
        this.logStatus = false;
      }
    });
  },
  async unmounted() {
    this.changeLikeAndFollow();
    const auth = getAuth();
    const docRef = doc(db, "users", auth.currentUser.uid);
    const q = query(
      collection(db, "posts"),
      where("user", "==", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((e) => {
      this.rankSyutoku = this.rankSyutoku + e.data().likedCount;
    });
    updateDoc(docRef, {
      rankPoints: this.rankSyutoku,
    });
    this.unmountedOnce === false;
  },
  components: { questionButtonView, goPostVue, LandingVue },
};
</script>

<style>
.home {
  background-color: #a7bbd2;
}

.button:hover {
  transform: scale(1.1);
  transition-duration: 0.3s;
  cursor: pointer;
}

.mypage-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 18vh;
  width: 100vw;
  background-color: #a9a9a9;
  box-shadow: 0 0.5vh 0.5vh 0 #555555;
  position: fixed;
  top: 0;
  z-index: 10;
}
.mypage-nav-button {
  border: #fff solid 1px;
  height: 14vh;
  width: 15vw;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.mypage-nav-button h4,
.mypage-nav-button h5 {
  display: inline-block;
  margin: 0;
}
.mypage-nav-button h4 {
  font-size: calc(3vh + 1vw);
  line-height: 3vh;
  margin-top: 0.5vh;
  letter-spacing: 0.05vw;
}
.mypage-nav-button h5 {
  font-size: calc(1vh + 1vw);
  letter-spacing: 0.3vw;
  line-height: 2vh;
}
.mypage-nav-button h4::after {
  content: "";
  display: inline-block;
  background-color: #fff;
  width: 13vw;
  height: 1px;
}

.signout-button {
  display: block;
  color: #fff;
  width: 10vw;
  height: 10vh;
  text-decoration: none;
  color: #ff6c6c;
}
.signout-button div {
  width: 6vh;
  height: 6vh;
  margin-left: auto;
  margin-right: auto;
  border: solid #ff6c6c 1px;
  border-radius: 50%;
  font-size: 5.1vh;
}
.signout-button h5 {
  margin: 0;
}

.question-button {
  position: fixed;
  top: 20vh;
  right: 10px;
  z-index: 10;
}

.page-contents {
  margin-top: 18vh;
  padding-top: 2vh;
  min-height: 80vh;
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

.post-box,
.review-post-box {
  border: #fff solid 2px;
  display: flex;
  flex-direction: column;
  width: 80vw;
  margin-left: auto;
  margin-right: auto;
  border-radius: 5vh;
  margin-top: 10vh;
  box-shadow: #3c3c3c 5px 5px 5px;
}
.post-box h3,
.post-box h4,
.post-box h6 {
  display: block;
}

.title-area,
.content-area,
.other-area {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  width: 70vw;
  margin: 3vw;
}
.title-area::after,
.content-area::after {
  content: "";
  display: block;
  background-color: #fff;
  width: 70vw;
  height: 0.2vw;
  position: absolute;
  top: calc(100% + 3vw);
}
.title-area h3,
.content-area h3 {
  margin-left: 5vw;
  font-size: calc(3vw + 3vh);
  position: relative;
  letter-spacing: 0.2vw;
}
.title-area h3::after,
.content-area h3::after {
  content: "";
  display: block;
  background-color: #fff;
  width: 0.3vw;
  height: calc(3vw + 3vh);
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  top: 0;
  left: calc(100% + 2vw);
}
.title-area h4,
.content-area h4 {
  font-size: calc(1.2vw + 1.2vh);
  margin-left: 5vw;
  letter-spacing: 1.5vw;
}
.title-area h5 {
  margin-left: 5vw;
  font-size: 4vh;
  height: 5vh;
}
.content-area h5 {
  margin-left: 5vw;
  width: 25vw;
  text-align: left;
}

.other-area {
  justify-content: space-around;
  height: 10vh;
}
.time {
  font-size: 2vh;
}

.delete-button {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 14vh;
  height: 9vh;
  background-color: #3c3c3c;
  color: #fff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1.5vh;
  padding: 0.5vh;
  border-radius: 2vh;
}
.delete-button h4 {
  display: inline-block;
  margin: 0;
  margin-top: 1vh;
  font-size: 2vh;
  line-height: 1.25vh;
}
.delete-button h4::after {
  content: "";
  display: inline-block;
  background-color: #fff;
  width: 10vh;
  height: 1px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0vh;
}
.delete-button h6 {
  display: inline-block;
  margin: 0;
  margin-bottom: 1vh;
  font-size: 1.25vh;
  letter-spacing: 0.1em;
}
.button-in-box {
  border: #fff solid 1px;
  border-radius: 1.8vh;
}

.open-close-button {
  flex-direction: column;
  justify-content: space-around;
  width: 30vh;
  height: 8vh;
  background-color: #3c3c3c;
  color: #fff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2.4vh;
  padding: 1.6vh;
  z-index: 3;
  border-radius: 2vh;
}
.open-close-button h3 {
  display: inline-block;
  margin-left: 2vh;
  font-size: 3vh;
  position: relative;
}
.open-close-button h3::after {
  content: "";
  display: inline-block;
  background-color: #fff;
  width: 1px;
  height: 4vh;
  position: absolute;
  left: calc(100% + 3vh);
  top: 0;
}
.open-close-button h5 {
  display: inline-block;
  margin: 0;
  margin-left: 6vh;
  font-size: 2vh;
  letter-spacing: 1vh;
}
.button-in-box-foroc {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: #fff solid 1px;
  border-radius: 1.8vh;
  height: 7.2vh;
}

/* ここからreview */
.post-user {
  font-size: 1vw;
  width: 10vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.follow-button {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 14vh;
  height: 9vh;
  background-color: #3c3c3c;
  color: #fff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1.5vh;
  padding: 0.5vh;
  border-radius: 2vh;
}
.follow-button h4 {
  display: inline-block;
  margin: 0;
  margin-top: 1vh;
  font-size: 2vh;
  line-height: 1.25vh;
}
.follow-button h4::after {
  content: "";
  display: inline-block;
  background-color: #fff;
  width: 10vh;
  height: 1px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0vh;
}
.follow-button h6 {
  display: inline-block;
  margin: 0;
  margin-bottom: 1vh;
  font-size: 1.25vh;
  letter-spacing: 0.1em;
}
.button-in-box-for-follow {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: #fff solid 1px;
  border-radius: 1.8vh;
  height: 7.2vh;
}
.follow-area {
  display: flex;
  align-items: center;
}
.like-area {
  border: #fff solid 1px;
  border-radius: 1vh;
  padding: 2vh;
}

/* ここからmydata */
.mydata {
  height: 76vh;
}
.mydata-box {
  height: 55vh;
  margin: 5.7vh auto 0 auto;
  width: 80vw;
  border: white solid 2px;
  border-radius: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.profile-area h3,
.profile-area h4,
.profile-area h6,
.profile-area input {
  display: block;
}
.profile-area,
.profile-name-box,
.profile-message-box,
.rank-area {
  display: flex;
  justify-content: flex-start;
}
.profile-area-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.profile-area {
  height: 35vh;
  position: relative;
}
.profile-area::after {
  content: "";
  display: block;
  background-color: #fff;
  width: 70vw;
  height: 0.2vh;
  position: absolute;
  left: 5vh;
  top: calc(100% + 1vw);
}
.profile-area-head,
.rank-area-head {
  margin-top: 5vh;
  margin-left: 5vh;
  position: relative;
}
.profile-area-content,
.rank-area-content {
  margin-top: 5vh;
  margin-right: 5vh;
  margin-left: 10vh;
}
.profile-area-head h3,
.rank-area-head h3 {
  font-size: 4vw;
}
.profile-area-head h3::after,
.rank-area-head h3::after {
  content: "";
  display: block;
  background-color: #fff;
  width: 12vw;
  height: 0.2vh;
  margin: 1vh auto 1vh auto;
}
.profile-area-head h4,
.rank-area-head h4 {
  font-size: 1vw;
}
.profile-area-head::after {
  content: "";
  display: block;
  background-color: #fff;
  width: 0.3vw;
  height: calc(25vh);
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  top: 0;
  left: calc(100% + 5vh);
}
.profile-name-box {
  align-items: center;
}

.profile-name-box h3 {
  font-size: 3vw;
  margin-right: 3vw;
}
.name-input {
  width: 25vw;
}
.edit-button {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 14vh;
  height: 9vh;
  background-color: #3c3c3c;
  color: #fff;
  margin-top: 1.5vh;
  margin-left: auto;
  margin-right: auto;
  padding: 0.5vh;
  border-radius: 2vh;
}
.edit-button h4 {
  display: inline-block;
  margin: 0;
  margin-top: 1vh;
  font-size: 2vh;
  line-height: 1.25vh;
}
.edit-button h4::after {
  content: "";
  display: inline-block;
  background-color: #fff;
  width: 10vh;
  height: 1px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0vh;
}
.edit-button h6 {
  display: inline-block;
  margin: 0;
  margin-bottom: 1vh;
  font-size: 1.25vh;
  letter-spacing: 0.1em;
}
.rank-area-head::after {
  content: "";
  display: block;
  background-color: #fff;
  width: 0.3vw;
  height: calc(12vh);
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  top: 0;
  left: calc(100% + 5vh);
}
.rank-area {
  height: 20vh;
  margin-bottom: 5vh;
}
.rank-area-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.rank-area-content h3 {
  display: block;
  font-size: 3vw;
}
.rank-show-box {
  margin-left: 10vw;
  border: #fff solid 1px;
  border-radius: 3vw;
  padding: 1.5vw;
}
.rank-area-content h4 {
  font-size: 2vh;
  text-align: left;
  line-height: 2;
}

.follow-or-all {
  width: 25vw;
  margin-left: 3vw;
  border: #fff solid 1px;
  border-radius: 3vw;
}
.follow {
  font-size: 2vw;
  margin-left: 1vw;
}
</style>
