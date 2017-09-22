<template>
<v-app>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar class="indigo text--lighten-2" dark>
          <v-btn icon @click="plusClicked">
             <v-icon >add</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field label="Pesquisar..."  single-line  append-icon="search"  dark ></v-text-field>
        </v-toolbar>

        <form  v-show="showCreateOrUpdateItem">
           <v-text-field  label="Nome" v-model="actualItem.nome" ></v-text-field>
           <v-select label="Tipo de Gasto Genérico" v-model="tipo_gasto_generico_object" :items="tipo_gasto_list" item-text="nome" @blur="blurSelectedItem" ></v-select>
           <v-btn @click="updateOrCreateItem">Confirmar</v-btn>
           <v-btn @click="cancel">Cancelar</v-btn>
       </form>
        <v-list >
          <v-list-tile avatar v-for="(item, index) in items" :key="index" @click="" v-bind:value="item">
            <v-btn  purple lighten-4 icon @click.native="removeItem(item);">
               <v-icon dark> delete </v-icon>
            </v-btn>
            <v-btn  purple lighten-4 icon @click.native="editItem(item)" >
               <v-icon dark> edit </v-icon>
            </v-btn>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.nome" ></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</v-app>
</template>
<script>
import axios from 'axios';
import {config} from './config';

export default {
  name: 'TipoGasto',
  data () {
      return {
        url: 'tipo-gasto-list/',
        item: '',
        items: [],
        nome: "",
        tipo_gasto_generico_object: null,
        tipo_gasto_generico_iri: '',
        tipo_gasto_generico: null,
        tipo_gasto_list: [],
        actualItem: {id: null, nome: '', tipo_gasto_generico: null, tipo_gasto_generico_obj: null},
        showCreateOrUpdateItem: false
      }
    },
    methods: {
      blurSelectedItem() {
        console.log(this.tipo_gasto_generico_object);
        this.actualItem.tipo_gasto_generico_obj = this.tipo_gasto_generico_object;
      },
      clearFieldsForm() {
        this.nome = '';
        this.tipo_gasto_generico = null;
        this.tipo_gasto_list = this.items.slice();
      },
      lastCharIsBar(an_url) {
        if (an_url != null )
          return an_url.slice(-1) == '/';
        return false;
      },
      idFromUrl(an_url) {
        if (an_url == null)
          return -1;
        //console.log(an_url.slice(-1) == '/');
        let i =  this.lastCharIsBar(an_url) ? 1:0;
        return parseInt(an_url.split('/').reverse()[i]);
      },
      get_tipo_gasto_generico_object()  {
        let genericItem = null;
        if (this.actualItem.tipo_gasto_generico == null)
          return null;
        let newid = this.idFromUrl(this.actualItem.tipo_gasto_generico);
        this.items.forEach(function(anItem){
            if (anItem.id == newid) {
                genericItem = anItem;
                return;
            }

        });
        return genericItem;
      },
      plusClicked() {
        this.showCreateOrUpdateItem = true;
        this.actualItem = {id: null, nome: '', tipo_gasto_generico: null };
        this.tipo_gasto_generico_object = null;
      },
      cancel() {
        this.showCreateOrUpdateItem = false;
        this.actualItem = {id: null, nome: '', tipo_gasto_generico: null };
        this.tipo_gasto_generico_object = null;
      },
      updateOrCreateItem() {
        if (this.tipo_gasto_generico_object != null)
          this.actualItem.tipo_gasto_generico = this.url + this.tipo_gasto_generico_object.id;
        if (this.actualItem.id != null)
          this.updateItem();
        else
          this.createItem();
        this.showCreateOrUpdateItem = false;
     },
     newActualItem() {
        return {id: null, nome: '', tipo_gasto_generico: null, tipo_gasto_generico_obj: null};
     },
      createItem() {
        axios.post(this.url, this.actualItem).then( response => {
            if (response.status == 201) {
              this.actualItem.id = this.idFromUrl(response.headers['content-location']);
              this.items.push(this.actualItem);
              this.clearFieldsForm();
              this.actualItem = this.newActualItem();
            }
            console.log(response.status);
          })
        .catch(error => {
          console.log(error);
        });
      },
      updateItem() {
        axios.put(this.url + this.actualItem.id + "/", this.actualItem).then( response => {
            if (response.status == 204)
                this.clearFieldsForm();
            console.log(response.status);
        })
        .catch(error => {
          console.log(error);
        });
      },
      editItem(item) {
          this.actualItem = item;
          this.showCreateOrUpdateItem = true;
          this.tipo_gasto_generico_object = this.get_tipo_gasto_generico_object();
          this.tipo_gasto_list = this.items.filter(tp_gasto=> { return tp_gasto.nome != this.actualItem.nome;});
          //console.log("this.actualItem.tipo_gasto_generico_object:");
          //console.log(this.get_tipo_gasto_generico_object());
      },
      removeItem(item) {
        let index = this.items.indexOf(item);
        axios.delete(this.url + item.id + "/").then( response => {

        })
        .catch(error => {
          console.log(error);
        });
        if (index > -1) {
          this.items.splice(index, 1);
        }
      },
    },
    created: function () {

      this.url = "tipo-gasto-list/";
      axios.get(this.url).then(response => {
              console.log(config.id);
              this.items = response.data;
              config.tipo_gasto_object_list = this.items;
              this.tipo_gasto_list = this.items.slice();

      })
      .catch(error => {
        console.log(error);
      });
    }
}
</script>
<style scoped>
color: black
</style>
