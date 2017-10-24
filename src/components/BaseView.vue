<template>
  <v-app dark id="inspire">
    <v-navigation-drawer persistent clipped enable-resize-watcher v-model="drawer" app>
            <v-list dense >
        <v-expansion-panel expand>
          <v-expansion-panel-content>
            <div slot="header">Camadas</div>
              <v-list-tile v-for="(layer, index) in layers" :key="index" class="cyan accent-4" >
                <v-list-tile-action>
                  <v-btn icon @click.native="remove_layer_from_layers(layer)">
                    <v-icon dark>delete </v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-content>
                      <v-switch color="cyan accent-2" v-model="layer.enabled" dark @change="changedCheckbox(layer)"></v-switch>
                </v-list-tile-content>
                <v-list-tile-content>
                    {{ layer.short_name() }}
                </v-list-tile-content>
              </v-list-tile>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-list>

      <v-list dense >
        <v-expansion-panel expand>
          <v-expansion-panel-content>
            <div slot="header">Opções</div>
              <v-expansion-panel expand>
                <v-expansion-panel-content v-for="(layer, index) in layers" :key="index" class="cyan accent-4" >
                  <div slot="header" >{{ layer.short_name() }}</div>
                    <v-list >
                    <v-btn class="ml-5" flat @click.native.stop="removeOption(layer, index)">Excluir Opções
                      <v-icon class="ml-2"color="red darken-2">layers_clear</v-icon>
                    </v-btn>
                      <v-list-tile v-for="(option, optionIndex) in layer.options_response['hydra:supportedOperations']" :key="optionIndex" @click="" class="cyan lighten-1" >
                        <v-list-tile-content>
                          <v-list-tile-title v-text="option['hydra:operation'].toUpperCase()" ></v-list-tile-title>
                        </v-list-tile-content>
 
                        <v-tooltip left>
                          <v-btn icon slot="activator">
                            <v-icon color="cyan lighten-4">info</v-icon>
                          </v-btn>
                          <span v-for="expect in option['hydra:expects']">{{expect}}</span>
                        </v-tooltip>

                        <v-list-tile-action>
                          <v-menu offset-x :close-on-content-click="false" >
                            <v-btn icon slot="activator" >
                              <v-icon color="indigo accent-4">layers</v-icon>
                            </v-btn>
                            <v-card dark >
                              <v-card-actions>
                                <input dark type="text" v-model="optionValue" @keyup.enter="addOption(layer, option['hydra:operation'])"> </input>
                                <v-spacer></v-spacer>
                                <v-btn icon color="primary" flat @click.native="addOption(layer, option['hydra:operation'])">
                                  <v-icon >input</v-icon>
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-menu>
                        </v-list-tile-action>

                      </v-list-tile>
                    </v-list>
                </v-expansion-panel-content>
              </v-expansion-panel>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="cyan" fixed clipped-left app>
      <v-toolbar-title >
        <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <input type="text" v-model="urlSearched" placeholder="Enter URL here..." @keyup.enter="urlEntered"> </input>
      <v-btn icon @click.native="urlEntered">
        <v-icon>search</v-icon>
      </v-btn>
    </v-toolbar>

    <main>
      <v-content>
          <v-layout justify-center align-center>
            <div id="map"></div>
          </v-layout>
      </v-content>
    </main>

  </v-app>
</template>
<script>
  import axios from 'axios';
  import leaflet from 'leaflet';
  import {Layer} from './options';
  import {OptionsLayer} from './options';

  var optionStyle = {
          "color": "#6666ff",
          "weight": 5,
          "opacity": 0.45
      };

  var map;
  function onEachFeature (feature, layer) {

     if (feature.properties) {
       let result = '';
       for (const [property_name, property_value] of Object.entries(feature.properties)) {
         result += "<p>" + property_name + ": " + property_value + "</p>";
       }
       layer.bindPopup(result);
     }
 };
  export default {
      data: () => ({
        drawer: true,
        json: null,
        optionValue: '',
        urlSearched: '',
        layers: [],
      }),
      methods: {

        addOption(layer, option){
          axios.get(`${layer.url}${option}/${this.optionValue}`)
            .then(res => {
              layer.optionsLayer.push(L.geoJSON(res.data, { style: optionStyle }).addTo(map))
            });
          this.optionValue = '';
        },
        removeOption(layer, index){
            for (let i=0; i<layer.optionsLayer.length; i++) {
              this.layers[index].optionsLayer[i].remove();
            };
            this.layers[index].optionsLayer = [];
        },

        add_layerOLD(a_layer) {
          //this.layers.push(a_layer);
          a_layer.leaflet_layer = L.geoJSON().addTo(map);
          a_layer.leaflet_layer.bindPopup();
          a_layer.leaflet_layer.addData(a_layer.json);
          a_layer.leaflet_layer.options.onEachFeature= this.onEachFeature;

        },
        add_layer(a_layer) {
          //this.layers.push(a_layer);
          a_layer.leaflet_layer = L.geoJson(a_layer.json, {onEachFeature: onEachFeature}).addTo(map);

        },
        remove_layer(a_layer) {
          a_layer.leaflet_layer.remove();
        },
        remove_layer_from_layers(a_layer) {
          let index = this.layers.indexOf(a_layer);
          if (index > -1) {
            this.remove_layer(a_layer);
            this.layers.splice(index, 1);
          }
        },
        layers_includes(an_url) {
          let size_of_layers =   this.layers.length
          for (let i=0; i<size_of_layers; i++) {
              if (this.layers[i].url == an_url)
                return true;
          }
          return false;
        },
        urlEntered() {
            //bus.$emit('urleEntered', ev);
            //"http://127.0.0.1:8000/instituicoes/ibge/bcim/unidades-federativas/ES/"
            let an_url = this.urlSearched;
            this.loadLayer(an_url);
        },
        getResource(an_url) {
          return axios.get(an_url);
        },
        optionsResource(an_url) {
          return axios.options(an_url);
        },
        loadLayer(an_url) {
        if (this.layers_includes(an_url))
              return;
        axios.all([this.getResource(an_url), this.optionsResource(an_url)])
              .then(axios.spread((response_get, response_options)=> {
                let a_layer = new Layer();
                a_layer.enabled = true;
                a_layer.json = response_get.data;
                a_layer.url = an_url;
                //L.geoJSON(a_layer.json).addTo(map);
                this.layers.push(a_layer);
                this.add_layer(a_layer);
                a_layer.options_response = response_options.data;

              }))
              .catch(error => {
                console.log(error);
              });
        },
        changedCheckbox(a_layer) {

            if (a_layer.enabled)
              this.add_layer(a_layer);
            else
              this.remove_layer(a_layer);
        }
      },
      mounted() {
        map = L.map("map",{ renderer: L.svg()}).setView([-29.505, -38.09], 4);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
      }
    }
</script>
<style scoped>
  #map { 
    height: 93vh;
    width: 100%;
    position: relative;
    z-index: 0;
  }
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
</style>
