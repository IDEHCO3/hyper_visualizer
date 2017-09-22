<template>
  <v-app>
    <v-flex xs12 sm6>
      <v-menu lazy  :close-on-content-click="true"  v-model="menu"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
        <v-text-field slot="activator" label="rotulo" v-model="data" prepend-icon="event" readonly ></v-text-field>
        <v-date-picker v-model="data" no-title scrollable actions>
        </v-date-picker>
      </v-menu>
   </v-flex>
  </v-app>
</template>
<script>
export default {
  name: 'datePicker',
  props: ['data', 'rotulo'],
  data() {
    return { menu: false, modal: false }
  }
}
</script>
