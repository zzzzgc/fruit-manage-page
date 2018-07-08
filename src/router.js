import Vue from 'vue'
import Router from 'vue-router'
import {homeUrl} from './common/const.js'
// import Hello from '@/components/Hello'

Vue.use(Router)

const Main = resolve => require(['./components/sys/Home.vue'], resolve)

// 用户
const Login = resolve => require(['./components/sys/login.vue'], resolve)
const Role = resolve => require(['./components/user/roles/Index.vue'], resolve)
const User = resolve => require(['./components/user/users/Index.vue'], resolve)

// 商户
const Customer = resolve => require(['./components/customer/Index.vue'], resolve)

// 商品
const Product = resolve => require(['./components/product/Index.vue'], resolve)
const Banner = resolve => require(['./components/banner/Index.vue'], resolve)
const TypeGroup = resolve => require(['./components/typeGroup/Index.vue'], resolve)
const Type = resolve => require(['./components/type/Index.vue'], resolve)

// 采购
const Procurement = resolve => require(['./components/procurement/plan/Index'], resolve)
const ProcurementDetail = resolve => require(['./components/procurement/plan/detail/Index'], resolve)
const ProcurementQuota = resolve => require(['./components/procurement/quota/Index'], resolve)

// 订单
const Order = resolve => require(['./components/order/Index.vue'], resolve)
const OrderOther = resolve => require(['./components/order/other/Index.vue'], resolve)
const Refund = resolve => require(['./components/order/refund/Index.vue'], resolve)

// 仓库
const WarehousePut = resolve => require(['./components/warehouse/put/Index.vue'], resolve)
const WarehousePutDetail = resolve => require(['./components/warehouse/put/detail/Index.vue'], resolve)
const WarehouseOut = resolve => require(['./components/warehouse/out/Index.vue'], resolve)
const WarehouseOutBusiness = resolve => require(['./components/warehouse/out/business/Index.vue'], resolve)
const WarehouseOutEntertain = resolve => require(['./components/warehouse/out/entertain/Index.vue'], resolve)
const WarehouseInventory = resolve => require(['./components/warehouse/inventory/Index.vue'], resolve)
const WarehouseInventoryDetail = resolve => require(['./components/warehouse/inventory/detail/Index.vue'], resolve)

// 系统
const Dictionaries = resolve => require(['./components/sys/Dictionaries.vue'], resolve)
const Permission = resolve => require(['./components/sys/permission/Permission.vue'], resolve)
const Memu = resolve => require(['./components/sys/menu/Menu.vue'], resolve)
const Home = resolve => require(['./components/Home.vue'], resolve)

// 报表
const SalesMargin = resolve => require(['./components/statement/salesMargin/Index.vue'], resolve)
const ProcurementMargin = resolve => require(['./components/statement/procurementMargin/Index.vue'], resolve)
const Storeout = resolve => require(['./components/statement/storeout/Index.vue'], resolve)
const ProductSaleRankList = resolve => require(['./components/statement/productSaleRankList/Index.vue'], resolve)
const InventoryStatistics = resolve => require(['./components/statement/InventoryStatistics/Index.vue'], resolve)
const ArrearsStatistics = resolve => require(['./components/statement/arrearsStatistics/Index.vue'], resolve)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/',
      name: 'Main',
      component: Main,
      redirect: homeUrl,
      children: [
        {
          path: '/home',
          name: 'Home',
          component: Home
        },
        {
          path: '/product',
          name: 'Product',
          component: Product
        }, {
          path: '/manage/banner',
          name: 'Banner',
          component: Banner
        }, {
          path: '/manage/typeGroup',
          name: 'TypeGroup',
          component: TypeGroup
        }, {
          path: '/manage/type',
          name: 'Type',
          component: Type
        }, {
          path: '/manage/role',
          name: 'Role',
          component: Role
        }, {
          path: '/manage/user',
          name: 'User',
          component: User
        }, {
          path: '/manage/customer',
          name: 'Customer',
          component: Customer
        }, {
          path: '/manage/order',
          name: 'Order',
          component: Order
        }, {
          path: '/manage/order/other/:orderStatus',
          name: 'OrderOther',
          component: OrderOther
        }, {
          path: '/manage/procurement/plan',
          name: 'Procurement',
          component: Procurement
        }, {
          path: '/manage/procurement/quota',
          name: 'ProcurementQuota',
          component: ProcurementQuota
        }, {
          path: '/manage/procurement/procurementDetail',
          name: 'ProcurementDetail',
          component: ProcurementDetail
        }, {
          path: '/manage/warehouse/put',
          name: 'WarehousePut',
          component: WarehousePut
        }, {
          path: '/manage/warehouse/warehousePutDetail',
          name: 'WarehousePutDetail',
          component: WarehousePutDetail
        }, {
          path: '/manage/warehouse/out',
          name: 'WarehouseOut',
          component: WarehouseOut
        }, {
          path: '/manage/warehouse/out/business',
          name: 'WarehouseOutBusiness',
          component: WarehouseOutBusiness
        }, {
          path: '/manage/warehouse/out/entertain',
          name: 'WarehouseOutEntertain',
          component: WarehouseOutEntertain
        }, {
          path: '/manage/warehouse/inventory',
          name: 'WarehouseInventory',
          component: WarehouseInventory
        }, {
          path: '/manage/warehouse/inventory/detail',
          name: 'WarehouseInventoryDetail',
          component: WarehouseInventoryDetail
        }, {
          path: '/manage/dictionaries',
          name: 'Dictionaries',
          component: Dictionaries
        }, {
          path: '/manage/permission',
          name: 'Permission',
          component: Permission
        }, {
          path: '/manage/memu',
          name: 'Memu',
          component: Memu
        }, {
          path: '/manage/statement/storeout',
          name: 'Storeout',
          component: Storeout
        }, {
          path: '/manage/salesMarginStatement',
          name: 'SalesMargin',
          component: SalesMargin
        }, {
          path: '/manage/procurementMarginStatement',
          name: 'ProcurementMargin',
          component: ProcurementMargin
        }, {
          path: '/manage/statement/pSRankList',
          name: 'ProductSaleRankList',
          component: ProductSaleRankList
        }, {
          path: '/manage/statement/InventoryStatistics',
          name: 'InventoryStatistics',
          component: InventoryStatistics
        }, {
          path: '/manage/statement/arrearsStatistics',
          name: 'ArrearsStatistics',
          component: ArrearsStatistics
        }, {
          path: '/manage/order/refund',
          name: 'Refund',
          component: Refund
        }
      ]
    }
  ]
})
