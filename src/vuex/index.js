import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const actions = {
  findModalInfo ({ commit }, url) {
    axios.get(url).then(res => commit('openModal', res.data))
  }
}

const getters = {
  getModal (state) {
    return state.modal
  }
}

const mutations = {
  openModal (state, modalInfo) {
  	state.modal.info = modalInfo
    state.modal.openOrClose = true
  },
  closeModal (state) {
  	state.modal.info = null
  	state.modal.openOrClose = false
  }
}

const state = {
  modal: {
  	openOrClose: false,
  	info: null
  }
}

export default new Vuex.Store({
  actions,
  getters,
  mutations,
  state
})
