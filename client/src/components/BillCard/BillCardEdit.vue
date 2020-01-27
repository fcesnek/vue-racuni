<template>
  <div>
    <v-form v-model="valid">
      <v-text-field
        prepend-icon="mdi-account"
        v-model='bill.payer.name'
        label='Ime i prezime platitelja'
        required
        :rules="requiredRules"
        @keyup="emitValidState"
      />
      <v-text-field
        prepend-icon="mdi-format-list-checks"
        v-model='bill.type'
        label='Tip računa'
        required
        :rules="requiredRules"
        @keyup="emitValidState"
      />
      <v-text-field
        :rules="[...numberRules, ...requiredRules]"
        prepend-icon="mdi-account-cash"
        v-model='bill.cost'
        label='Cijena'
        suffix="KN"
        required
        @keyup="emitValidState"
      />
      <v-text-field
        prepend-icon="mdi-message-text-outline"
        v-model='bill.description'
        label='Opis računa'
        @keyup="emitValidState"
      />
      <v-text-field
        prepend-icon="mdi-city"
        v-model='bill.payer.city'
        label='Mjesto'
        required
        :rules="requiredRules"
        @keyup="emitValidState"
      />
      <v-text-field
        prepend-icon="mdi-map-marker"
        v-model='bill.payer.street'
        label='Ulica'
        required
        :rules="requiredRules"
        @keyup="emitValidState"
      />
      <MonthPicker
        @periodChosen="setPeriod"
      />
      <v-text-field
        prepend-icon="mdi-counter"
        v-model='bill.billNumber'
        label='Poziv na broj primatelja'
        required
        :rules="requiredRules"
        @keyup="emitValidState"
      />
    </v-form>
  </div>
</template>

<script>
import MonthPicker from '../MonthPicker.vue';

export default {
  data() {
    return {
      valid: true,
      numberRules: [v => !!Number(v) || 'Uneseni podatak mora biti broj (decimalni dio odvojen točkom)'],
      requiredRules: [v => !!v || 'Ispunite označeno polje'],
    };
  },
  props: ['bill'],
  components: {
    MonthPicker,
  },
  methods: {
    setPeriod(data) {
      const periodArr = data.period.split('-');
      [this.bill.year, this.bill.month] = [...periodArr];
    },
    emitValidState() {
      this.$emit('isValidInput', {
        valid: this.valid,
      });
    },
  },
};
</script>

<style>

</style>
