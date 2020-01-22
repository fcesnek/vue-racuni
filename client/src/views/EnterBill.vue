<template>
  <v-app>
    <v-container>
      <v-flex>
        <v-row no-gutters>
          <v-col v-for="action in actions" :key="action.name" cols="12" sm="4">
            <v-card
              @click="action.method"
              :height="isAnyInputActive ? '100px' : '300px'"
              class="pa-2 align-content-center"
              hover
              tile
            >
              <v-card-title primary-title class="justify-center">
                {{ action.name }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-flex>

      <v-flex v-show="isScanActive">
        <div v-show="!!barcodeScanner" id="div-video-container">
          <v-btn @click="hideScanner">Sakrij</v-btn>
          <video class="dbrScanner-video" playsinline="true"></video>
        </div>
      </v-flex>

      <v-flex v-show="isUploadActive">
        <v-file-input multiple small-chips id="iptDecodeImg"
          accept="image/bmp,image/jpeg,image/png,image/gif" v-model="files"
          label="Unos datoteka..." />
        <v-btn color="primary" text @click="submitFiles">Skeniraj datoteke</v-btn>
      </v-flex>

      <BillForm v-if="isFormActive" />

      <div v-if="bills.length > 0">
        <v-card color="#385F73" max-width="400" dark v-for="bill in bills" :key="bill.description">
          <v-card-title class="headline">{{bill.payer.name}}</v-card-title>
          <v-card-subtitle>{{bill.cost}} kn</v-card-subtitle>
          <v-card-subtitle>{{bill.description}}</v-card-subtitle>
          <v-card-subtitle>{{bill.type}}</v-card-subtitle>
        </v-card>
      </div>
    </v-container>
  </v-app>
</template>

<script>
// eslint-disable-next-line
import Dynamsoft from 'Dynamsoft';
import BillForm from './BillForm.vue';

export default {
  components: {
    BillForm,
  },
  data() {
    return {
      actions: [{
        name: 'Unesi račun formom',
        method: this.showForm,
      },
      {
        name: 'Skeniraj račun',
        method: this.showScanner,
      },
      {
        name: 'Prenesi slike',
        method: this.showUpload,
      },
      ],
      bills: [],
      barcodeScanner: null,
      files: [],
      errors: [],
      isFormActive: false,
      isScanActive: false,
      isUploadActive: false,
    };
  },
  methods: {
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
          console.log(txt.split('\n'));
          this.parseResult(txt);
        },
      }).then((s) => {
        this.barcodeScanner = s;
        this.barcodeScanner.show().catch((ex) => {
          this.errors.push(ex.message || ex);
          this.barcodeScanner.hide();
        });
      });
    },
    parseResult(result) {
      const resultArr = result.split('\n');
      const costArr = resultArr[2].split('');
      costArr.splice(-2, 0, '.');
      const bill = {
        cost: Number(costArr.join('')),
        payer: {
          name: resultArr[3],
          street: resultArr[4],
          city: resultArr[5],
        },
        description: resultArr[13],
        type: this.getBillType(resultArr[11]),
        isPaidFor: false,
      };
      this.bills.push(bill);
    },
    hideScanner() {
      this.barcodeScanner.hide();
      this.barcodeScanner = null;
      this.isScanActive = false;
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
    async submitFiles() {
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
    },
  },
  computed: {
    isAnyInputActive() {
      return this.isFormActive || this.isScanActive || this.isUploadActive;
    },
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
    width: 640px;
    height: 480px;
  }
</style>