<template>
  <div
    class="fixed flex flex-col justify-center items-center top-0 left-0 w-screen h-screen bg-black/50 z-[100]"
    @click.prevent="showLogin(false)">
    <div
      class="h-[20rem] w-[20rem] sm:w-[30rem] bg-white p-4 mx-auto rounded-2xl z-[101] text-black space-y-3 flex flex-col justify-center items-center"
      @click.stop="">
      <div class="w-full text-center mt-4 mb-20">
        <p class="text-4xl font-bold mb-4">Choose Login Option</p>
        <p v-if="isLoggedIn">Currently Logged In as</p>
        <p v-if="isLoggedIn">{{ user.username }}</p>
      </div>
      <div class="space-y-2">
        <button v-if="!isLoggedIn" @click.prevent="handleSignInGithub" class="mx-auto" id="github">
          Sign in with Github
          <span>
            <svg
              aria-hidden="true"
              class="octicon octicon-mark-github"
              height="28pt"
              version="1.1"
              viewBox="0 0 16 16"
              width="28pt"
              fill="white">
              <path
                fill-rule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </span>
        </button>
        <button v-if="isLoggedIn" class="mx-auto" @click.prevent="handleLogout">
          Logout
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import firebaseConfig from "../../firebaseConfig";
import { signInWithPopup, GithubAuthProvider, TwitterAuthProvider, getAuth } from "firebase/auth";
import { useMainStore } from "../stores";

firebaseConfig;

const providerGithub = new GithubAuthProvider();
const providerTwitter = new TwitterAuthProvider();
const auth = getAuth();

export default {
  name: "Login",
  emits: ["showLogin"],
  methods: {
    ...mapActions(useMainStore, ["githubSignIn", "logout"]),
    showLogin(bool) {
      this.$emit("showLogin", bool);
    },
    async handleSignInGithub() {
      try {
        const result = await signInWithPopup(auth, providerGithub);

        const { email: username, email } = result.user;
        await this.githubSignIn({ username, email });
        this.showLogin(false);
        this.$router.push("/");
      } catch (error) {
        console.log(error);
      }
    },
    async handleLogout() {
      this.logout();
      this.showLogin(false);
    },
    // async handleSignInTwitter() {
    //   try {
    //     const result = await signInWithPopup(auth, providerTwitter);
    //     // const credential = TwitterAuthProvider.credentialFromResult(result);
    //     // console.log(credential);
    //     this.githubSignIn()
    //     console.log(result.user);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
  },
  computed: {
    ...mapState(useMainStore, ["user", "isLoggedIn"]),
  },
};
</script>

<style scoped>
button {
  max-width: 150px;
  display: flex;
  overflow: hidden;
  position: relative;
  padding: 0.875rem 72px 0.875rem 1.75rem;
  background-color: #039be5;
  background-image: linear-gradient(to top right, #e5034e, #f62944);
  color: #ffffff;
  font-size: 15px;
  line-height: 1.25rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  vertical-align: middle;
  align-items: center;
  border-radius: 0.5rem;
  gap: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: none;
  transition: all 0.6s ease;
}

button span {
  background-color: rgb(229, 3, 11);
  display: grid;
  position: absolute;
  right: 0;
  place-items: center;
  width: 3rem;
  height: 100%;
}

button span svg {
  width: 1.5rem;
  height: 1.5rem;
}

button:hover {
  box-shadow: 0 4px 30px rgba(4, 175, 255, 0.1), 0 2px 30px rgba(11, 158, 255, 0.06);
}

button#github {
  max-width: 320px;
  display: flex;
  overflow: hidden;
  position: relative;
  padding: 0.875rem 72px 0.875rem 1.75rem;
  background-color: rgba(88, 101, 242, 1);
  background-image: linear-gradient(to top right, rgb(46, 56, 175), rgb(82, 93, 218));
  color: #ffffff;
  font-size: 15px;
  line-height: 1.25rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  vertical-align: middle;
  align-items: center;
  border-radius: 0.5rem;
  gap: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: none;
  transition: all 0.6s ease;
}

button#github span {
  background-color: rgb(82, 93, 218);
  display: grid;
  position: absolute;
  right: 0;
  place-items: center;
  width: 3rem;
  height: 100%;
}

button#github span svg {
  width: 1.5rem;
  height: 1.5rem;
}

button#github:hover {
  box-shadow: 0 4px 30px rgba(4, 175, 255, 0.1), 0 2px 30px rgba(11, 158, 255, 0.06);
}
</style>
