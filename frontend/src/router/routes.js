import Vue from "vue";
import VueRouter from "vue-router";
import DashBoard from "@/components/dashboard/DashBoard.vue";
import PostflowLandingPage from "@/components/PostflowLandingPage.vue";
import CreatePost from "@/components/dashboard/CreatePost.vue";
import SavedPost from "@/components/dashboard/SavedPost.vue";
 import store from "@/store/index.js";
import ConnectSocial from "@/components/dashboard/ConnectSocial.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: PostflowLandingPage,
  },
  {
    path: "/dashboard",
    component: DashBoard,
     meta: { requiredAuth: true }, 
    children: [
      {
        path: "create-post",
        component: CreatePost,
        meta: { requiredAuth: true }, 
      },
      {
        path:'saved-post',
        component:SavedPost,
        meta:{requiredAuth:true},
      },
      {
        path: 'connect-social',
        component: ConnectSocial,   
        meta: { requiredAuth: true },
      }
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.matched.some(record => record.meta.requiredAuth); 
//   const isAuthenticated = store.state.authenticated;
  
  
//   console.log(`[Router Guard] Navigating to: ${to.fullPath}`);
//   console.log(`[Router Guard] requiresAuth: ${requiresAuth}, isAuthenticated: ${isAuthenticated}`);

//   if (requiresAuth && !isAuthenticated) {
//     console.log("[Router Guard] Not authenticated: redirecting to landing page.");
//     next({ path: "/", query: { redirectFrom: to.fullPath } });
//   } else {
//     next();
//   }
// });


router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiredAuth);
  let isAuthenticated = store.state.authenticated;
  const token = store.state.token;

  console.log(`[Router Guard] Navigating to: ${to.fullPath}`);
  console.log(`[Router Guard] requiresAuth: ${requiresAuth}, isAuthenticated: ${isAuthenticated}, token: ${token}`);

  if (requiresAuth && !isAuthenticated && token) {
    try {
      await store.dispatch('validateTokenAndFetchUser', token);
      isAuthenticated = store.state.authenticated; // Update after validation
    } catch (err) {
      console.log('[Router Guard] Token validation failed, redirecting to landing page.');
      next({ path: '/', query: { redirectFrom: to.fullPath } });
      return;
    }
  }

  if (requiresAuth && !isAuthenticated) {
    console.log('[Router Guard] Not authenticated, redirecting to landing page.');
    next({ path: '/', query: { redirectFrom: to.fullPath } });
  } else {
    next();
  }
});

export default router;
