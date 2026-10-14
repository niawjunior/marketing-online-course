<script setup lang="ts">
import { BookOpen, Clock, Star, Users } from "@lucide/vue";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { courseMinutes, formatMinutes, type Course } from "@/data/courses";
import { courseDone, coursePercent } from "@/lib/progress";

defineProps<{ course: Course }>();
</script>

<template>
  <RouterLink :to="`/courses/${course.id}`" class="group block">
    <Card class="h-full gap-0 overflow-hidden py-0 transition-shadow group-hover:shadow-md">
      <div class="relative flex h-28 items-end bg-gradient-to-br p-4 text-white" :class="course.tone">
        <BookOpen class="absolute top-4 right-4 size-10 opacity-25" />
        <Badge class="border-white/30 bg-white/20 text-white">{{ course.category }}</Badge>
      </div>
      <div class="flex flex-1 flex-col gap-3 p-4">
        <div class="flex flex-col gap-1">
          <h3 class="leading-snug font-semibold group-hover:underline">{{ course.title }}</h3>
          <p class="text-sm text-muted-foreground">{{ course.instructor }}</p>
        </div>
        <div class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span class="flex items-center gap-1"><Clock class="size-3.5" />{{ formatMinutes(courseMinutes(course)) }}</span>
          <span class="flex items-center gap-1"><Users class="size-3.5" />{{ course.students.toLocaleString("th-TH") }} คน</span>
          <span class="flex items-center gap-1"><Star class="size-3.5 fill-amber-400 text-amber-400" />{{ course.rating.toLocaleString("th-TH") }}</span>
          <span>ระดับ{{ course.level }}</span>
        </div>
        <div class="mt-auto flex flex-col gap-1.5">
          <div class="flex justify-between text-xs">
            <span class="text-muted-foreground">เรียนแล้ว {{ courseDone(course) }}/{{ course.lessons.length }} บท</span>
            <span class="font-medium tabular-nums">{{ coursePercent(course) }}%</span>
          </div>
          <Progress :model-value="coursePercent(course)" />
        </div>
      </div>
    </Card>
  </RouterLink>
</template>
