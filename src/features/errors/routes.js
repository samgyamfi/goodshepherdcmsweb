/**
 * Error Feature Routes
 * Error pages and catch-all routes
 */
export default [
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('./NotFoundView.vue'),
  },
]
