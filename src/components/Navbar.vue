<script>
export default {
  name: "Navbar",
};
</script>

<template>
  <section class="max-w-[1240px] flex-grow h-[3rem] p-2 flex justify-center mx-auto">
    <div class="space-x-4 sm:space-x-7 md:space-x-12 p-1.5 flex text-sm sm:text-md">
      <RouterLink to="/">Home</RouterLink>
      <p>|</p>
      <RouterLink to="/history">History</RouterLink>
      <p>|</p>
      <RouterLink to="/profile">Profile</RouterLink>
    </div>
  </section>
</template>

<style scoped></style>
