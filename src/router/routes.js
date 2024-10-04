const routes = [
  {
    path: "/AuthLayout",
    component: () => import("layouts/AuthLayout.vue"),
  },
  {
    path: "/",
    component: () => import("layouts/OnBoardingLayout.vue"),
    children: [
      { path: "", component: () => import("pages/OnBoardingPage.vue") },
      {
        path: "/UpdateProfile",
        component: () => import("pages/UpdateProfile.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
