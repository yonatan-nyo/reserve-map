<script>
import { RouterLink, RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import { mapActions, mapState } from "pinia";
import { useMainStore } from "./stores";
import Login from "./components/Login.vue";

export default {
  name: "App",
  data() {
    return {
      isOpenLogin: false,
    };
  },
  computed: {
    ...mapState(useMainStore, ["user"]),
  },
  methods: {
    ...mapActions(useMainStore, ["showLogin", "fetchUserInfo", "initializeGeolocation"]),
    showLogin(bool) {
      this.isOpenLogin = bool;
    },
  },
  async created() {
    await this.fetchUserInfo();
    await this.initializeGeolocation();
  },
  components: { Navbar, Login },
};
</script>

<template>
  <header class="flex w-full items-center">
    <div class="bg-[#3655f2] h-[3.6rem] aspect-square flex flex-col justify-center items-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-6 h-6 mb-1">
        <path
          fill-rule="evenodd"
          d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z"
          clip-rule="evenodd" />
      </svg>
    </div>
    <Navbar />
    <a class="flex bg-slate-100 hover:bg-slate-300 rounded-full h-10 pl-2 items-center" @click.prevent="showLogin(true)">
      <div class="hidden sm:block">
        {{ user?.username ? user?.username : "Login" }}
      </div>
      <div class="sm:hidden">User</div>
      <img
        :src="user?.imgUrl ? user?.imgUrl : '/images/defaultProfile.webp'"
        alt=""
        class="w-[2.5rem] h-[2.5rem] m-0.5 rounded-full border-slate-300 border-2 object-cover" />
    </a>
    <Login v-if="isOpenLogin" @showLogin="showLogin" />
  </header>
  <main class="mx-auto max-w-[1240px] py-8 px-3">
    <RouterView />
  </main>
</template>

<style scoped>
header {
  background-color: #ffffff;
}
* {
  user-select: none;
}
</style>
