const routes = [
  {
    path: "/",
    component: () => import("layouts/LoginLayout.vue"),
    children: [{ path: "", component: () => import("pages/LoginPage.vue") }],
  },
  {
    path: "/principal",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "facturar", component: () => import("pages/FacturarPage.vue") },
      { path: "login2", component: () => import("src/pages/LoginPage.vue") },
    ],
  },

  // {
  //   path: "/",
  //   component: () => import("layouts/LoginLayout.vue"),
  //   children: [{ path: "", component: () => import("pages/LoginPage.vue") }],
  // },
  // {
  //   path: "/",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     { path: "", component: () => import("pages/FacturarPage.vue") },
  //     { path: "facturar", component: () => import("pages/FacturarPage.vue") },
  //     { path: "login2", component: () => import("src/pages/LoginPage.vue") },
  //   ],
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
