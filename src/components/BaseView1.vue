<template>
  <v-app
    height="415px"
    dark
    id="e3"
    standalone
  >
    <v-navigation-drawer
      class="pb-0"
      persistent
      absolute
      height="100%"
      clipped
      enable-resize-watcher
      v-model="drawer"
    >
      <v-list dense >
        <v-list-tile v-for="item in items" :key="item">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-subheader class="mt-3 grey--text text--darken-1">SUBSCRIPTIONS</v-subheader>
        <v-list>
          <v-list-tile v-for="item in items2" :key="item" avatar>
            <v-list-tile-avatar>
              <img :src="`https://randomuser.me/api/portraits/men/${item.picture}.jpg`" alt="">
            </v-list-tile-avatar>
            <v-list-tile-title v-text="item.text"></v-list-tile-title>
          </v-list-tile>
        </v-list>
        <v-list-tile class="mt-3">
          <v-list-tile-action>
            <v-icon class="grey--text text--darken-1">add_circle_outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">Browse Channels</v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon class="grey--text text--darken-1">settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">Manage Subscriptions</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="cyan">
      <v-toolbar-title>
        <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <input type="text" placeholder="Enter URL here..." @keyup.enter="urleEntered"> </input>
    </v-toolbar>
    <main>

            <div id="app" style="height: 1000px">
              <v-map :zoom=6 :center="[-22.413220, -41.219482]">
                <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
                <v-geojson-layer :geojson="geojson" :options="options"></v-geojson-layer>
              </v-map>

            </div>

    </main>

  </v-app>
</template>
<script>
import Vue2Leaflet from 'vue2-leaflet';
import axios from 'axios';
import {bus} from '../main';
  export default {
    components: {
      'v-geojson-layer' :Vue2Leaflet.GeoJSON

    },
      data: () => ({
        drawer: true,
        geojson: null,
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
        urleEntered(ev) {
            bus.$emit('urleEntered', ev);
        }
      },
      created () {
        axios.get("http://127.0.0.1:8000/instituicoes/ibge/bcim/unidades-federativas/ES/").then(response => {
          this.geojson = response.data;
        });
      }
    }
</script>
<style scoped>
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
