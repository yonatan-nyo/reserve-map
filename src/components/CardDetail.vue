<template>
  <div id="card" class="w-full h-220px m-2 overflow-scroll">
    <div class="p-4 flex w-full h-full space-x-4">
      <img
        :src="spot.imageSrc || defaultPngSrc"
        alt=""
        class="h-full w-24 sm:w-48 aspect-square rounded-lg object-cover"
        @error="handleImageError" />
      <div class="w-full flex flex-col justify-between pr-2">
        <div>
          <p class="font-bold text-2xl">{{ spot.name ? spot.name : "Spot Name" }}</p>
          <p>status : {{ spot.isFull ? "Full" : "Not Full" }}</p>
          <p>Type : {{ spot.isRestaurant ? "Restaurant" : spot.isCafe ? "Cafe" : spot.isPark ? "Park" : "Unknown" }}</p>
          <p>Contact Info :</p>
          <a
            v-if="spot.email"
            class="flex space-x-2 pt-2"
            :href="`https://mail.google.com/mail/?view=cm&fs=1&to=${spot.email}&su=Contact Nongkuy`"
            target="_blank">
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
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <p class="pb-0.5">{{ spot.email }}</p>
          </a>
        </div>
        <button class="request" type="button" @click.prevent="book(10000, spot.id)">Book</button>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
const BASE_URL = "https://rt-server.tugas.site";

export default {
  name: "CardDetail",
  props: ["spot"],
  data() {
    return {
      defaultPngSrc: this.spot.isRestaurant
        ? "/images/restaurant.png"
        : this.spot.isCafe
        ? "/images/cafe.png"
        : this.spot.isPark
        ? "/images/park.png"
        : "/images/restaurant.png",
      openBook: false,
    };
  },
  methods: {
    handleImageError(event) {
      event.target.src = this.defaultPngSrc;
    },
    changeOpenBook(bool) {
      if (bool) this.openBook = bool;
      this.openBook = !this.openBook;
    },
    async book(gross_amount, spotId) {
      try {
        if (!spotId) throw { response: { data: { errors: "Please Choose Spot First" } } };
        const { data } = await axios({
          url: BASE_URL + "/midtrans-token/" + spotId,
          method: "POST",
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
          data: { gross_amount },
        });
        const { token, transactionDetail } = data;
        window.snap.pay(token, {
          onSuccess: async function (result) {
            /* You may add your own implementation here postbook */
            const { data } = await axios({
              url: BASE_URL + "/postbook",
              method: "POST",
              headers: {
                access_token: localStorage.getItem("access_token"),
              },
              data: { transactionDetail },
            });
            Swal.fire({
              icon: "success",
              title: "Payment Succeed",
            });
            console.log(result);
          },
          onPending: function (result) {
            console.log(result);
          },
          onError: function (result) {
            /* You may add your own implementation here */
            Swal.fire({
              icon: "error",
              title: "payment failed!",
            });
            console.log(result);
          },
          onClose: function () {
            /* You may add your own implementation here */
            Swal.fire({
              icon: "info",
              title: "You closed the popup without finishing the payment!",
            });
          },
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: error.response.data.errors,
        });
      }
    },
  },
  watch: {
    spot(cur, old) {
      if (cur !== old) {
        this.defaultPngSrc = this.spot.isRestaurant
          ? "/images/restaurant.png"
          : this.spot.isCafe
          ? "/images/cafe.png"
          : this.spot.isPark
          ? "/images/park.png"
          : "/images/restaurant.png";
      }
    },
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
#card {
  background: linear-gradient(45deg, #748dfb, #3859e8);
  color: white;
}
.request {
  margin-top: 1.5rem;
  width: 100%;
  border: 2px solid #b2c0ff;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3rem;
  transition: all 0.3s ease;
  background-color: rgb(255, 255, 255);
  color: rgb(44, 86, 214);
}

.request:hover {
  background: linear-gradient(45deg, #dfe5ff, #a1b0f3);
  color: #fff;
}
</style>
