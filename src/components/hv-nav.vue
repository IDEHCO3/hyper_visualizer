<template>
<div>
  <v-navigation-drawer persistent clipped enable-resize-watcher v-model="drawer" app>

  <v-expansion-panel expand dense >
    <v-expansion-panel-content v-for="layer in layers" :key="layer.json.id" class="mb-2">
      <div slot="header">{{ layer.shortName() }}</div>
      <v-card>
        <v-card-actions>
          <v-switch :label="layer.enabled ? 'ATIVO' : 'INATIVO'" v-model="layer.enabled" @change="changeLayerVisibility(layer)" color="cyan"/></v-switch>
          <v-list-tile-action>
            <v-btn icon @click.native="zoomToLayer(layer)">
              <v-icon dark>zoom_in</v-icon>
            </v-btn>
          </v-list-tile-action>
          <v-menu offset-x :close-on-content-click="true" >
            <v-btn icon slot="activator" >
              <v-icon color="indigo accent-4">invert_colors</v-icon>
            </v-btn>
            <v-card dark>
              <v-card-actions>
                <hv-nav-palette :layer="layer" @selectedColor="changeLayerColor"></hv-nav-palette>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-card-actions>

        <transition name="fade">
          <v-expansion-panel popout v-if="layer.optionsLayer.length !== 0">
            <v-expansion-panel-content class="cyan darken-2">
              <div slot="header">Opções Ativas da camada {{ layer.shortName() }}</div>
              <v-list dense>
                <v-list-tile v-for="(activeOption, index) in layer.optionsLayer" :key="index">
                  <v-list-tile-title> {{ activeOption.operationName }} </v-list-tile-title>
                  <v-btn icon @click="removeOperation(activeOption, layer, index)">
                    <v-icon color="red accent-3">delete</v-icon>
                  </v-btn>
                </v-list-tile>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </transition>

        <transition name="fade">
          <v-expansion-panel popout v-show="layer.enabled">
            <v-expansion-panel-content class="cyan darken-2">
              <div slot="header">Opções da camada {{ layer.shortName() }}</div>
              <v-list dense>
                <v-list-tile v-for="(option, index) in layer.options_response.supportedOperations" :key="index">
                  <v-list-tile-title> {{ option['hydra:operation'] }} </v-list-tile-title>

                  <v-menu offset-x :close-on-content-click="false">
                    <v-btn icon slot="activator">
                      <v-icon color="indigo accent-4">layers</v-icon>
                    </v-btn>
                    <v-card dark >
                      <v-card-actions>
                        <input dark type="text" v-model="optionValue" @keyup.enter="addOperation(layer, option['hydra:operation'])"></input>
                        <v-btn icon color="primary" flat @click.native="addOperation(option['hydra:operation'])">
                          <v-icon>input</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>

                </v-list-tile>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </transition>

      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>

  </v-navigation-drawer>
    <v-toolbar class="cyan" fixed clipped-left app>
      <v-toolbar-title >
        <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <input type="text" v-model="urlSearch" placeholder="Enter URL here..." @keyup.enter="urlEntered"> </input>
      <v-btn icon @click.native="urlEntered">
        <v-icon>search</v-icon>
      </v-btn>
    </v-toolbar>
    </div>
</template>

<script>
import { loadLayer } from '../utils/layerUtils.js'
import HvNavPalette from './hv-nav-palette'

export default {
  name: 'hv-nav',
  props: [ 'layers' ],
  components: { HvNavPalette },
  data () {
    return {
      drawer: false,
      urlSearch: '',
      optionValue: ''
    }
  },
  methods: {
    addOperation (layer, operation) {
      const url = `${layer.url}${operation}/${this.optionValue}/`
      const operationName = `Opção: ${operation} / Valor: ${this.optionValue}`

      this.$emit('addOperation', layer, url, operationName)
      this.optionValue = ''
    },
    removeOperation (activeOperation, layer, index) {
      activeOperation.layer.remove()
      layer.optionsLayer.splice(index, 1)
    },
    changeLayerColor (layer, color) {
      layer.leaflet_layer.setStyle({
        weight: 5,
        color: color,
        dashArray: '',
        fillOpacity: 0.5
      })
      layer.style = { "color": color, "weight": 10, "opacity": 0.4 }
    },
    changeLayerVisibility (layer) {
      layer.enabled ? this.$emit('layerVisibility', layer, true) : this.$emit('layerVisibility', layer, false)
    },
    urlEntered () {
      this.urlSearch = this.urlSearch.endsWith('/') ? this.urlSearch : `${this.urlSearch}/`
      this.$emit('urlEntered', this.urlSearch)
      this.urlSearch = ''
    },
    switchLabel (value) {
      return value ? 'Ativo' : 'Inativo'
    },
    zoomToLayer (layer) {
      const layersBounds = layer.leaflet_layer.getBounds()
      this.$emit('zoom', layersBounds)
    }
  }
}
</script>

<style scoped>
  #e3, #e3 .container {
    min-height: 700px;
    overflow: hidden;
    z-index: 0;
  }
  #e3 .input-group__details:after {
    background-color: rgba(255,255,255,0.32) !important;
  }

  #e3 .input-group--focused .input-group__append-icon {
    color: inherit !important;
  }
  input[type=text] {
    width: 50%;
    margin-left: 5px;
    padding: 5px 5px 5px 5px;
    border: none;
    border-bottom: 1px solid white;
    outline: none;
    color: white;
  }

  input[type=text]:focus {
      border-bottom: 1px solid blue;
      color: white;

  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .8s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>