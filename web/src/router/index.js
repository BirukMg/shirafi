import Vue from 'vue'
import Router from 'vue-router'
import Intro from '@/pages/Intro'
import Main from '@/pages/Main'
import WritersPost from '@/pages/WritersPost'
import Medias from '@/pages/Medias'
import MediasPost from '@/pages/MediasPost'
import Writers from '@/pages/Writers'
import News from '@/pages/News'
import Sponsorship from '@/pages/Sponsorship'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Intro',
      component: Intro
    },
    {
      path: '/home',
      name: 'Main',
      component: Main,
      children:[
        {
          path: '/writers post',
          name: 'Writers',
          component: WritersPost
        },
        {
          path: '/medias',
          name: 'Medias',
          component: Medias
        },
        {
          path: '/writers',
          name: 'Writers',
          component: Writers
        },
        {
          path: '/media post',
          name: 'MediasPost',
          component: MediasPost
        },
        {
          path: '/news',
          name: 'News',
          component: News
        },
        {
          path: '/sponsorship',
          name: 'Sponsorship',
          component: Sponsorship
        }
      ]
    }
  ]
})
