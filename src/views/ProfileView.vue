<template>
  <div id="profile-upper">
    <div id="profile-banner-image">
      <img src="/images/profile-background.jpg" class="w-[100vw] h-[40rem] object-cover" alt="Banner image" />
    </div>
    <div id="profile-d">
      <div id="profile-pic">
        <img :src="user?.imgUrl ? user?.imgUrl : '/images/defaultProfile.webp'" />
      </div>
      <div id="u-name" class="flex flex-col space-y-4 items-baseline">
        <p class="hidden md:block">{{ user?.username ? user?.username : "Your Name" }}</p>
        <div class="space-x-3 hidden md:flex" v-if="isLoggedIn">
          <button class="button" @click.prevent="changeEditVisibility(true)">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" height="20" fill="none" class="svg-icon">
              <g stroke-width="1.5" stroke-linecap="round" stroke="#5d41de">
                <circle r="2.5" cy="10" cx="10"></circle>
                <path
                  fill-rule="evenodd"
                  d="m8.39079 2.80235c.53842-1.51424 2.67991-1.51424 3.21831-.00001.3392.95358 1.4284 1.40477 2.3425.97027 1.4514-.68995 2.9657.82427 2.2758 2.27575-.4345.91407.0166 2.00334.9702 2.34248 1.5143.53842 1.5143 2.67996 0 3.21836-.9536.3391-1.4047 1.4284-.9702 2.3425.6899 1.4514-.8244 2.9656-2.2758 2.2757-.9141-.4345-2.0033.0167-2.3425.9703-.5384 1.5142-2.67989 1.5142-3.21831 0-.33914-.9536-1.4284-1.4048-2.34247-.9703-1.45148.6899-2.96571-.8243-2.27575-2.2757.43449-.9141-.01669-2.0034-.97028-2.3425-1.51422-.5384-1.51422-2.67994.00001-3.21836.95358-.33914 1.40476-1.42841.97027-2.34248-.68996-1.45148.82427-2.9657 2.27575-2.27575.91407.4345 2.00333-.01669 2.34247-.97026z"
                  clip-rule="evenodd"></path>
              </g>
            </svg>
            <span class="lable">Edit</span>
          </button>
          <button class="button-red" @click.prevent="deleteAccount">
            <svg class="svg-icon" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg">
              <title></title>
              <path
                d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320"
                style="fill: none; stroke: red; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px"></path>
              <line
                style="stroke: red; stroke-linecap: round; stroke-miterlimit: 10; stroke-width: 32px"
                x1="80"
                x2="432"
                y1="112"
                y2="112"></line>
              <path
                d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40"
                style="fill: none; stroke: red; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px"></path>
              <line
                style="fill: none; stroke: red; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px"
                x1="256"
                x2="256"
                y1="176"
                y2="400"></line>
              <line
                style="fill: none; stroke: red; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px"
                x1="184"
                x2="192"
                y1="176"
                y2="400"></line>
              <line
                style="fill: none; stroke: red; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px"
                x1="328"
                x2="320"
                y1="176"
                y2="400"></line>
            </svg>
            <span class="lable">Delete</span>
          </button>
        </div>
      </div>
    </div>
    <div id="black-grd"></div>
  </div>
  <div id="main-content">
    <p class="md:hidden block font-bold text-3xl mb-2 text-slate-800">{{ user?.username ? user?.username : "Your Name" }}</p>
    <div class="space-x-3 md:hidden flex my-2" v-if="isLoggedIn">
      <button class="button" @click.prevent="changeEditVisibility(true)">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" height="20" fill="none" class="svg-icon">
          <g stroke-width="1.5" stroke-linecap="round" stroke="#5d41de">
            <circle r="2.5" cy="10" cx="10"></circle>
            <path
              fill-rule="evenodd"
              d="m8.39079 2.80235c.53842-1.51424 2.67991-1.51424 3.21831-.00001.3392.95358 1.4284 1.40477 2.3425.97027 1.4514-.68995 2.9657.82427 2.2758 2.27575-.4345.91407.0166 2.00334.9702 2.34248 1.5143.53842 1.5143 2.67996 0 3.21836-.9536.3391-1.4047 1.4284-.9702 2.3425.6899 1.4514-.8244 2.9656-2.2758 2.2757-.9141-.4345-2.0033.0167-2.3425.9703-.5384 1.5142-2.67989 1.5142-3.21831 0-.33914-.9536-1.4284-1.4048-2.34247-.9703-1.45148.6899-2.96571-.8243-2.27575-2.2757.43449-.9141-.01669-2.0034-.97028-2.3425-1.51422-.5384-1.51422-2.67994.00001-3.21836.95358-.33914 1.40476-1.42841.97027-2.34248-.68996-1.45148.82427-2.9657 2.27575-2.27575.91407.4345 2.00333-.01669 2.34247-.97026z"
              clip-rule="evenodd"></path>
          </g>
        </svg>
        <span class="lable">Edit</span>
      </button>
      <button class="button-red" @click.prevent="deleteAccount">
        <svg class="svg-icon" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg">
          <title></title>
          <path
            d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320"
            style="fill: none; stroke: red; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px"></path>
          <line
            style="stroke: red; stroke-linecap: round; stroke-miterlimit: 10; stroke-width: 32px"
            x1="80"
            x2="432"
            y1="112"
            y2="112"></line>
          <path
            d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40"
            style="fill: none; stroke: red; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px"></path>
          <line
            style="fill: none; stroke: red; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px"
            x1="256"
            x2="256"
            y1="176"
            y2="400"></line>
          <line
            style="fill: none; stroke: red; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px"
            x1="184"
            x2="192"
            y1="176"
            y2="400"></line>
          <line
            style="fill: none; stroke: red; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px"
            x1="328"
            x2="320"
            y1="176"
            y2="400"></line>
        </svg>
        <span class="lable">Delete</span>
      </button>
    </div>
    <div class="tb">
      <div class="td" id="l-col">
        <div class="l-cnt">
          <div class="cnt-label">
            <span>Hello, {{ user?.username ? user?.username : "Your Name" }}!</span>
          </div>
          <div id="i-box">
            <div id="intro-line">{{ user?.email ? "Email : " + user.email : "Email : -" }}</div>
            <div>{{ location }}</div>
          </div>
        </div>
      </div>
    </div>
    <EditProfile v-if="isOpenEdit" @changeEditVisibility="changeEditVisibility" />
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useMainStore } from "../stores";
import EditProfile from "../components/EditProfile.vue";

export default {
  name: "ProfileView",
  data() {
    return {
      isOpenEdit: false,
    };
  },
  computed: {
    ...mapState(useMainStore, ["user", "location", "isLoggedIn"]),
  },
  methods: {
    ...mapActions(useMainStore, ["fetchUserInfo", "getLocation", "deleteAccount"]),
    changeEditVisibility(bool) {
      this.isOpenEdit = bool;
    },
  },
  async created() {
    await this.fetchUserInfo();
    await this.getLocation();
  },
  components: { EditProfile },
};
</script>

<style scoped>
.button-red {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  gap: 8px;
  height: 34px;
  width: 112px;
  border: none;
  background: #ff362b34;
  border-radius: 20px;
  cursor: pointer;
}

.button-red .lable {
  line-height: 20px;
  font-size: 17px;
  color: #ff342b;
  font-family: sans-serif;
  letter-spacing: 1px;
}

.button-red:hover {
  background: #ff362b52;
}

.button-red:hover .svg-icon {
  animation: spinb 2s linear infinite;
}

@keyframes spinb {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(-8deg);
  }

  50% {
    transform: rotate(0deg);
  }

  75% {
    transform: rotate(8deg);
  }

  100% {
    transform: rotate(0deg);
  }
}
/*asdads */

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  gap: 8px;
  height: 36px;
  width: 120px;
  border: none;
  background: #5e41de33;
  border-radius: 20px;
  cursor: pointer;
}

.button .lable {
  line-height: 20px;
  font-size: 17px;
  color: #5d41de;
  font-family: sans-serif;
  letter-spacing: 1px;
}

.button:hover {
  background: #5e41de4d;
}

.button:hover .svg-icon {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

input,
button {
  font-family: Helvetica;
}

img {
  display: block;
  width: 100%;
  border: 0;
}

.tb {
  display: table;
  width: 100%;
}

.td {
  display: table-cell;
  vertical-align: middle;
}

a {
  text-decoration: none;
}

button {
  padding: 0;
  border: 0;
  background-color: transparent;
}

::placeholder {
  color: #f1f1f1;
}

main {
  width: 1280px;
  margin: 0 auto;
  background-color: #e9ebee;
  box-shadow: 0px 8px 30px #1d2d4f;
  border-radius: 4px;
  overflow: hidden;
}

#device-bar-1 {
  text-align: right;
  padding: 6px;
  background-color: #000;
  overflow: hidden;
}

#device-bar-1 button {
  width: 15px;
  height: 15px;
  float: left;
  margin: 6px;
  border-radius: 50%;
  cursor: pointer;
}

#device-bar-1 button:first-child {
  background-color: #f35d5b;
}

#device-bar-1 button:nth-child(2) {
  background-color: #f6bd3a;
}

#device-bar-1 button:last-child {
  background-color: #44cc45;
}

/* Profile image header */
#profile-upper {
  position: relative;
}

#profile-d {
  position: absolute;
  left: 59px;
  bottom: 0px;
  right: 0px;
  height: 180px;
  z-index: 2;
}

#profile-banner-image {
  height: 310px;
  overflow: hidden;
  z-index: 1;
}

#profile-banner-image img {
  width: 100%;
  margin-top: -20%;
}

#profile-pic {
  width: 180px;
  height: 180px;
  border-radius: 3px;
  margin-top: 28px;
  overflow: hidden;
  box-shadow: 0 0 0 5px #fff;
}

#profile-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

#u-name {
  position: absolute;
  top: 120px;
  left: 208px;
  color: #fff;
  font-size: 36px;
  font-weight: bold;
}

#m-btns {
  position: absolute;
  right: 56px;
  bottom: 20px;
  width: 211px;
}

#m-btns .td {
  padding: 0 8px;
}

#edit-profile {
  position: absolute;
  right: 20px;
  bottom: 21px;
  line-height: 1;
  cursor: pointer;
}

#edit-profile i {
  display: block;
  color: rgba(255, 255, 255, 0.7);
}

#black-grd {
  position: absolute;
  left: 0px;
  bottom: 0px;
  right: 0px;
  height: 300px;
  background: linear-gradient(rgba(0, 0, 0, 0) 71%, rgba(0, 0, 0, 0.53));
  z-index: 1;
}
/* Profile image header finished */

/* Content area */
#main-content {
  padding: 55px 0px 0px 55px;
}

#l-col,
#m-col,
#r-col {
  vertical-align: top;
}

#l-col {
  width: 340px;
  padding-top: 6px;
}

.l-cnt {
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 3px 3px #ddd;
}

.l-i {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 2px;
  background-size: auto;
  background-repeat: no-repeat;
  vertical-align: middle;
}

#l-i-i {
  background-image: url("https://imagizer.imageshack.com/img922/7749/C8tmwX.png");
  background-position: 0 -87px;
}

#l-i-p {
  background-image: url("https://imagizer.imageshack.com/img923/7847/sRapnM.png");
  background-position: 0 0;
}

#l-i-k {
  background-image: url("https://imagizer.imageshack.com/img922/5617/QpPVKn.png");
}

.cnt-label {
  position: relative;
  padding-right: 24px;
  margin-bottom: 15px;
}

.cnt-label span {
  position: relative;
  top: 2px;
  color: #707070;
  font-size: 18px;
}

.lb-action {
  position: absolute;
  top: 0px;
  right: 0px;
  cursor: pointer;
}

.lb-action i {
  display: block;
  color: #ccc;
  font-size: 18px;
}

#b-i i {
  font-size: 24px;
}

#i-box {
  color: #797979;
  font-size: 14px;
  line-height: 1.3;
}

#intro-line {
  margin-top: 17px;
}

#u-occ {
  margin: 10px 0px;
}

#u-occ a {
  color: #2196f3;
}

#u-loc i {
  color: #2196f3;
  font-size: 16px;
  margin-left: -3px;
  margin-right: 2px;
  margin-top: -1px;
  vertical-align: middle;
}

#u-loc a {
  position: relative;
  top: 1px;
  color: #2196f3;
}

#photos {
  padding: 2px;
  margin: 15px -20px -20px -20px;
}

#photos .td {
  width: 33.333%;
  height: 112px;
  border: 2px solid #fff;
  box-sizing: border-box;
  background-color: #f1f1f1;
  background-position: 50% 25%;
  background-size: cover;
}

#photos .tb .tr:nth-child(1) .td:nth-child(1) {
  background-image: url("https://imagizer.imageshack.com/img922/8637/NN4aPj.jpg");
}

#photos .tb .tr:nth-child(1) .td:nth-child(2) {
  background-image: url("https://imagizer.imageshack.com/img923/528/iJy0X5.jpg");
}

#photos .tb .tr:nth-child(1) .td:nth-child(3) {
  background-image: url("https://imagizer.imageshack.com/img923/9781/26phSy.jpg");
}

#photos .tb .tr:nth-child(2) .td:nth-child(1) {
  background-image: url("https://imagizer.imageshack.com/img921/8417/svxO7y.jpg");
}

#photos .tb .tr:nth-child(2) .td:nth-child(2) {
  background-image: url("https://imagizer.imageshack.com/img921/6488/i2Hb4U.jpg");
}

#photos .tb .tr:nth-child(2) .td:nth-child(3) {
  background-image: url("https://imagizer.imageshack.com/img921/2453/J7PICR.jpg");
}

#photos .tb .tr:nth-child(3) .td:nth-child(1) {
  background-image: url("https://imagizer.imageshack.com/img921/3021/8uZZY2.jpg");
}

#photos .tb .tr:nth-child(3) .td:nth-child(2) {
  background-image: url("https://imagizer.imageshack.com/img923/3992/22mL29.jpg");
}

#photos .tb .tr:nth-child(3) .td:nth-child(3) {
  background-image: url("https://imagizer.imageshack.com/img921/2711/JXSt41.jpg");
}

#k-nm {
  color: #b8b8b8;
  font-size: 15px;
  font-style: normal;
  margin-left: 8px;
  cursor: pointer;
}

.q-ad-c {
  padding: 2px;
}

.q-ad {
  display: block;
  padding: 8px;
  border: 1px solid #eeeeee;
  background-color: #fafafa;
  border-radius: 4px;
}

.q-ad img {
  display: inline;
  width: 24px;
  height: 24px;
  margin-right: 5px;
  vertical-align: middle;
}

.q-ad span {
  position: relative;
  top: 1px;
  color: #242424;
  font-size: 14px;
  text-align: center;
}

#add_q {
  color: #858585;
  text-align: center;
  margin-top: 10px;
  background-color: #fff;
  border-color: #f1f1f1;
}

#add_q i {
  font-size: 17px;
  margin-right: -3px;
  vertical-align: middle;
}

#add_q span {
  color: #858585;
  font-size: 12.4px;
  position: relative;
  top: -1px;
}

#t-box {
  font-size: 14px;
  color: #686868;
  padding-top: 24px;
  line-height: 18px;
}

#t-box a {
  margin-right: 5px;
}

#t-box a,
#t-more {
  color: #999;
}

#t-more {
  cursor: pointer;
}

#t-more i {
  font-size: 15px;
  vertical-align: middle;
}

#cpy-nt {
  margin-top: 4px;
}

#m-col {
  padding: 0px 55px;
}

.m-mrg {
  margin-bottom: 28px;
}

#p-tabs {
  position: relative;
  font-size: 13px;
  color: #919191;
  text-align: center;
  padding: 13px 20px;
  margin-top: -64px;
  background-color: #fff;
  box-shadow: 0px 3px 3px #ddd;
  z-index: 3;
}

#p-tabs-m .td {
  width: 16.6666667%;
  cursor: pointer;
}

#p-tabs-m .td.active {
  color: #ee6000;
}

#p-tabs-m span {
  position: relative;
}

#p-tabs-m .td.active span:after {
  content: "";
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: -13px;
  height: 4px;
  background-color: #ee6000;
}

#p-tabs-m .td i {
  display: block;
  font-size: 24px;
  margin-bottom: 5px;
}

#p-tab-m {
  width: 1px;
  color: #ccc;
  cursor: pointer;
}

#p-tab-m i {
  margin-right: -4px;
}

#composer {
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 3px 3px #ddd;
}

#c-tabs-cvr {
  padding-bottom: 12px;
  border-bottom: 1px solid #ececec;
}

#c-tabs {
  width: auto;
  color: #919191;
}

#c-tabs .td {
  position: relative;
  width: 1px;
  padding: 0px 15px;
  white-space: pre;
  cursor: pointer;
}

#c-tabs .td:after {
  content: "";
  position: absolute;
  top: 50%;
  right: 0px;
  width: 1px;
  height: 12px;
  margin-top: -6px;
  background-color: #eaeaea;
}

#c-tabs .td:first-child {
  padding-left: 0px;
}

#c-tabs .td:last-child {
  padding-right: 0;
}

#c-tabs .td:last-child:after {
  display: none;
}

#c-tabs .td span {
  position: relative;
}

#c-tabs .td.active {
  color: #373737;
}

#c-tabs .td.active span:after {
  content: "";
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: -20px;
  width: 10px;
  height: 10px;
  border: 1px solid transparent;
  border-color: transparent #ececec #ececec transparent;
  margin: 0 auto;
  background-color: #fff;
  transform: rotateZ(45deg);
}

#c-tabs .td i {
  font-size: 21px;
  margin-right: 4px;
  vertical-align: middle;
}

#c-tabs .td span {
  position: relative;
  top: 1px;
  font-size: 15px;
}

#c-c-main {
  position: relative;
  padding-top: 15px;
}

#p-c-i {
  width: 50px;
  border-radius: 50%;
  overflow: hidden;
}

#p-c-i img {
  display: block;
  width: 100%;
}

#c-inp {
  padding-left: 20px;
}

#c-inp input {
  width: 100%;
  font-size: 20px;
  border: 0;
  padding: 0;
  margin: 0;
}

#c-c-main input::placeholder {
  color: #666;
}

#insert_emoji {
  position: absolute;
  right: -2px;
  bottom: -10px;
  cursor: pointer;
}

#insert_emoji i {
  display: block;
  color: #ccced6;
  font-size: 21px;
}

.post {
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 3px 3px #ddd;
}

.p-p-pic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.p-p-pic img {
  width: 100%;
  display: block;
  border: 0;
}

.p-r-hdr {
  vertical-align: top;
  padding-left: 20px;
}

.p-u-info {
  color: #5a5959;
  font-size: 15px;
  margin-bottom: 7px;
}

.p-u-info a {
  color: #4267b2;
}

.p-dt {
  color: #a8a8a8;
  font-size: 13px;
}

.p-dt i {
  font-size: 14px;
  margin-right: 2px;
}

.p-dt span {
  position: relative;
  top: -2px;
}

.p-opt {
  position: relative;
  right: -3px;
  width: 1px;
  color: #ccc;
  cursor: pointer;
  vertical-align: top;
}

.p-cnt-v {
  display: block;
  margin: 20px -20px;
  cursor: pointer;
}

.p-acts {
  overflow: hidden;
}

.p-act {
  width: 24px;
  height: 24px;
  color: #a3a6aa;
  cursor: pointer;
}

.p-act span {
  position: relative;
  top: 1px;
  width: 20px;
  font-size: 15px;
  color: #a3a6aa;
}

.like {
  margin-right: 36px;
}

.like,
.comment {
  width: 50px;
  float: left;
}

.p-act i {
  vertical-align: middle;
}

.like i,
.comment i {
  margin-right: 6px;
}

.share {
  float: right;
  transform: rotateY(180deg);
  margin-right: -1px;
}

#loading {
  text-align: center;
  padding: 40px 0px;
}

#loading i {
  color: #4267b2;
  font-size: 32px;
  display: block;
}
/* Content area finished */

/* Chat bar */
#r-col {
  position: relative;
  width: 150px;
}

#chat-bar {
  position: absolute;
  top: -55px;
  right: 55px;
  bottom: 0px;
  left: 0px;
}

#chat-lb {
  color: #3a5795;
  font-size: 16px;
  text-align: center;
  margin: 23px 0px;
}

#chat-lb i {
  font-size: 18px;
  margin-right: 4px;
  vertical-align: middle;
}

#chat-lb span {
  position: relative;
  top: 2px;
}

.on-ct {
  position: relative;
  width: 50px;
  height: 50px;
  margin: 28px auto 0 auto;
  border-radius: 50%;
}

#cts .on-ct:first-child {
  margin-top: 0px;
}

.on-ct img {
  border-radius: 50%;
}

.on-ct.active:after {
  content: "";
  position: absolute;
  top: 3px;
  right: 2px;
  width: 10px;
  height: 10px;
  background-color: #2ecd18;
  border-radius: 50%;
  box-shadow: 0px 0px 0px 3px #e9ebee;
  z-index: 1;
}

#ct-sett {
  margin-top: 55px;
}

#ct-sett i {
  color: #3a5795;
  padding: 13px;
  background-color: #d8e4ff;
  border-radius: 50%;
  cursor: pointer;
}
/* Chat bar finished */

/* Footer */
#device-bar-2 {
  padding: 9px 0px 13px 0px;
  background-color: #000;
}

#device-bar-2 i {
  display: block;
  width: 40px;
  color: #fff;
  font-size: 40px;
  text-align: center;
  margin: 0 auto;
}
/* Footer finished */
</style>
