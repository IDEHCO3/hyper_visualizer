<template>
  <v-app id="example-1" toolbar footer>
    <v-navigation-drawer persistent v-model="drawer" light   enable-resize-watcher absolute >
      <v-list >
        <v-list-tile v-for="item in items" :key="item.title" @click="selectedItem(item)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed class="indigo darken-4" dark>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Toolbar</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu :nudge-width="100">
          <v-toolbar-title slot="activator">
            <v-btn icon>
                <v-icon>account_circle</v-icon>
            </v-btn>
          </v-toolbar-title>
          <v-list>
            <v-list-tile v-for="user_action in user_actions" :key="user_action.title" @click="selectedAction(user_action.action)">
              <v-list-tile-title v-text="user_action.title"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
    </v-toolbar>
    <main>
      <v-container fluid>
        <!--v-router-->
        <tab-home :showMessage="showLoginOrRegistrar" v-show="items[0].show"></tab-home>
        <tab-tipo-gasto v-show="items[1].show"></tab-tipo-gasto>
        <tab-gasto v-show="items[2].show"></tab-gasto>
        <tab-pessoa v-show="showLogin" v-on:cancelLogin="cancelLoginClicked" v-on:loginOrRegister="loginOrRegisterClicked"></tab-pessoa>

      </v-container>

    </main>
    <v-footer class="indigo">
      <span class="white--text">© 2017</span>
    </v-footer>
  </v-app>
</template>
<script>
import {config} from './config';
import TipoGasto from './TipoGasto';
import Gasto from './Gasto';
import LoginForm from './LoginForm';
import Home from './Home';
  export default {
    components: {
      'tab-tipo-gasto': TipoGasto,
      'tab-gasto': Gasto,
      'tab-pessoa': LoginForm,
      'tab-home': Home
    },
    data () {
      return {
        drawer: true,
        right: null,
        actualItem: null,
        items: [],
        user_actions: [],
        showLogin: false,
        showLoginOrRegistrar: false,
      }
    },
    methods: {
      showSelectedItem() {
        this.showLogin = false;
        this.items.forEach(anItem=>{
            if (this.actualItem == anItem)
              anItem.show = true;
            else
              anItem.show = false;
        });
      },
      selectedItem(an_item) {
        if (config.localstore.get('token') == null)
          return console.log('É preciso estar logado');
        this.actualItem = an_item;
        this.showSelectedItem();
      },
      selectedAction(actionToExecute) {
         return actionToExecute();
      },
      login() {
        this.showLogin = true;
        this.items.forEach(anItem=>{ anItem.show = false;});
      },
      logout() {
        this.cancelLoginClicked();
      },
      configuracoes() {
          alert('configuracoes');
      },
      cancelLoginClicked() {
        config.localstore.remove('token');
        this.actualItem = this.items[0];
        this.showSelectedItem();
        this.showLoginOrRegistrar = true;
      },
      loginOrRegisterClicked(status) {
        //console.log(status);
        this.showLoginOrRegistrar = true;
        if (config.localstore.get('token') != null) {
          this.showLoginOrRegistrar = false;
          this.actualItem =this.items[0];
          this.showSelectedItem();
        }

      }
    },
    created: function () {
      this.items = [ { title: 'Controle de gasto', icon: 'home', show: true }, { title: 'Tipo de Gasto', icon: 'note_add', show: false },
        { title: 'Gasto', icon: 'money', show: false }];
      this.actualItem = this.items[0];
      this.user_actions = [{title: 'Login', action: this.login}, {title: 'Logout', action: this.logout}, { title: 'Configurações', action: this.configuracoes} ]
    }
  }
</script>
