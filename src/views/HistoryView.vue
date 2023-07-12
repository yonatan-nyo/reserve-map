<template>
  <div class="w-full">
    <table class="w-full border-collapse">
      <thead class="text-xs font-semibold text-gray-700 bg-white">
        <tr class="text-left">
          <th class="py-2 px-4">DATE</th>
          <th class="py-2 px-4">SPOT NAME</th>
          <th class="py-2 px-4">AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="history in histories" :key="history.id" class="border-b">
          <td class="py-3 px-4">{{ new Date(history.createdAt).toISOString().slice(0, 10) }}</td>
          <td class="py-3 px-4">{{ history.Spot.name }}</td>
          <td class="py-3 px-4">Rp{{ history.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useMainStore } from "../stores";

export default {
  name: "HistoryView",
  methods: {
    ...mapActions(useMainStore, ["fetchHistories"]),
  },
  computed: {
    ...mapState(useMainStore, ["histories"]),
  },
  async created() {
    await this.fetchHistories();
  },
};
</script>

<style scoped>
tr:nth-child(even) {
  background-color: rgb(255, 255, 255, 0.5);
}
</style>
