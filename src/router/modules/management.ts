import { RouteRecordRaw } from 'vue-router';
import { LAYOUT } from '@/router/constant';
const management: RouteRecordRaw = {
    path: '/management',
    name: 'Management',
    component: LAYOUT,
    redirect: '/management/product',
    meta: {
        title: '产品管理',
        icon: 'el-icon-folder-opened',
        orderNo: 1,
    },
    children: [
        {
            path: '/management/product',
            name: 'Product',
            component: () => import('@/views/management/management.vue'),
            meta: {
                title: '产品管理',
                icon: 'el-icon-folder-opened'
            }
        },
        {
            path: '/management/modelControl',
            name: 'ModelControl',
            component: () => import('@/views/management/modelControl.vue'),
            meta: {
                title: '模块管理',
                icon: 'el-icon-folder-opened'
            }
        },
        {
            path: '/management/channel',
            name: 'Channel',
            component: () => import('@/views/management/channel.vue'),
            meta: {
                title: '渠道管理',
                icon: 'el-icon-folder-opened'
            }
        },

    ]

}

export default management
