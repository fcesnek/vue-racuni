<template>
  <v-app-bar class="mb-5" fixed app>
    <v-toolbar-title class="mr-4">
      <router-link
        tag="span"
        to="/">
          <v-icon class="home">mdi-home</v-icon>
      </router-link>
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items>
      <v-tabs>
        <v-tab to="/unos-racuna">Unos računa</v-tab>
        <v-tab to="/moji-racuni">Moji računi</v-tab>
      </v-tabs>
    </v-toolbar-items>
    <v-spacer />
    <v-toolbar-items>
      <v-tabs fixed-tabs>
        <v-tab to="/prijava">Prijava</v-tab>
        <v-tab to="/registracija">Registracija</v-tab>
        <v-tab to="/odjava">Odjava</v-tab>
      </v-tabs>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
</script>

<style scoped>
.home {
   cursor: pointer;
 }
 .home:hover {
   color: #333;
 }
</style>
