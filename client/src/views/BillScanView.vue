<template>
  <div id="app">
    <v-btn @click="showScanner">show scanner</v-btn>
    <v-btn @click="hideScanner">hide scanner</v-btn>

    <div v-show="!!barcodeScanner" id="div-video-container">
        <video class="dbrScanner-video" playsinline="true"></video>
    </div>
    <input id="iptDecodeImg" type="file" accept="image/bmp,image/jpeg,image/png,image/gif">

    <v-card
      color="#385F73"
      max-width="400"
      dark
    >
      <v-card-title class="headline">{{bill.payer.name}}</v-card-title>
      <v-card-subtitle>{{bill.cost}} kn</v-card-subtitle>
      <v-card-subtitle>{{bill.description}}</v-card-subtitle>
      <v-card-subtitle>{{bill.type}}</v-card-subtitle>
    </v-card>
  </div>
</template>

<script>
import Dynamsoft from 'Dynamsoft'
/* eslint-disable no-console */
export default {
  data() {
    return {
      bills: [],
      bill: {
        payer: {
          name: '',
          street: '',
          city: ''
        },
        type: '',
        cost: null,
        description: '',
        month: null,
        year: null
      },
      barcodeScanner: null
    }
  },
  methods: {
    showScanner() {
      Dynamsoft.BarcodeScanner.createInstance({
        UIElement: document.getElementById('div-video-container'),
        onUnduplicatedRead: (txt) => {
          console.log(txt.split('\n'));
          this.parseResult(txt);
        }
      }).then(s => {
        this.barcodeScanner = s;
        this.barcodeScanner.show().catch(ex => {
          alert(ex.message || ex);
          this.barcodeScanner.hide();
        });
      });
    },
    parseResult(result) {
      const resultArr = result.split('\n');
      const costArr = resultArr[2].split('');
      costArr.splice(-2, 0, '.');
      this.bill.cost = Number(costArr.join(''));
      this.bill.payer.name = resultArr[3];
      this.bill.payer.street = resultArr[4];
      this.bill.payer.city = resultArr[5];
      this.bill.description = resultArr[13];
      this.bill.type = this.getBillType(resultArr[11]);
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
    }
  },
  mounted() {
    let reader;
    let ref = this;

    document.getElementById('iptDecodeImg').addEventListener('change', async function () {
      if (!reader) {
        reader = await Dynamsoft.BarcodeReader.createInstance();
      }
      reader.decode(this.files[0]).then(results => {
        if (results.length > 0) {
          var txts = [];
          for (var i = 0; i < results.length; ++i) {
            txts.push(results[i].BarcodeText);
          }
          const txt = txts.join('');
          this.value = '';
          const data = txt.split('\n');
          const iznos = data[2];
          let iznosArr = iznos.split('');
          iznosArr.splice(-2, 0, '.');
          const finalVal = Number(iznosArr.join(''));
          ref.cost = finalVal;
          ref.payer.name = data[3];
          ref.payer.address.street = data[4];
          ref.payer.address.city = data[5];
          ref.billDesc = data[13];
          console.log(finalVal);

          console.log('data', data);
          ref.result = data;
        } else {
          alert("No barcode found.");
          this.value = '';
        }
      });
    });
  }
}
</script>

<style scoped>
.dbrScanner-video {
  height: 400px;
  width: 400px;
}
</style>
