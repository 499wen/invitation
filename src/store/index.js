import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userList: [] // 选中的人员信息
    },
    mutations: {
        editUserList(state, payload){
            state.userList = payload
        }
    }
})