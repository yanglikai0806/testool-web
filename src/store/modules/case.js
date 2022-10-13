import Vue from "vue"

const state = {
  table:"test_cases"
}

const mutations = {
  // 当前选中的用例数据表
  SET_CASE_TABLE: (state, table) => {
    Vue.set(state, "table", table)
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
