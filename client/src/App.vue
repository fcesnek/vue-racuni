<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <h1>RAČUNI</h1>
      </div>
    </v-app-bar>

    <v-content>
      <BillScanView class="mt-10"/>
    </v-content>
  </v-app>
</template>

<script>
import BillScanView from './views/BillScanView';

export default {
  name: 'App',

  components: {
    BillScanView,
  },

  data: () => ({
    //
  }),
};
</script>
