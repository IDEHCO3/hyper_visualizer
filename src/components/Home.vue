<template>
  <v-app>
      <v-parallax src="../static/vbanner.jpg">
        <v-layout column align-center justify-center>
          <h1 class="white--text">Controle de Gasto</h1>
          <h4 class="white--text">Controle seus gastos em qualquer lugar!</h4>
          <h6 class="red--text" v-if="showMessage"> Registre-se ou faça o login para utilizar este app </h6>
        </v-layout>
      </v-parallax>
  </v-app>
</template>
<script>
import {config} from './config';
export default {
  name: 'Home',
  props: ['showMessage'],
}
</script>
