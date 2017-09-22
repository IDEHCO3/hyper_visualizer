<template>
  <v-geojson-layer :geojson="geojson" :options="options"></v-geojson-layer>
</template>

<script>
import Vue2Leaflet from 'vue2-leaflet';
  export default {
    components: {
      'v-geojson-layer' :Vue2Leaflet.GeoJSON

    },
    props: ['geojson', 'options'],
    data () {
      return {}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
