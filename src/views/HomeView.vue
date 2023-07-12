<script>
import Card from "../components/Card.vue";
import Mapbox from "../components/Mapbox.vue";
import { mapActions, mapState } from "pinia";
import { useMainStore } from "../stores/index.js";
import CardDetail from "../components/CardDetail.vue";

export default {
  name: "Home",
  data() {
    return {
      clicked: 0,
    };
  },
  computed: {
    ...mapState(useMainStore, ["spots", "spotDetail"]),
  },
  methods: {
    ...mapActions(useMainStore, ["fetchSpots"]),
    async changeClicked(num) {
      this.clicked = num;
      await this.fetchSpots(num);
    },
  },
  async created() {
    await this.fetchSpots();
  },
  components: { Mapbox, Card, CardDetail },
};
</script>

<template>
  <section id="home" class="flex flex-col-reverse lg:flex-row flex-wrap justify-between">
    <div class="lg:w-[49%] w-[98%]">
      <p class="p-2 text-3xl font-bold">Places to go</p>
      <CardDetail class="w-[98%] rounded-xl bg-blue-300" v-if="spotDetail" :spot="spotDetail" />
      <div class="flex flex-wrap overflow-y-scroll">
        <Card v-for="spot in spots" :spot="spot" class="w-[98%] rounded-xl" />
      </div>
    </div>
    <div class="lg:w-[49%] w-[98%]">
      <Mapbox class="w-[100%] h-[100%] right-0" />
    </div>
  </section>
</template>

<style scoped>
a:hover {
  background-image: linear-gradient(rgb(0 0 0/10%) 0 0);
}
::-webkit-scrollbar {
  width: 2px;
}
</style>
