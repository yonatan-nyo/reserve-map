import { defineStore } from "pinia";

import Swal from "sweetalert2";

import axios from "axios";
// const baseUrl = "http://localhost:3000";
const baseUrl = "https://rt-server.tugas.site";

export const useMainStore = defineStore("main", {
  state: () => ({
    count: 0,
    spots: ["a"],
    name: "Eduardo",
    spotDetail: {},
    toCoordinates: [],
    histories: [],
    isLoggedIn: localStorage.getItem("access_token") ? 1 : 0,
    user: {},
    mapStyle: "light",
    location: "",
    coordinates: [0, 0],
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    getCurrentPosition() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    },
    setPosition(position) {
      this.coordinates[0] = position.coords.longitude;
      this.coordinates[1] = position.coords.latitude;
    },
    handleGeolocationError(error) {
      console.log("Geolocation error:", error);
      Swal.fire({
        icon: "error",
        title: error,
      });
    },
    async initializeGeolocation() {
      try {
        const position = await this.getCurrentPosition();
        this.setPosition(position);
      } catch (error) {
        this.handleGeolocationError(error);
      }
    },
    async fetchSpots(typeId) {
      try {
        this.spots = [];
        const { data } = await axios({
          url: baseUrl + "/spots?typeId=" + typeId,
          method: "GET",
        });
        this.spots = data;
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: error.response.data.errors,
        });
      }
    },
    async openDetail(spot) {
      try {
        this.spotDetail = {};
        this.spotDetail = spot;
        this.toCoordinates = [spot.lng, spot.lat];
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: error.response.data.errors,
        });
      }
    },
    async fetchHistories() {
      try {
        this.histories = [];
        if (!this.isLoggedIn) return;
        const { data } = await axios({
          url: baseUrl + "/users/history",
          method: "GET",
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
        });
        this.histories = data;
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: error.response.data.errors,
        });
      }
    },
    async githubSignIn(obj) {
      try {
        const { data } = await axios({
          url: baseUrl + "/users/github-signin",
          method: "POST",
          data: obj,
        });
        console.log(data.user);
        this.user = data.user;
        localStorage.setItem("access_token", data.access_token);
        this.isLoggedIn = true;
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: error.response.data.errors,
        });
      }
    },
    async logout() {
      localStorage.clear();
      this.user = {};
      this.histories = [];
      this.isLoggedIn = false;
      this.router.push("/");
    },
    async getWeather() {
      try {
        const { data } = await axios({
          url: baseUrl + "/weather",
          method: "POST",
          data: { lat: this.coordinates[1], lng: this.coordinates[0] },
        });
        if (data === "Rain" || data === "Clouds" || data === "Mist") this.mapStyle = "dark";
        //
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: error.response.data.errors,
        });
      }
    },
    async fetchUserInfo() {
      try {
        this.user = {};
        if (!this.isLoggedIn) return;
        const { data } = await axios({
          url: baseUrl + "/users/profile",
          method: "GET",
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
        });
        this.user = data;
      } catch (error) {
        this.logout();
        this.user = {};
        console.log(error);
        Swal.fire({
          icon: "error",
          title: error.response.data.errors,
        });
      }
    },
    async getLocation() {
      try {
        this.location = "";
        const { data } = await axios({
          url: baseUrl + "/users/location",
          method: "POST",
          data: { lat: this.coordinates[1], lng: this.coordinates[0] },
        });
        this.location = data;
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: error.response.data.errors,
        });
      }
    },
    async editProfile(fd) {
      try {
        const { data } = await axios({
          url: baseUrl + "/users/profile/edit",
          method: "PUT",
          headers: {
            "content-type": "multipart/form-data",
            access_token: localStorage.getItem("access_token"),
          },
          data: fd,
        });
        Swal.fire("Success edit profile", "", "success");
        await this.fetchUserInfo();
        this.router.push("/profile");
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: error.response.data.errors,
        });
      }
    },
    async deleteAccount() {
      try {
        const result = await Swal.fire({
          title: "Are you sure to delete your account?",
          showDenyButton: true,
          confirmButtonText: "Delete",
          denyButtonText: `Cancel`,
        });
        if (result.isConfirmed) {
          const { data } = await axios({
            url: baseUrl + "/users",
            method: "DELETE",
            headers: {
              access_token: localStorage.getItem("access_token"),
            },
          });
          Swal.fire(data.message, "", "success");
          this.logout();
          this.user = {};
        } else if (result.isDenied) {
          Swal.fire("Cancelled", "", "error");
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: error.response.data.errors,
        });
      }
    },
  },
});
