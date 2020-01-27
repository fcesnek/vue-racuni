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
      <v-btn flat to="/prijava">
        Prijava
      </v-btn>
      <v-btn flat to="/registracija">
        Registracija
      </v-btn>
      <v-btn flat to="/odjava">
        Odjava
      </v-btn>
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
