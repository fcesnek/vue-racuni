<template>
  <v-card
    class="d-inline-block mx-auto">
    <v-container>
      <v-row justify="space-between">
        <v-col cols="auto">
          <v-btn icon>
            <v-icon color="red" @click="removeBill">mdi-close-circle-outline</v-icon>
          </v-btn>
          <v-btn v-if="!editMode" icon>
            <v-icon color="blue" @click="toggleEdit(); emitEditingEvent();">mdi-pencil</v-icon>
          </v-btn>
          <v-btn v-if="editMode" icon :disabled="!valid">
            <v-icon color="green" @click="toggleEdit(); emitEditingEvent();">mdi-check</v-icon>
          </v-btn>
          <BillCardRead v-if="!editMode" :bill="bill"/>
          <BillCardEdit @isValidInput="isValidInput" v-if="editMode" :bill="bill"/>
          <v-card-text>
            <v-checkbox label="Račun je plaćen" v-model="bill.isPaidFor" />
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import BillCardRead from './BillCardRead.vue';
import BillCardEdit from './BillCardEdit.vue';

export default {
  data() {
    return {
      editMode: false,
      valid: true,
    };
  },
  props: ['bill'],
  components: {
    BillCardRead,
    BillCardEdit,
  },
  methods: {
    emitEditingEvent() {
      this.$emit('editing', {
        editing: this.editMode,
      });
    },
    isValidInput({ valid }) {
      this.valid = valid;
    },
    removeBill() {
      this.$emit('removeBill', {
        bill: this.bill,
      });
    },
    toggleEdit() {
      this.editMode = !this.editMode;
    },
  },
};

</script>

<style scoped>
.title {
  word-break: break-all;
}
</style>
