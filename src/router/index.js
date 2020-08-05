import Vue from 'vue'
import VueRouter from 'vue-router'

/**
 * 路由
 */ 
import  InvitationProduction from '@/components/InvitationProduction.vue'
import  test from '@/components/test.vue'


/**
 * 错误路由
 * 
 * 404 找不到页面
 */ 

Vue.use(VueRouter)

const routes = [
    {
        path: '/InvitationProduction',
        name: '邀请函',
        component: InvitationProduction
    },

    {
        path: '/test',
        name: '邀请函',
        component: test
    },


    // 重定向
    {
        path: '/',
        redirect: '/InvitationProduction'
    }
]

export default new VueRouter({
    //路由模式：hash(默认)，history模式

//     mode: 'history',
    routes
})
