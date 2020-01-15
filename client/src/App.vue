<template>
  <div id="app">
    <nav-bar />
    <v-content>
      <router-view />
    </v-content>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
export default {
  components: {
    NavBar,
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Ubuntu&display=swap');
html, body {
  font-family: 'Ubuntu', sans-serif;
}

#app {
  font-family: 'Ubuntu', sans-serif;
}
</style>
