<template>
  <v-container>
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col
          v-for="action in actions"
          :key="action.name"
          cols="12"
          sm="4"
        >
          <v-card
            @click="action.method"
            height="300px"
            class="pa-2"
            hover
            tile
          >
            <v-card-title primary-title class="justify-center">
              {{ action.name }}
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-flex v-show="isScanActive">
      <v-btn v-if="!!barcodeScanner" @click="hideScanner">Sakrij</v-btn>

      <div v-show="!!barcodeScanner" id="div-video-container">
          <video class="dbrScanner-video" playsinline="true"></video>
      </div>
    </v-flex>
    
    <v-flex v-show="isUploadActive">
      <v-file-input
        multiple
        small-chips
        id="iptDecodeImg"
        accept="image/bmp,image/jpeg,image/png,image/gif"
        v-model="files"
        label="Unos datoteka..."/>
      <v-btn color="primary" text @click="submitFiles">Skeniraj datoteke</v-btn>
    </v-flex>
    <BillForm v-if="isFormActive"/>
    <div v-if="bills.length > 0">
      <v-card
        color="#385F73"
        max-width="400"
        dark
        v-for="bill in bills"
        :key="bill.description"
      >
        <v-card-title class="headline">{{bill.payer.name}}</v-card-title>
        <v-card-subtitle>{{bill.cost}} kn</v-card-subtitle>
        <v-card-subtitle>{{bill.description}}</v-card-subtitle>
        <v-card-subtitle>{{bill.type}}</v-card-subtitle>
      </v-card>
    </div>
    
  </v-container>
</template>

<script>
import Dynamsoft from 'Dynamsoft';
import BillForm from './BillForm';
export default {
  components: {
    BillForm,
  },
  data() {
    return {
      actions: [
        {
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
        }
      ],
      bills: [],
      barcodeScanner: null,
      files: [],
      errors: [],
      isFormActive: false,
      isScanActive: false,
      isUploadActive: false,
    }
  },
  methods: {
    showForm() {
      this.isFormActive = !this.isFormActive;
      this.isScanActive = false;
      this.isUploadActive = false;
    },
    showUpload() {
      this.isFormActive = false;
      this.isScanActive = false;
      this.isUploadActive = !this.isUploadActive;
    },
    showScanner() {
      this.isFormActive = false;
      if(this.isScanActive === true) {
        this.hideScanner();
        this.isScanActive = false;
        return;
      } else {
        this.isScanActive = true;
      }
      this.isUploadActive = false;

      Dynamsoft.BarcodeScanner.createInstance({
        UIElement: document.getElementById('div-video-container'),
        onUnduplicatedRead: (txt) => {
          console.log(txt.split('\n'));
          this.parseResult(txt);
        }
      }).then(s => {
        this.barcodeScanner = s;
        this.barcodeScanner.show().catch(ex => {
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
        isPaidFor: false
      }
      this.bills.push(bill);
    },
    hideScanner() {
      this.barcodeScanner.hide();
      this.barcodeScanner = null;
    },
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
    },
    async submitFiles() {
      let reader = await Dynamsoft.BarcodeReader.createInstance();
      for(const file of this.files) {
        const results = await reader.decode(file);
        if(results.length > 0) {
          let txts = [];
          for(let i = 0; i < results.length; i++) {
            txts.push(results[i].BarcodeText);
          }
          const txt = txts.join('');
          this.parseResult(txt);
        } else {
          this.errors.push('Barkod nije pronađen.')
        }
      }
    }
  }
}
</script>

<style scoped>
.dbrScanner-video {
  height: 400px;
  width: 400px;
}
</style>
