<template>
  <div>
    <v-card-title class="title">
      {{bill.payer.name}} <br> {{bill.type}}
    </v-card-title>
    <v-card-text>
      <b>Cijena:</b> {{bill.cost}} kn
    </v-card-text>
    <v-card-text>
      <b>Opis:</b> {{bill.description}}
      <br>
      <b>Adresa:</b> {{bill.payer.city}}, {{bill.payer.street}}
      <br>
      <b>Razdoblje:</b> {{bill.month}} / {{bill.year}}
      <br>
      <b>Poziv na broj:</b> {{bill.billNumber}}
    </v-card-text>
  </div>
</template>

<script>
export default {
  props: ['bill'],
};
</script>

<style>

</style>
