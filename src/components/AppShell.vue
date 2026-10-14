<script setup lang="ts">
import { GraduationCap } from "@lucide/vue";
import { useRoute } from "vue-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { learner } from "@/lib/progress";
import { pages } from "@/router";

// The demo's name, said once — on the bar and in the browser's tab.
const appName = "ห้องเรียนการตลาด";
document.title = appName;

const route = useRoute();
const active = (path: string) => (path === "/" ? route.path === "/" : route.path.startsWith(path));
</script>

<template>
  <div class="min-h-dvh bg-background text-foreground">
    <header class="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
      <div class="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <RouterLink to="/" class="flex items-center gap-2 font-semibold">
          <span class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><GraduationCap class="size-4.5" /></span>
          {{ appName }}
        </RouterLink>
        <nav class="hidden gap-1 text-sm md:flex">
          <RouterLink v-for="p in pages" :key="p.path" :to="p.path" class="rounded-md px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" :class="active(p.path) && '!bg-muted !text-foreground'">
            {{ p.name }}
          </RouterLink>
        </nav>
        <div class="ml-auto flex items-center gap-2">
          <div class="hidden text-right text-xs leading-tight sm:block">
            <div class="font-medium">{{ learner.name }}</div>
            <div class="text-muted-foreground">{{ learner.role }}</div>
          </div>
          <Avatar class="size-8"><AvatarFallback class="text-xs">{{ learner.initials }}</AvatarFallback></Avatar>
        </div>
      </div>
      <nav class="flex gap-1 overflow-x-auto border-t px-2 py-1.5 text-sm md:hidden">
        <RouterLink v-for="p in pages" :key="p.path" :to="p.path" class="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-muted-foreground" :class="active(p.path) && '!bg-muted !text-foreground'">
          <component :is="p.icon" class="size-4" />{{ p.name }}
        </RouterLink>
      </nav>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <slot />
    </main>
  </div>
</template>
