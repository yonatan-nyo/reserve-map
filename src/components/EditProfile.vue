<template>
  <div
    class="fixed flex flex-col justify-center items-center top-0 left-0 w-screen h-screen bg-black/50 z-[100]"
    @click.prevent="changeEditVisibility(false)">
    <form
      @submit.prevent="handleEditProfile"
      class="h-[40rem] w-[20rem] sm:w-[30rem] bg-white p-6 mx-auto rounded-2xl z-[101] text-black flex flex-col justify-between items-center"
      @click.stop="">
      <div class="w-full">
        <p class="text-3xl font-bold mb-10">Edit Profile</p>
        <div class="group mb-6">
          <input type="text" class="input" v-model="name" />
          <span class="highlight"></span>
          <span class="bar"></span>
          <label>Name</label>
        </div>
        <p class="mt-10 font-bold border-b-2 border-slate-400 mb-2">Profile Picture</p>
        <div id="preview w-full h-40">
          <img v-if="url" :src="url" class="w-full h-40 object-cover" />
        </div>
        <input type="file" name="" id="" @change="onFileChange" />
      </div>
      <button class="button">
        <svg class="svg-icon" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <g stroke="#a649da" stroke-linecap="round" stroke-width="2">
            <path d="m20 20h-16"></path>
            <path
              clip-rule="evenodd"
              d="m14.5858 4.41422c.781-.78105 2.0474-.78105 2.8284 0 .7811.78105.7811 2.04738 0 2.82843l-8.28322 8.28325-3.03046.202.20203-3.0304z"
              fill-rule="evenodd"></path>
          </g>
        </svg>
        <span class="lable mx-auto">Edit</span>
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useMainStore } from "../stores/index";

export default {
  name: "EditProfile",
  emits: ["changeEditVisibility"],
  data() {
    return {
      name: "",
      imageFile: {},
      url: null,
    };
  },
  methods: {
    ...mapActions(useMainStore, ["editProfile"]),
    async handleEditProfile() {
      if (this.name || this.url) {
        const fd = new FormData();
        if (this.url) fd.append("image", this.imageFile, this.imageFile.name);
        if (this.name) fd.append("username", this.name);
        await this.editProfile(fd);
        // await this.editProfile(this.name);
      }
      this.changeEditVisibility(false);
    },
    changeEditVisibility(bool) {
      this.$emit("changeEditVisibility", bool);
    },
    onFileChange(e) {
      this.imageFile = e.target.files[0];
      this.url = URL.createObjectURL(this.imageFile);
    },
  },
};
</script>

<style scoped>
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 12px;
  gap: 2px;
  height: 40px;
  width: 120px;
  border: none;
  background: #a549da3d;
  border-radius: 20px;
  cursor: pointer;
}

.lable {
  line-height: 22px;
  font-size: 19px;
  color: #a649da;
  font-family: sans-serif;
  letter-spacing: 1px;
}

.button:hover {
  background: #a549da62;
}

.button:hover .svg-icon {
  animation: lr 1s linear infinite;
}

@keyframes lr {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-1px);
  }

  75% {
    transform: translateX(1px);
  }

  100% {
    transform: translateX(0);
  }
}
.group {
  position: relative;
}

.input {
  font-size: 16px;
  padding: 10px 10px 10px 5px;
  display: block;
  width: 200px;
  border: none;
  border-bottom: 1px solid #515151;
  background: transparent;
}

.input:focus {
  outline: none;
}

label {
  color: #999;
  font-size: 18px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  top: 10px;
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
}

.input:focus ~ label,
.input:valid ~ label {
  top: -20px;
  font-size: 14px;
  color: #5264ae;
}

.bar {
  position: relative;
  display: block;
  width: 200px;
}

.bar:before,
.bar:after {
  content: "";
  height: 2px;
  width: 0;
  bottom: 1px;
  position: absolute;
  background: #5264ae;
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
}

.bar:before {
  left: 50%;
}

.bar:after {
  right: 50%;
}

.input:focus ~ .bar:before,
.input:focus ~ .bar:after {
  width: 50%;
}

.highlight {
  position: absolute;
  height: 60%;
  width: 100px;
  top: 25%;
  left: 0;
  pointer-events: none;
  opacity: 0.5;
}

.input:focus ~ .highlight {
  animation: inputHighlighter 0.3s ease;
}

@keyframes inputHighlighter {
  from {
    background: #5264ae;
  }

  to {
    width: 0;
    background: transparent;
  }
}
</style>
