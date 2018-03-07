<template>
  <v-layout row justify-center>
    <v-dialog v-model="getModal.openOrClose" max-width="640">
      <v-card>
        <v-btn icon right @click="closeModal">
          <v-icon color="red">close</v-icon>
        </v-btn>
        <v-card-text>{{ getModal.info }}</v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {

    }
  },
  methods: {
    closeModal () {
      this.$store.commit('closeModal')
    }
  },
  computed: {
    ...mapGetters(['getModal'])
  }
}
</script>

<style scoped>
  
</style>