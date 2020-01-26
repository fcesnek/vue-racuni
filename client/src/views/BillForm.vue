<template>
  <v-container grid-list-md text-xs-center class="mt-5">
    <v-layout row wrap>
      <v-flex xs12>
        <h1>Podaci o računu</h1>
      </v-flex>
      <v-flex xs6>
        <v-text-field prepend-icon="mdi-account" v-model='payer.name' label='Ime i prezime platitelja' outlined />
        <v-text-field prepend-icon="mdi-map-marker" v-model='payer.street' label='Ulica' outlined />
        <v-text-field prepend-icon="mdi-city" v-model='payer.city' label='Mjesto' outlined />
        <month-picker @periodChosen="setPeriod" />
        <v-checkbox v-model='isPaidFor' label='Račun je plaćen' />
      </v-flex>
      <v-flex xs6>
        <v-text-field prepend-icon="mdi-counter" v-model='billNumber' label='Poziv na broj primatelja' outlined />
        <v-text-field prepend-icon="mdi-account-cash" v-model='cost' label='Cijena' outlined />
        <v-text-field prepend-icon="mdi-format-list-checks" v-model='type' label='Tip računa' outlined />
        <v-text-field prepend-icon="mdi-message-text-outline" v-model='description' label='Opis računa' outlined />
      </v-flex>
      <v-flex xs12>
        <v-btn @click="saveBill">Spremi</v-btn>
        <v-alert class="mt-5" dense outlined type="error" :value="!!error">
          <div v-html="error" />
        </v-alert>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MonthPicker from '../components/MonthPicker.vue';

export default {
  components: {
    MonthPicker,
  },
  data() {
    return {
      cost: '',
      payer: {
        name: '',
        street: '',
        city: '',
      },
      billNumber: '',
      description: '',
      isPaidFor: false,
      month: '',
      year: '',
      error: '',
    };
  },
  methods: {
    setPeriod(data) {
      const periodArr = data.period.split('-');
      [this.year, this.month] = [...periodArr];
    },
    saveBill() {
      const bill = {

      };
    },
    getBillType(pattern) {
      const patterns = {
        '^[0-9]{9}-[0-9]{6}$': 'VIP internet',
        '^[0-9]{2}-[0-9]{6}-[0-9]{4}$': 'UNIKOM',
        '^[0-9]{11}-[0-9]{4}-[0-9]{1}$': 'HEP Toplinarstvo',
        '^[0-9]{6}-[0-9]{6}-[0-9]{3}$': 'Pričuva',
        '^[0-9]{10}-[0-9]{6}-[0-9]{1}$': 'HEP Struja',
        '^[0-9]{6}$': 'Vodovod Osijek',
        '^[0-9]{11}-[0-9]{5}$': 'Vodovod Osijek',
        '^[0-9]{4}-[0-9]{6}-[0-9]{7}$': 'Komunalna naknada',
      };

      const regExps = [];
      for (const key of Object.keys(patterns)) {
        regExps.push(new RegExp(key));
      }

      for (const regExp of regExps) {
        if (regExp.test(pattern)) {
          return patterns[regExp.source];
        }
      }
      return 'Nepoznat';
    },
  },
  computed: {
    type() {
      return this.getBillType(this.description);
    },
  },
};
</script>

<style>

</style>
