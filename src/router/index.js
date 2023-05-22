import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/HelloWorld';
// import aboutMe from '@/components/ProjectMain/aboutMe';
// import HomePageInfo from '@/components/ProjectMain/HomePageInfo';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/:id',
      name: 'Home',
      component: Home,
      children: [
        // {
        //   path: 'aboutMe',
        //   name: 'aboutMe',
        //   component: aboutMe
        // },
        // {
        //   path: 'HomePageInfo',
        //   name: 'HomePageInfo',
        //   component: HomePageInfo
        // }
      ]
    }
  ]
});
