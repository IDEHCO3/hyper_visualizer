<template>
  <v-app height="415px" dark id="e3" standalone >
    <v-navigation-drawer class="pb-0" persistent absolute height="100%" clipped enable-resize-watcher v-model="drawer" >
      <v-list dense >
        <v-subheader class="mt-3 grey--text text--darken-1">CAMADAS</v-subheader>
        <v-list-tile v-for="(layer, index) in layers" :key="index" >
          <v-list-tile-action>
            <v-btn icon @click.native="remove_layer_from_layers(layer)">
              <v-icon dark>delete </v-icon>
            </v-btn>
          </v-list-tile-action>
          <v-list-tile-content>
                <v-switch  v-model="layer.enabled" dark @change="changedCheckbox(layer)"></v-switch>
          </v-list-tile-content>
          <v-list-tile-content>
              {{ layer.short_name()}}
          </v-list-tile-content>
        </v-list-tile>
        <v-subheader class="mt-3 grey--text text--darken-1">SUBSCRIPTIONS</v-subheader>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="cyan">
      <v-toolbar-title>
        <v-btn fab small class="black accent-2" bottom left relative style="margin-top: 30px"  @click.native="optionsBtnClicked" >
            <v-icon>add</v-icon>
        </v-btn>
        <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <input type="text" v-model="urlSearched" placeholder="Enter URL here..." @keyup.enter="urlEntered"> </input>
      <v-btn icon @click.native="searchBtnClicked">
          <v-icon>search</v-icon>
      </v-btn>
    </v-toolbar>
    <main>

          <div id="map" @clike="clickedOnMap"></div>
    </main>

  </v-app>
</template>
<script>
  import axios from 'axios';
  import {Layer} from './options';

  var map;
  function onEachFeature (feature, layer) {
    console.log(feature.properties);
     if (feature.properties && feature.properties.popupContent)
         layer.bindPopup(feature.properties.popupContent);

 };
  export default {

      data: () => ({
        drawer: true,
        json: null,
        urlSearched: '',
        layers: [],
        items: [
          { icon: 'trending_up', text: 'Most Popular' },
          { icon: 'subscriptions', text: 'Subscriptions' },
          { icon: 'history', text: 'History' },
          { icon: 'featured_play_list', text: 'Playlists' },
          { icon: 'watch_later', text: 'Watch Later' }
        ],
        items2: [
          { picture: 28, text: 'Joseph' },
          { picture: 38, text: 'Apple' },
          { picture: 48, text: 'Xbox Ahoy' },
          { picture: 58, text: 'Nokia' },
          { picture: 78, text: 'MKBHD' },
        ]
      }),
      methods: {
        clickedOnMap() {
          alert('alerta');
        },

        add_layer(a_layer) {
          //this.layers.push(a_layer);
          a_layer.leaflet_layer = L.geoJSON().addTo(map);

          a_layer.leaflet_layer.bindPopup();
          a_layer.leaflet_layer.addData(a_layer.json);
          a_layer.leaflet_layer.options.onEachFeature= this.onEachFeature;

        },
        remove_layer(a_layer) {
          a_layer.leaflet_layer.remove();
        },
        remove_layer_from_layers(a_layer) {
          console.log(a_layer);
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
        optionsBtnClicked() {
          console.log('options clicked');
        },
        searchBtnClicked() {
          console.log(this.urlSearched);
          this.loadLayer(this.urlSearched);
        },
        urlEntered(ev) {
            //bus.$emit('urleEntered', ev);
            //"http://127.0.0.1:8000/instituicoes/ibge/bcim/unidades-federativas/ES/"
            let an_url = ev.target.value;
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
                console.log(a_layer);
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
        map = L.map("map",{ renderer: L.svg()}).setView([-44.505, -22.09], 4);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
      }
    }
</script>
<style scoped>
  #map { height: 1300px; }
  #e3, #e3 .con tainer {
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
