<template>
  <v-app>
    <v-tabs dark v-model="active">
      <v-tabs-bar class="indigo">

        <v-tabs-item   v-for="tab in tabs" :key="tab" :href="'#' + tab" ripple >
           {{ tab }}
        </v-tabs-item>
        <v-tabs-slider class="yellow"></v-tabs-slider>
      </v-tabs-bar>
      <v-tabs-items >
        <v-tabs-content   v-for="tab in tabs" :key="tab" :id="tab">
          <v-card flat>
            <div v-if="tab=='Tipo de Gasto'">
              <v-card-text><tab-tipo-gasto></tab-tipo-gasto></v-card-text>
            </div>
            <div v-else-if="tab == 'Gastos'">
              <v-card-text><tab-gasto></tab-gasto></v-card-text>
            </div>
            <div v-else-if="tab === 'Pessoas'">
              <v-card-text>Pessoas</v-card-text>
            </div>
            <div v-else>
              <v-card-text>{{ text }}</v-card-text>
            </div>
          </v-card>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>

    <div class="text-xs-center mt-3">
      <v-btn @click.native="next">next tab</v-btn>
    </div>
  </v-app>
</template>
<script>
  import TipoGasto from './TipoGasto';
  import Gasto from './Gasto';
  export default {
    name: 'tabcontrolegasto',
    components: {
      'tab-tipo-gasto': TipoGasto,
      'tab-gasto': Gasto
    },
    data () {
      return {
        tabs: ['Tipo de Gasto','Gastos', 'Pessoas'],
        active: null,
        text: 'inicial'
      }
    },
    methods: {
      next () {
        this.active = this.tabs[(this.tabs.indexOf(this.active) + 1) % this.tabs.length]
      }
    }
  }
</script>
<style>
</style>
