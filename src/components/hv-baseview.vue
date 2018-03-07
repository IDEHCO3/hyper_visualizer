<template>
  <v-app dark id="inspire">
    <hv-nav @urlEntered="addLayer" @addOperation="addLayer" @layerVisibility="changeLayerVisibility" @removeLayer="removeLayer" @zoom="zoomToLayer" :layers="layers"></hv-nav>
    <hv-modal/>
    <div id="map"></div>
  </v-app>
</template>

<script>
import axios from 'axios'
import leaflet from 'leaflet'
import { loadLayer } from '../utils/layerUtils.js'
import HvModal from './hv-modal'
import HvNav from './hv-nav'

export default {
  components: { HvModal, HvNav },
  data: () => ({
    drawer: true,
    layers: [],
    map: null
  }),
  methods: {
    addLayer (url, operationName) {
      if (!this.alreadyIncluded(url)) {
        loadLayer(url).then(res => {
          const layer = res
          layer.operationName = operationName || null
          layer.leaflet_layer.addTo(this.map)
          this.layers.push(layer)
        })
      }
    },
    alreadyIncluded (url) {
      return this.layers.some(layer => layer.url === url)
    },
    changeLayerVisibility (layer, visible) {
      visible ? layer.leaflet_layer.addTo(this.map) : layer.leaflet_layer.remove()
    },
    removeLayer (index) {
      this.layers.splice(index, 1)
    },
    zoomToLayer (layersBounds) {
      this.map.fitBounds(layersBounds)
    }
  },
  mounted () {
    this.map = L.map("map",{ renderer: L.svg()}).setView([-29.505, -38.09], 4);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    const bounds = new L.LatLngBounds(new L.LatLng(-38, -70), new L.LatLng(0, -30));
    this.map.fitBounds(bounds);
    L.control.coordinates({
      position:'bottomright',
      decimals:2,
			decimalSeperator:',',
			labelTemplateLat:'Latitude: {y}',
			labelTemplateLng:'Longitude: {x}',
      useLatLngOrder:true
    }).addTo(this.map);
  }
}
</script>
<style scoped>
  #map {
    height: 94vh;
    width: 100%;
    position: absolute;
    bottom: 0px;
    z-index: 0;
  }
</style>
