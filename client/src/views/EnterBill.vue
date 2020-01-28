<template>
  <v-app>
    <v-container>
      <v-flex>
        <v-row no-gutters>
          <v-col v-for="action in actions" :key="action.name" cols="12" sm="4">
            <v-card
              @click="action.method"
              :height="isAnyInputActive ? '100px' : '200px'"
              class="pa-2"
              hover
              tile
              align-center
            >
              <v-card-title primary-title class="action-title justify-center">
                {{ action.name }}
              </v-card-title>
              <div v-if="!isAnyInputActive" class="input-icon">
                <v-icon>{{action.icon}}</v-icon>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <v-row
          align="center"
          justify="center"
          v-if="errors.length">
          <v-alert justify-center class="mt-5" dense outlined type="error" :value="errors.length">
            <span v-for="error in errors" :key="error">{{ error }}</span>
          </v-alert>
        </v-row>
      </v-flex>
      <v-overlay :value="billLoaded" color="success">
        <h1>Račun učitan</h1>
      </v-overlay>

      <v-flex v-show="isScanActive">
        <v-container grid-list-md text-xs-center class="mt-5 form">
          <v-layout row wrap v-show="!!barcodeScanner" id="div-video-container">
            <v-btn class="mb-4" @click="hideScanner">Sakrij</v-btn>
              <month-picker
                v-if="!!barcodeScanner"
                @periodChosen="setPeriod"
              />
            <video class="dbrScanner-video" playsinline="true"></video>
          </v-layout>
        </v-container>
      </v-flex>

      <v-flex v-if="isUploadActive">
        <v-container grid-list-md text-xs-center class="mt-5 form">
          <v-layout column wrap>
            <month-picker
              @periodChosen="setPeriod"
            />
            <v-file-input
              multiple small-chips
              id="iptDecodeImg"
              accept="image/bmp,image/jpeg,image/png,image/gif"
              v-model="files"
              label="Unos datoteka..."
            />
            <v-btn
              @click="scanFiles"
              max-width="200px"
            >
              Skeniraj datoteke
            </v-btn>
          </v-layout>
        </v-container>
      </v-flex>

      <BillForm
        v-if="isFormActive"
        class="form"
        @billInput="addBill"/>

      <v-container
        grid-list-md
        text-xs-center
        class="mt-5"
        v-if="bills.length"
      >
        <v-layout row wrap class="form">
          <v-flex xs12 md9>
            <h1>Uneseni računi</h1>
          </v-flex>
          <v-flex xs12 md3>
            <v-btn @click="saveBills"><v-icon>mdi-content-save</v-icon>Pohrani račune</v-btn>
          </v-flex>
          <v-flex xs12 justify-center align-center v-if="saveBillErrors.length">
            <v-alert justify-center class="mt-5" dense outlined type="error" :value="!!saveBillErrors.length">
              <span v-for="error in saveBillErrors" :key="error">{{ error }}</span>
            </v-alert>
          </v-flex>
          <v-flex xs12 justify-center align-center v-if="successAlerts.length">
            <v-alert justify-center class="mt-5" dense outlined type="success" :value="!!successAlerts.length">
              <span v-for="msg in successAlerts" :key="msg">{{ msg }}</span>
            </v-alert>
          </v-flex>
          <v-flex
            xs12
            md4
            v-for="bill in bills"
            :key="bill.billNumber"
          >
            <BillCard
              @editing="setEditing"
              @removeBill="removeBill"
              :bill="bill"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-container>
  </v-app>
</template>

<script>
// eslint-disable-next-line
import Dynamsoft from 'Dynamsoft';
import { mapState } from 'vuex';
import BillService from '../services/BillService';
import BillForm from '../components/BillForm.vue';
import MonthPicker from '../components/MonthPicker.vue';
import BillCard from '../components/BillCard/BillCard.vue';

export default {
  components: {
    BillForm,
    MonthPicker,
    BillCard,
  },
  data() {
    return {
      actions: [{
        name: 'Unesi račun',
        method: this.showForm,
        icon: 'mdi-pencil-plus',
      },
      {
        name: 'Skeniraj račun',
        method: this.showScanner,
        icon: 'mdi-barcode-scan',
      },
      {
        name: 'Prenesi slike',
        method: this.showUpload,
        icon: 'mdi-image-multiple',
      }],
      bills: [],
      barcodeScanner: null,
      files: [],
      errors: [],
      isFormActive: false,
      isScanActive: false,
      isUploadActive: false,
      year: '',
      month: '',
      editing: false,
      saveBillErrors: [],
      successAlerts: [],
      billLoaded: false,
    };
  },
  methods: {
    setEditing({ editing }) {
      this.editing = editing;
    },
    setPeriod(data) {
      const periodArr = data.period.split('-');
      [this.year, this.month] = [...periodArr];
    },
    removeBill({ bill }) {
      this.bills.splice(this.bills.findIndex(item => item.billNumber === bill.billNumber), 1);
    },
    addBill({ bill }) {
      this.bills.push(bill);
      this.billLoaded = true;
      setTimeout(() => {
        this.billLoaded = false;
      }, 1200);
      this.showForm();
    },
    showForm() {
      this.isFormActive = !this.isFormActive;
      if (this.isScanActive === true) {
        this.hideScanner();
        this.isScanActive = false;
      }
      this.isScanActive = false;
      this.isUploadActive = false;
    },
    showUpload() {
      this.isUploadActive = !this.isUploadActive;
      this.isFormActive = false;
      if (this.isScanActive === true) {
        this.hideScanner();
        this.isScanActive = false;
      }
    },
    showScanner() {
      this.isFormActive = false;
      if (this.isScanActive === true) {
        this.hideScanner();
        this.isScanActive = false;
        return;
      }
      this.isScanActive = true;
      this.isUploadActive = false;

      Dynamsoft.BarcodeScanner.createInstance({
        UIElement: document.getElementById('div-video-container'),
        onUnduplicatedRead: (txt) => {
          this.parseResult(txt);
          this.billLoaded = true;
          setTimeout(() => {
            this.billLoaded = false;
          }, 1200);
        },
      }).then((s) => {
        this.barcodeScanner = s;
        this.barcodeScanner.show().catch((ex) => {
          this.errors.push(ex.message || ex);
          this.barcodeScanner.hide();
        });
      });
    },
    hideScanner() {
      this.barcodeScanner.hide();
      this.barcodeScanner = null;
      this.isScanActive = false;
    },
    parseResult(result) {
      const resultArr = result.split('\n');
      const costArr = resultArr[2].split('');
      costArr.splice(-2, 0, '.');
      const cityArr = resultArr[5].split(' ');
      cityArr.shift();
      const city = cityArr.join(' ');
      const bill = {
        cost: Number(costArr.join('')),
        payer: {
          name: resultArr[3],
          street: resultArr[4],
          city,
        },
        month: Number(this.month),
        year: Number(this.year),
        billNumber: resultArr[11],
        description: resultArr[13],
        isPaidFor: false,
        type: this.getBillType(resultArr[11]),
      };
      this.bills.push(bill);
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
    async scanFiles() {
      const reader = await Dynamsoft.BarcodeReader.createInstance();
      for (const file of this.files) {
        // eslint-disable-next-line
        const results = await reader.decode(file);
        if (results.length > 0) {
          const txts = [];
          for (let i = 0; i < results.length; i += 1) {
            txts.push(results[i].BarcodeText);
          }
          const txt = txts.join('');
          this.parseResult(txt);
        } else {
          this.errors.push('Barkod nije pronađen.');
        }
      }
      this.billLoaded = true;
      setTimeout(() => {
        this.billLoaded = false;
      }, 1200);
      this.files = [];
    },
    async saveBills() {
      if (this.editing) {
        this.saveBillErrors.push('Prije pohrane podataka spremite sve račune i izađite iz načina uređivanja.');
      } else {
        try {
          this.saveBillErrors = [];
          this.successAlerts = [];
          await BillService.new(this.bills);
          this.successAlerts.push('Računi uspješno spremljeni.');
        } catch (error) {
          this.saveBillErrors.push(error.response.data.error);
        }
      }
    },
  },
  computed: {
    isAnyInputActive() {
      return this.isFormActive || this.isScanActive || this.isUploadActive;
    },
    ...mapState([
      'isUserLoggedIn',
      'user',
    ]),
  },
  beforeDestroy() {
    if (this.barcodeScanner) this.hideScanner();
  },
};

</script>

<style scoped>
  #div-video-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .dbrScanner-video {
    width: 80%;
    height: 80%;
    object-fit: cover;
  }

  .input-icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .input-icon i {
    font-size: 4rem!important;
  }
  .action-title {
    text-transform: uppercase;
    font-size: 1.5rem;
    font-weight: bold;
    word-break: keep-all;
  }
</style>
