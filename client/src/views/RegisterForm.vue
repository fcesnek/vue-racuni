<template>
  <v-app>
    <v-container fill-height fluid class="mt-8">
      <v-layout justify-center>
        <v-flex xs12 sm8 md4>
          <v-form v-model="valid" class="form" @submit="signUp" onSubmit="return false;">
            <h1>Registracija</h1>
            <v-text-field
              v-model="username"
              :rules="nameRules"
              :counter="30"
              label="Korisničko ime"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              :rules="[...passwordRules]"
              @click:append="showPassword = !showPassword"
              hint="Najmanje 8 znakova"
              :counter="32"
              label="Lozinka"
              required
            />
            <v-text-field
              v-model="passwordConfirm"
              :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPasswordConfirm ? 'text' : 'password'"
              :rules="[...passwordRules, passwordConfirmationRule]"
              @click:append="showPasswordConfirm = !showPasswordConfirm"
              hint="Najmanje 8 znakova"
              :counter="32"
              label="Potvrda lozinke"
              required
            ></v-text-field>
            <v-btn
              class="mt-5 mb-5"
              :disabled="!valid"
              type="submit"
            >Registracija</v-btn>
          </v-form>
          <v-alert class="mt-5" dense outlined type="error" :value="!!error">
            <div v-html="error" />
          </v-alert>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import UserService from '@/services/UserService';

export default {
  data() {
    return {
      error: '',
      valid: true,
      showPassword: false,
      showPasswordConfirm: false,
      username: '',
      password: '',
      passwordConfirm: '',
      nameRules: [
        v => !!v || 'Unesite korisničko ime',
        v => (v && v.length >= 3 && v.length <= 30) || 'Ime mora biti između 3 i 30 znakova.',
      ],
      passwordRules: [
        v => !!v || 'Unesite lozinku',
        v => (v && v.length >= 8 && v.length <= 32) || 'Lozinka mora biti između 8 i 32 znaka.'],
    };
  },
  methods: {
    async signUp() {
      try {
        const response = await UserService.register({
          username: this.username,
          password: this.password,
        });
        this.$store.dispatch('setToken', response.data.token);
        this.$store.dispatch('setUser', response.data.user);
        this.$router.push({
          name: 'home',
        });
      } catch (error) {
        this.error = error.response.data.error;
      }
    },
  },
  computed: {
    passwordConfirmationRule() {
      return this.password === this.passwordConfirm || 'Lozinke se moraju podudarati.';
    },
  },
};
</script>

<style>
</style>
