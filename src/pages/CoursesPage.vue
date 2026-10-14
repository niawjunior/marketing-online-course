<script setup lang="ts">
import { computed, ref } from "vue";
import { Search } from "@lucide/vue";
import CourseCard from "@/components/CourseCard.vue";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categories, courses } from "@/data/courses";

const query = ref("");
const category = ref("ทั้งหมด");
const shown = computed(() =>
  courses.filter(
    (c) =>
      (category.value === "ทั้งหมด" || c.category === category.value) &&
      `${c.title} ${c.instructor} ${c.description}`.toLowerCase().includes(query.value.trim().toLowerCase()),
  ),
);
</script>

<template>
  <section class="flex flex-col gap-5">
    <div class="flex flex-wrap items-end gap-3">
      <div class="mr-auto flex flex-col gap-1">
        <h1 class="text-2xl font-semibold tracking-tight">คอร์สเรียน</h1>
        <p class="text-sm text-muted-foreground">{{ courses.length }} คอร์ส จากผู้สอนที่มีประสบการณ์จริงในวงการการตลาด</p>
      </div>
      <div class="relative w-full sm:w-72">
        <Search class="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input v-model="query" placeholder="ค้นหาคอร์สหรือผู้สอน" class="pl-8" />
      </div>
    </div>
    <Tabs v-model="category">
      <div class="-mx-4 overflow-x-auto px-4">
        <TabsList>
          <TabsTrigger value="ทั้งหมด">ทั้งหมด</TabsTrigger>
          <TabsTrigger v-for="c in categories" :key="c" :value="c">{{ c }}</TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <CourseCard v-for="c in shown" :key="c.id" :course="c" />
    </div>
    <p v-if="!shown.length" class="py-12 text-center text-muted-foreground">ไม่พบคอร์สที่ค้นหา</p>
  </section>
</template>
