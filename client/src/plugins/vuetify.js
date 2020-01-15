import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import hr from 'vuetify/es5/locale/hr';

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
      locales: { hr },
      current: 'hr',
    },
});
