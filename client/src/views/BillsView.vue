<template>
  <v-app>
    <v-container class="form mt-9 mb-9">
      <v-flex md4 xs12>
        <v-select
          :items="cities"
          label="1. Odaberite mjesto"
          @change="changeCity"
          clearable
        ></v-select>
      </v-flex>
      <v-flex md4 xs12>
        <v-select
          :items="timePeriods"
          label="2. Odaberite vremensko razdoblje"
          @change="changePeriod"
          clearable
        ></v-select>
      </v-flex>
      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="selectedBills"
          item-key="name"
          class="elevation-1"
          hide-default-footer
        >
        <template v-slot:item.isPaidFor="{ item }">
          <v-checkbox @change="calculateSums" v-model="item.isPaidFor"></v-checkbox>
        </template>
        <template v-slot:item.action="{ item }">
          <v-icon
            small
            @click="showDialog(item)"
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title v-if="!!selectedTimePeriod">
              {{selectedTimePeriod}}
            </v-toolbar-title>
            <v-toolbar-title v-else-if="!!selectedTimePeriod && !!selectedCity">
              {{selectedTimePeriod}} - {{selectedCity}}
            </v-toolbar-title>
            <v-toolbar-title v-else>
              Svi računi
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="headline">Jeste li sigurni da želite obrisati račun?</span>
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="removeBill">DA</v-btn>
                  <v-btn color="blue darken-1" text @click="close">NE</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn color="#c5e1a5" class="mb-2" @click="saveToDb">
              <v-icon>mdi-content-save</v-icon>Spremi promjene
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.type="{ item }">
          <v-chip :color="getColor(item.isPaidFor)">{{ item.type }}</v-chip>
        </template>
        <template v-slot:body.append="{ headers }">
          <tr class="highlight-to-pay">
            <td :colspan="headers.length" align="right">
              PREOSTALO ZA PLATITI: <b>{{ sumToPay }}</b> kn
            </td>
          </tr>
          <tr class="highlight-paid">
            <td :colspan="headers.length" align="right">
              PLAĆENO: <b>{{ sumPaid }}</b> kn
            </td>
          </tr>
        </template>
        </v-data-table>
      </v-flex>
    </v-container>
  </v-app>
</template>

<script>
import BillService from '../services/BillService';

export default {
  data() {
    return {
      dialog: false,
      billToDelete: {},
      selectedTimePeriod: '',
      selectedCity: '',
      timePeriods: [],
      cities: [],
      selectedBills: [],
      sumToPay: '',
      sumPaid: '',
      bills: [],
      headers: [
        {
          text: 'Platitelj',
          align: 'left',
          sortable: false,
          value: 'payer.name',
        },
        { text: 'Mjesto', value: 'payer.city' },
        { text: 'Ulica', value: 'payer.street' },
        { text: 'Tip računa', value: 'type' },
        { text: 'Poziv na broj', value: 'billNumber' },
        { text: 'Cijena (kn)', value: 'cost' },
        { text: 'Razdoblje', value: 'period' },
        { text: 'Plaćen', value: 'isPaidFor', sortable: false },
        { text: 'Radnje', value: 'action', sortable: false },
      ],
    };
  },
  async mounted() {
    this.bills = (await BillService.list()).data.bills;
    this.selectedBills = this.bills;
    this.timePeriods = this.bills.map(d => d.period);
    this.cities = this.bills.map(d => d.payer.city.toUpperCase());
    this.calculateSums();
  },
  methods: {
    changeCity(selection) {
      if (selection) this.selectedBills = this.bills.filter(d => d.payer.city.toUpperCase() === selection.toUpperCase());
      else this.selectedBills = this.bills;
      this.selectedCity = selection;
      this.calculateSums();
    },
    changePeriod(selection) {
      if (selection && this.selectedCity) {
        this.selectedBills = this.bills.filter(d => d.period === selection
                                                  && d.payer.city.toUpperCase() === this.selectedCity);
      } else if (selection) {
        this.selectedBills = this.bills.filter(d => d.period === selection);
      } else if (this.selectedCity && !selection) {
        this.selectedBills = this.bills.filter(d => d.payer.city.toUpperCase() === this.selectedCity.toUpperCase());
      } else {
        this.selectedBills = this.bills;
      }
      this.selectedTimePeriod = selection;
      this.calculateSums();
    },
    getColor(isPaidFor) {
      return isPaidFor ? '#c5e1a5' : '#f9a825';
    },
    calculateSums() {
      this.sumToPay = this.selectedBills.reduce(((acc, curr) => {
        if (!curr.isPaidFor) return acc + curr.cost;
        return acc;
      }), 0);
      this.sumPaid = this.selectedBills.reduce(((acc, curr) => {
        if (curr.isPaidFor) return acc + curr.cost;
        return acc;
      }), 0);
    },
    showDialog(item) {
      console.log(item);
      this.billToDelete = item;
      this.dialog = true;
    },
    async removeBill() {
      try {
        await BillService.remove(this.billToDelete.billNumber);
        this.bills = this.bills.filter(obj => obj.billNumber !== this.billToDelete.billNumber);
        this.selectedBills = this.selectedBills.filter(obj => obj.billNumber !== this.billToDelete.billNumber);
        this.calculateSums();
        this.billToDelete = {};
        this.close();
      } catch (error) {
        console.log(error.response);
      }
    },
    async saveToDb() {
      try {
        await BillService.edit(this.bills);
      } catch (error) {
        console.log(error.response);
      }
    },
    close() {
      this.dialog = false;
    },
  },
  watch: {
    dialog(val) {
      // eslint-disable-next-line
      val || this.close();
    },
  },
};
</script>

<style scoped>
  .highlight-to-pay {
    background-color: #ffe0b2;
  }
  .highlight-paid {
    background-color: #f0f4c3;
  }
</style>
