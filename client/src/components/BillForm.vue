<template>
  <v-form v-model="valid">
    <v-container grid-list-md text-xs-center class="mt-5">
      <v-layout row wrap>
        <v-flex xs12>
          <h1>Podaci o računu</h1>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            prepend-icon="mdi-account"
            v-model='payer.name'
            label='Ime i prezime platitelja'
            outlined
            required
            :rules="requiredRules"
          />
          <v-text-field
            prepend-icon="mdi-map-marker"
            v-model='payer.street'
            label='Ulica'
            outlined
            required
            :rules="requiredRules"
          />
          <v-text-field
            prepend-icon="mdi-city"
            v-model='payer.city'
            label='Mjesto'
            outlined
            required
            :rules="requiredRules"
          />
          <MonthPicker
            @periodChosen="setPeriod"
          />
          <v-checkbox
            v-model='isPaidFor'
            label='Račun je plaćen'
          />
        </v-flex>
        <v-flex xs6>
          <v-text-field
            prepend-icon="mdi-counter"
            v-model='billNumber'
            label='Poziv na broj primatelja'
            outlined
            required
            :rules="requiredRules"
          />
          <v-text-field
            :rules="[...numberRules, ...requiredRules]"
            prepend-icon="mdi-account-cash"
            v-model='cost'
            label='Cijena'
            suffix="KN"
            outlined
            required
          />
          <v-text-field
            prepend-icon="mdi-format-list-checks"
            v-model='type'
            label='Tip računa'
            outlined
            required
            :rules="requiredRules"
          />
          <v-text-field
            prepend-icon="mdi-message-text-outline"
            v-model='description'
            label='Opis računa'
            outlined
          />
        </v-flex>
        <v-flex xs12>
          <v-btn
            @click="saveBill"
            :disabled="!valid"
          >
            Dodaj
          </v-btn>
        </v-flex>
        <v-alert class="mt-5" dense outlined type="error" :value="!!error">
          <div v-html="error" />
        </v-alert>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import MonthPicker from './MonthPicker.vue';

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
      numberRules: [v => !!Number(v) || 'Uneseni podatak mora biti broj (decimalni dio odvojen točkom)'],
      requiredRules: [v => !!v || 'Ispunite označeno polje'],
      valid: true,
    };
  },
  methods: {
    setPeriod(data) {
      const periodArr = data.period.split('-');
      [this.year, this.month] = [...periodArr];
    },
    saveBill() {
      const bill = {
        cost: Number(this.cost),
        payer: this.payer,
        billNumber: this.billNumber,
        description: this.description,
        isPaidFor: this.isPaidFor,
        month: Number(this.month),
        year: Number(this.year),
        type: this.type,
      };

      this.$emit('billInput', {
        bill,
      });
      Object.assign(this.$data, this.$options.data.apply(this));
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
      return this.getBillType(this.billNumber);
    },
  },
};
</script>
