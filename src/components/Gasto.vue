<template>
  <v-app>
    <v-layout row>
      <v-flex sm12>
        <v-toolbar class="indigo text--lighten-2" dark>
          <v-btn icon @click="plusClicked">
             <v-icon class="black--text" >add</v-icon>
          </v-btn>
          <v-btn icon class="black--text" >
            <v-icon>more_vert</v-icon>
          </v-btn>

          <v-flex xs12 sm6 >
            <v-menu lazy  :close-on-content-click="true"  v-model="menu_data_inicial"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
              <v-text-field slot="activator" label="Data inicial de pesquisa" v-model="data_inicial" prepend-icon="event" readonly ></v-text-field>
              <v-date-picker  v-model="data_inicial" no-title scrollable actions>
              </v-date-picker>
            </v-menu>
         </v-flex>

         <v-flex xs12 sm6 class="white--text">
           <v-menu lazy    :close-on-content-click="true"  v-model="menu_data_final"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
             <v-text-field slot="activator" label="Data final de pesquisa" v-model="data_final" prepend-icon="event" readonly ></v-text-field>
             <v-date-picker v-model="data_final" no-title scrollable actions>
             </v-date-picker>
           </v-menu>
        </v-flex>
        <v-btn icon @click="searchGastoBetweenDatesClicked">
           <v-icon class="black--text" >search</v-icon>
        </v-btn>
        </v-toolbar>
        <form  v-show="showCreateOrUpdateItem">
           <v-select label="Tipo de Gasto" v-model="tipo_gasto_object" :items="tipo_gasto_list" item-text="nome" @blur="blurSelectedItem" required></v-select>
           <v-flex xs12 sm6>
             <v-menu lazy  :close-on-content-click="true"  v-model="menu"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
               <v-text-field slot="activator" label="Escolha a data no menu" v-model="uma_data" prepend-icon="event" readonly ></v-text-field>
               <v-date-picker v-model="uma_data" no-title scrollable actions>
               </v-date-picker>
             </v-menu>
          </v-flex>
           <v-text-field label="Valor" v-model="um_valor"  required ></v-text-field>
           <v-text-field label="Detalhe" v-model="um_detalhe"  required ></v-text-field>
           <v-btn @click="updateOrCreateItem">Confirmar</v-btn>
           <v-btn @click="cancelarItem">Cancelar</v-btn>
       </form>
        <v-data-table v-model="selected" v-bind:headers="headers" v-bind:items="items"  select-all v-bind:pagination.sync="pagination" selected-key="name" class="elevation-1">
          <template slot="headers" scope="props">
            <tr>
              <th>
                <v-checkbox primary hide-details @click.native="toggleAll" :input-value="props.all" :indeterminate="props.indeterminate"></v-checkbox>
              </th>
              <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']" @click="changeSort(header.value)">
                <v-icon>arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template slot="items" scope="props">
            <tr :active="props.selected" @click="props.selected = !props.selected">
              <td>
                <v-checkbox primary  hide-details :input-value="props.selected"></v-checkbox>
              </td>
              <td>
                <v-btn  purple lighten-4 icon @click.native="removeItem(props.item);">
                   <v-icon dark> delete </v-icon>
                </v-btn>
              </td>
              <td>
                <v-btn  purple lighten-4 icon @click.native="editItem(props.item)" >
                   <v-icon dark> edit </v-icon>
                </v-btn>
              </td>
              <td class="text-xs-right">{{ tipo_gasto_description(props.item.tipo_gasto) }}</td>
              <td class="text-xs-right">{{ props.item.data }}</td>
              <td class="text-xs-right">{{ props.item.valor }}</td>
              <td class="text-xs-right">{{ props.item.usuario }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex >
    </v-layout>
  </v-app>
</template>
<script>
  import axios from 'axios';
  import {config} from './config';
  import DatePicker from './DatePicker';
  export default {
    name: 'Gasto',
    components: {
      'app-datepicker': DatePicker,
    },
    data () {
      return {
        pagination: {
         sortBy: 'valor'
       },
       url: '',
       uma_data: null,
       um_valor: null,
       um_detalhe: null,
       tipo_gasto_list_url: '',
       menu_data_inicial: false,
       data_inicial: null,
       menu_data_final: false,
       data_final: null,
       menu: false,
       modal: false,
       selected: [],
       showCreateOrUpdateItem: false,
       tipo_gasto_object: '',
       tipo_gasto_list: [],
       actualItem: {},
        headers: [
          { text: 'Excluir', value: 'excluir'},
          { text: 'Editar', value: 'editar'},
          { text: 'Tipo de gasto', value: 'tipo_de_gasto'},
          { text: 'Data', value: 'data' },
          { text: 'Valor', value: 'valor' },
          { text: 'Usuário', value: 'usuario' },
        ],
        items: [],
      }
    },
    methods: {
      blurSelectedItem() {
        //console.log(this.tipo_gasto_object);
        this.actualItem.tipo_gasto = axios.defaults.baseURL + this.tipo_gasto_list_url + this.tipo_gasto_object.id;
      },
      toggleAll () {
        if (this.selected.length) this.selected = [];
        else this.selected = this.items.slice();
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending;
        } else {
          this.pagination.sortBy = column;
          this.pagination.descending = false;
        }
      },
      tipo_gasto_description(a_tipo_gasto) {
        //console.log(a_tipo_gasto);
        let newid = this.idFromUrl(a_tipo_gasto);
        let description = null;
        this.tipo_gasto_list.forEach(anItem=>{
            if (anItem.id == newid) {
                description = anItem.nome;
                return anItem.nome;

            }
        });
        return description;
      },
      get_tipo_gasto_object()  {
        let tp_gasto = null;
        if (this.actualItem.tipo_gasto == null)
          return null;
        let newid = this.idFromUrl(this.actualItem.tipo_gasto);
        this.tipo_gasto_list.forEach(anItem=>{
            if (anItem.id == newid) {
              tp_gasto = anItem;
              return tp_gasto;
            }
        });
        return tp_gasto;
      },
      idFromUrl(an_url) {
        return parseInt(an_url.split('/').reverse()[0]);
      },
      plusClicked() {
        this.clearFormFields();
        this.showCreateOrUpdateItem = true;
      },
      clearFormFields() {
        this.uma_data = null;
        this.um_valor = null;
        this.um_detalhe = null;
        this.tipo_gasto_object = null;
      },
      populateActualItem() {
        //this.tipo_gasto_object = this.get_tipo_gasto_object();
        this.actualItem.data = this.uma_data;
        this.actualItem.valor = this.um_valor;
        this.actualItem.tipo_gasto = axios.defaults.baseURL + this.tipo_gasto_list_url + this.tipo_gasto_object.id;
        this.actualItem.detalhe = this.um_detalhe;
      },
      populateFormWithActualItem() {
        this.uma_data = this.actualItem.data;
        this.um_valor = this.actualItem.valor;
        this.tipo_gasto_object = this.get_tipo_gasto_object();
        this.um_detalhe = this.actualItem.detalhe;
      },
      updateOrCreateItem() {
        this.populateActualItem();
        if (this.actualItem.id != null)
          return this.updateItem();
        this.createItem();
     },
      createItem() {
        axios.post(this.url, this.actualItem).then( response => {
            if (response.status == 201) {
              this.actualItem.id = this.idFromUrl(response.headers['content-location']);
              this.items.push(this.actualItem);
              this.clearFormFields();
              this.actualItem = {};
              this.showCreateOrUpdateItem = false;
            }
          })
        .catch(error => {
          console.log(error);
        });
      },
      updateItem() {
        //this.actualItem.tipo_gasto = this.tipo_gasto_list_url + this.tipo_gasto_object.id +'/';
        axios.put(this.url + this.actualItem.id + "/", this.actualItem).then( response => {
            if (response.status == 204)
                this.clearFormFields();
                this.showCreateOrUpdateItem = false;
        })
        .catch(error => {
          console.log(error);
        });
      },
      editItem(item) {
          this.actualItem = item;
          this.populateFormWithActualItem();
          this.showCreateOrUpdateItem = true;
          //this.tipo_gasto_object = this.get_tipo_gasto_object();
          //console.log(this.tipo_gasto_object);

      },
      removeItem(item) {
        let index = this.items.indexOf(item);
        axios.delete(this.url + item.id + "/").then( response => {
            console.log('deleted: '+ index);
            if (index > -1)
              this.items.splice(index, 1);
        })
        .catch(error => {
          console.log(error);
        });
      },
      salvarItem() {
        this.updateOrCreateItem();
        this.showCreateOrUpdateItem = false;
        this.actualItem = {};
      },
      cancelarItem() {
        this.actualItem = {};
        this.showCreateOrUpdateItem = false;
      },
      getAllGastos() {
        return axios.get(this.url);
      },
      getAllGastosBetweenDates() {
        let filter= 'filter/data/between/' + this.data_inicial + '&' + this.data_final + '/';
        console.log(this.url + filter);
        return axios.get(this.url + filter);
      },
      getAllTipoGasto() {
        return axios.get(this.tipo_gasto_list_url);
      },
      firstDateOfMonth() {
        let  date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        return this.formatDate(firstDay);
      },
      lastDateOfMonth() {
        let  date = new Date();
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return this.formatDate(lastDay);
      },
      formatDate(a_date) {
          let newDate = new Date(a_date),
              year = newDate.getFullYear(),
              month = '' + (newDate.getMonth() + 1),
              day = '' + newDate.getDate();
          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;
          return [year, month, day].join('-');
      },
      searchGastoBetweenDatesClicked() {
          this.getAllGastosBetweenDates().then(response => {
              this.items = response.data;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    created: function () {
      this.url = "gasto-list/";
      this.tipo_gasto_list_url = "tipo-gasto-list/";
      this.actualItem = {};
      this.data_inicial = this.firstDateOfMonth();
      this.data_final = this.lastDateOfMonth();
      axios.all([this.getAllGastosBetweenDates(), this.getAllTipoGasto()])
        .then(axios.spread((response_gastos, response_tipos)=> {
          this.items = response_gastos.data;
          this.tipo_gasto_list = config.tipo_gasto_object_list;
        }))
        .catch(error => {
          console.log(error);
        })
    }
  }
</script>
