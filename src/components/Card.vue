<template>
  <div
    id="card"
    class="w-[90%] sm:w-[46%] h-[120px] overflow-y-scroll bg-white m-2 border-2 border-slate-300"
    @click.prevent="openDetail(spot)">
    <div class="p-4 flex flex-col justify-between h-full">
      <p class="text-xl font-bold">{{ spot.name }}</p>
      <p>{{ spot.isRestaurant ? "Restaurant" : spot.isCafe ? "Cafe" : spot.isPark ? "Park" : "Unknown" }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useMainStore } from "../stores";

export default {
  name: "Card",
  props: ["spot"],
  methods: {
    ...mapActions(useMainStore, ["openDetail"]),
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
#card:hover {
  background-color: #e0e9ff;
}
</style>
