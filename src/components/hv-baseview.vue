<template>
  <v-app dark id="inspire">
    <hv-nav @urlEntered="addLayer" @addOperation="addLayer" @layerVisibility="changeLayerVisibility" @removeLayer="removeLayer" @zoom="zoomToLayer" :layers="layers"></hv-nav>
    <div id="map"></div>
  </v-app>
</template>

<script>
import axios from 'axios';
import leaflet from 'leaflet';
import { loadLayer } from '../utils/layerUtils.js'
import HvNav from './hv-nav';

export default {
  components: { HvNav },
  data: () => ({
    drawer: true,
    layers: [],
    map: null
  }),
  methods: {
    addLayer (url, operationName, returnInfo) {
      if (!this.alreadyIncluded(url)) {
        if(returnInfo) {
          axios.get(url).then(res => console.log(res.data))
        } else {
            loadLayer(url).then(res => {
              const layer = res
              layer.operationName = operationName || null
              layer.leaflet_layer.addTo(this.map)
              this.layers.push(layer)
            })
        }
      }
    },
    addOperationLayer (layer, url, operationName) {
      axios.get(url).then(res => {
        console.log(res)
        layer.optionsLayer.push({ layer: L.geoJSON(res.data).addTo(this.map), operationName })
      })
      this.optionValue = '';
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
