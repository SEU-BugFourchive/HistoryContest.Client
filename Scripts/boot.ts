// import $ from './event.js'
import 'bootstrap';
import Vue from 'vue';
import VueRouter from 'vue-router';
import '../node_modules/font-awesome/css/font-awesome.css';
import 'chartist';
// import 'bootstrap-validator';
Vue.use(VueRouter);
const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/login',
            // redirect:'/ans',
            component: require('./components/login/login.vue.html')
        },
        {
            path: '/ans',
            component: require('./components/ans/ans.vue.html'),
            children: [
                {
                    path: 'sheet',
                    component: require('./components/ans/sheet/ans_sheet.vue.html')
                },
                {
                    path: 'result',
                    component: require('./components/ans/result/ans_result.vue.html')
                }
            ]
        },
        {
            path: '/dashboard',
            component: require('./components/dashboard/dashboard.vue.html'),
            children: [
                {
                    path: 'statistics',
                    component: require('./components/dashboard/statistics/statistics.vue.html')
                },
                {
                    path: 'general',
                    component: require('./components/dashboard/general/general.vue.html')
                }
                //  {
                //      path: 'wiki',
                //      component: null                 }
            ]
        }
    ]
})
// alert(user.role);
if(user.isLoggedIn==false){
    router.push('/login');    
}else if(user.role== "Student"){
    router.push('/ans/sheet')
}else router.push('/dashboard/statistics')
// router.push('./dashboard/statistics');
// import dashboard from './dashboard/dashboard.ts'

new Vue({
    el: '#app-root',
    router,
    render: h => h(require('./components/app/app.vue.html'))
});