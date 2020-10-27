<template lang="pug">
#q-app
  router-view
  project-dialog
</template>

<script>
import ProjectDialog from './components/dialog'

export default {
  name: 'App',

  components: { ProjectDialog }
}
</script>
