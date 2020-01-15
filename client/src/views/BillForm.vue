<template>
  <v-flex xs6>
    <h1>Podaci o računu</h1>
    <v-text-field
      v-model='payer.name'
      label='Ime i prezime platitelja'
      outlined
      shaped
    ></v-text-field>
    <v-text-field
      v-model='payer.street'
      label='Ulica'
      outlined
      shaped
    ></v-text-field>
    <v-text-field
      v-model='payer.city'
      label='Mjesto'
      outlined
      shaped
    ></v-text-field>
    <v-text-field
      v-model='description'
      label='Poziv na broj primatelja'
      outlined
      shaped
    ></v-text-field>
    <v-text-field
      v-model='cost'
      label='Cijena'
      outlined
      shaped
    ></v-text-field>
    <v-text-field
      v-model='type'
      label='Tip računa'
      outlined
      disabled
      shaped
    ></v-text-field>
    <v-checkbox
      v-model='isPaidFor'
      label='Račun je plaćen'
    ></v-checkbox>
    <v-btn>Spremi</v-btn>
  </v-flex>
</template>

<script>
export default {
  data() {
    return {
      cost: '',
      payer: {
        name: '',
        street: '',
        city: '',
      },
      description: '',
      isPaidFor: false,
    }
  },
  methods: {
    getBillType(pattern) {
      const patterns = {
        "^[0-9]{9}-[0-9]{6}$": "VIP internet",
        "^[0-9]{2}-[0-9]{6}-[0-9]{4}$": "UNIKOM",
        "^[0-9]{11}-[0-9]{4}-[0-9]{1}$": "HEP Toplinarstvo",
        "^[0-9]{6}-[0-9]{6}-[0-9]{3}$": "Pričuva",
        "^[0-9]{10}-[0-9]{6}-[0-9]{1}$": "HEP Struja",
        "^[0-9]{6}$": "Vodovod Osijek",
        "^[0-9]{11}-[0-9]{5}$": "Vodovod Osijek",
        "^[0-9]{4}-[0-9]{6}-[0-9]{7}$": "Komunalna naknada",
      };

      let regExps = [];
      for (let key of Object.keys(patterns)) {
        regExps.push(new RegExp(key));
      }

      for (let regExp of regExps) {
        if(regExp.test(pattern)) {
          return patterns[regExp.source];
        }
      }
      return 'Unknown';
    }
  },
  computed: {
    type: function() {
      return this.getBillType(this.description);
    }
  }
}

</script>

<style>

</style>
