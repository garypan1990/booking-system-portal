import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/Index';
import MemberProfile from '@/components/MemberProfile';
// import aboutMe from '@/components/ProjectMain/aboutMe';
// import HomePageInfo from '@/components/ProjectMain/HomePageInfo';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
      // children: [
      //   {
      //     path: ':memberId',
      //     name: 'MemberProfile',
      //     component: MemberProfile
      //   }
      // ]
    },
    {
      path: '/index/:memberId',
      name: 'MemberProfile',
      component: MemberProfile
    }
  ]
});
