<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value.sync="period"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="period"
        label="Razdoblje"
        prepend-icon="mdi-calendar"
        readonly
        v-on="on"
        outlined
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="period"
      type="month"
      no-title
      scrollable
    >
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="menu = false">Odustani</v-btn>
      <v-btn text color="primary" @click="$refs.menu.save(period); emitPeriod()">OK</v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      menu: false,
      period: new Date().toISOString().substr(0, 7),
    };
  },
  mounted() {
    this.emitPeriod();
  },
  methods: {
    emitPeriod() {
      this.$emit('periodChosen', {
        period: this.period,
      });
    },
  },
};
</script>

<style>

</style>
