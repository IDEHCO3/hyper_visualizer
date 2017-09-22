<template>
  <v-app>
    <main>
      <v-container fluid>
        <v-flex xs12 md6 offset-md3>
          <v-card>
            <v-toolbar class="indigo" dark>
            <v-toolbar-title>{{title}}</v-toolbar-title>
          </v-toolbar>
        <form>
          <template v-if="showRegistrar">
            <v-text-field  label="Nome" class="mt-5" v-model="pessoa.nome"   required ></v-text-field>
          </template>
           <v-text-field  label="Nome do usuário" v-model="pessoa.nome_usuario"  required ></v-text-field>
           <template v-if="showRegistrar">
             <v-flex xs12>
                <v-text-field label="E-mail" v-model="pessoa.email" :rules="[rules.required, rules.email]"></v-text-field>
              </v-flex>
             <v-menu lazy  :close-on-content-click="true"  v-model="menu"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
               <v-text-field slot="activator" label="Data de nascimento" v-model="pessoa.data_nascimento" prepend-icon="event" readonly ></v-text-field>
               <v-date-picker v-model="pessoa.data_nascimento" no-title scrollable actions>
               </v-date-picker>
             </v-menu>
          </template>
          <v-flex xs8>
            <v-text-field name="input-10-2" label="Informe a senha" v-model="pessoa.senha" hint="No mínimo 8 caracteres"  min="8"  append-icon="visibility_off" type="password"  class="input-group--focused"  :rules="[() => pessoa.senha > 0 || 'Campo obrigatório']" required></v-text-field>
          </v-flex>
          <template v-if="showRegistrar">
            <v-flex xs8>
              <v-text-field name="input-10-3" label="Informe a senha novamente" v-model="pessoa.senha_novamente"  append-icon="visibility_off" type="password"  class="input-group--focused" @blur="blurNewPassword"></v-text-field>
              <p class="red" v-show="isNewpasswordNotEqualpassword">As senhas informadas não são idênticas</p>
            </v-flex>
          </template >
          <v-checkbox label="Registre-se" v-model="showRegistrar" ></v-checkbox>
          <v-btn @click="loginOrRegister">Confirmar</v-btn>
          <v-btn @click="cancel">Cancelar</v-btn>
       </form>
     </v-card>
     </v-flex >
      </v-container>
    </main>
    <v-footer></v-footer>
  </v-app>
</template>
<script>
import axios from 'axios';
import {config} from './config';
  export default {
    name: 'PessoaForm',
    data () {
        return {
          fi: '',
          pessoa: { nome: '', nome_usuario: '', email: null, senha: null, senha_novamente: null, data_nascimento: null,  avatar: null},
          showRegistrar: false,
          menu: false,
          modal: false,
          title: 'Login/Registro',
          isNewpasswordNotEqualpassword: false,
          rules: {
            required: (value) => !!value || 'Required.',
            email: (value) => {
              const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              return pattern.test(value) || 'Invalid e-mail.'
            }
          }

        }
    },
    methods: {
      blurNewPassword() {
        if (this.pessoa.senha==this.pessoa.senha_novamente)
          this.isNewpasswordNotEqualpassword = false;
        else
          this.isNewpasswordNotEqualpassword = true;
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
      loginOrRegister() {
        let url = '';
        if (this.showRegistrar) {
          url = 'usuario-list/registro/';
          if  (!(this.pessoa.senha.length > 0 && this.pessoa.senha == this.pessoa.senha_novamente)) {
            this.isNewpasswordNotEqualpassword = true;
            return;
          }
        } else
          url = 'usuario-list/login/';

        axios.post(url, this.pessoa).then( response => {
          this.title= 'Login/Registro';
            if (response.status == 201) {
              this.pessoa.id = this.idFromUrl(response.headers['content-location']);
              config.localstore.set('token', response.headers['x-access-token']);

            }
            this.$emit('loginOrRegister', response.status);
            console.log(response.status);
            this.showRegistrar = false;
          })
        .catch(error => {
          this.title= 'Login ou senha incorreta';
          console.log(error);
          this.$emit('loginOrRegister', error);
        });

      },
      cancel(){
       this.pessoa= { nome: '', nome_usuario: '', email: null, password: null, new_password: null, data_nascimento: null,  avatar: null}
       this.$emit('cancelLogin');
     }
    }
  }
</script>
