<template>
  <v-app>
    <v-container grid-list-md text-xs-center>
      <v-layout justify-center>
        <v-flex xs6 offset-xs-3>
          <v-form v-model="valid">
            <h1>Registracija</h1>
            <v-text-field
              v-model="username"
              :rules="nameRules"
              :counter="30"
              label="Korisničko ime"
              required
            ></v-text-field>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
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
            ></v-text-field>
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
          </v-form>
          <v-btn :disabled="!valid" @click="signUp">Registracija</v-btn>
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
      valid: true,
      showPassword: false,
      showPasswordConfirm: false,
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      nameRules: [
        v => !!v || 'Unesite korisničko ime',
        v => (v && v.length >= 3 && v.length <= 30) || 'Ime mora biti između 3 i 30 znakova.',
      ],
      emailRules: [
        v => !!v || 'Unesite email',
        v => /.+@.+\..+/.test(v) || 'Unesite validan email',
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
          email: this.email,
          password: this.password,
        });
        console.log(response);
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
