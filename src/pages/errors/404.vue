<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/sad.svg"
        style="width:30vw;max-width:150px;"
      >
    </p>
    <p class="text-faded">Page not found... <strong>(404)</strong></p>
    <q-btn
      color="primary"
      style="width:100px;"
      @click="$router.back()"
      label="Back"
    />
  </div>
</template>

<script>
export default {
  name: 'Error404'
}
</script>
