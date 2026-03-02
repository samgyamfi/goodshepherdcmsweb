/**
 * Landing Feature Routes
 * Public landing page routes
 */
export default [
  {
    path: '/',
    name: 'home',
    component: () => import('./LandingPage.vue'),
  },
]
