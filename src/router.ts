import { createRouter, createWebHistory } from "vue-router";
import { BookOpen, Calculator, ClipboardCheck, House, Library } from "@lucide/vue";

// Each page of the demo: a path, its name in the menu, its icon, the page itself.
export const pages = [
  { path: "/", name: "หน้าแรก", icon: House, component: () => import("./pages/HomePage.vue") },
  { path: "/courses", name: "คอร์สเรียน", icon: BookOpen, component: () => import("./pages/CoursesPage.vue") },
  { path: "/quiz", name: "แบบทดสอบ", icon: ClipboardCheck, component: () => import("./pages/QuizPage.vue") },
  { path: "/glossary", name: "คลังคำศัพท์", icon: Library, component: () => import("./pages/GlossaryPage.vue") },
  { path: "/tools", name: "เครื่องคำนวณ", icon: Calculator, component: () => import("./pages/ToolsPage.vue") },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...pages,
    { path: "/courses/:id", component: () => import("./pages/CoursePage.vue") },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior: (to, from) => (to.path === from.path ? undefined : { top: 0 }),
});
