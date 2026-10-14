<script setup lang="ts">
import { computed } from "vue";
import { ArrowRight, Award, BookOpenCheck, Calculator, ClipboardCheck, Flame, Library, BookOpen } from "@lucide/vue";
import CourseCard from "@/components/CourseCard.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { courses } from "@/data/courses";
import { glossary } from "@/data/glossary";
import { quizzes } from "@/data/quizzes";
import { coursePercent, doneCount, inProgress, learnedCount, learner, nextLesson, quizScores } from "@/lib/progress";

const continuing = computed(() => inProgress());
const totalLessons = courses.reduce((s, c) => s + c.lessons.length, 0);
const stats = computed(() => [
  { label: "บทเรียนที่เรียนจบ", value: `${doneCount()}/${totalLessons}`, icon: BookOpenCheck },
  { label: "คอร์สที่กำลังเรียน", value: continuing.value.length, icon: BookOpen },
  { label: "แบบทดสอบที่ผ่าน", value: `${Object.values(quizScores).filter((s) => s >= 60).length}/${quizzes.length}`, icon: Award },
  { label: "เรียนต่อเนื่อง", value: "5 วัน", icon: Flame },
]);
const shortcuts = [
  { to: "/quiz", title: "แบบทดสอบ", text: "ทบทวนความเข้าใจหลังเรียน", icon: ClipboardCheck },
  { to: "/glossary", title: "คลังคำศัพท์", text: `เรียนรู้แล้ว ${learnedCount()} จาก ${glossary.length} คำ`, icon: Library },
  { to: "/tools", title: "เครื่องคำนวณ", text: "คำนวณ ROAS, CPA และ Funnel", icon: Calculator },
];
const today = new Date().toLocaleDateString("th-TH", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
</script>

<template>
  <section class="flex flex-col gap-8">
    <div class="flex flex-col gap-1">
      <p class="text-sm text-muted-foreground">{{ today }}</p>
      <h1 class="text-2xl font-semibold tracking-tight md:text-3xl">สวัสดี {{ learner.name }} 👋</h1>
      <p class="text-muted-foreground">วันนี้เรียนต่ออีกสักบท แล้วลองทำแบบทดสอบดูนะ</p>
    </div>

    <div class="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      <Card v-for="s in stats" :key="s.label" class="gap-2 py-4">
        <CardHeader class="px-4">
          <CardDescription class="flex items-center gap-1.5"><component :is="s.icon" class="size-4" />{{ s.label }}</CardDescription>
          <CardTitle class="text-2xl tabular-nums">{{ s.value }}</CardTitle>
        </CardHeader>
      </Card>
    </div>

    <div v-if="continuing.length" class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">เรียนต่อจากที่ค้างไว้</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <Card v-for="c in continuing.slice(0, 2)" :key="c.id" class="gap-4">
          <CardHeader>
            <CardDescription>{{ c.category }} · {{ c.instructor }}</CardDescription>
            <CardTitle class="leading-snug">{{ c.title }}</CardTitle>
          </CardHeader>
          <CardContent class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <Progress :model-value="coursePercent(c)" class="h-2" />
              <span class="text-sm font-medium tabular-nums">{{ coursePercent(c) }}%</span>
            </div>
            <div class="flex items-center gap-3 rounded-lg bg-muted p-3">
              <BookOpen class="size-8 shrink-0 text-muted-foreground" />
              <div class="min-w-0 flex-1">
                <div class="text-xs text-muted-foreground">บทถัดไป</div>
                <div class="truncate text-sm font-medium">{{ nextLesson(c).title }}</div>
              </div>
              <Button size="sm" as-child><RouterLink :to="`/courses/${c.id}?lesson=${nextLesson(c).id}`">เรียนต่อ</RouterLink></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">คอร์สแนะนำ</h2>
        <Button variant="ghost" size="sm" as-child><RouterLink to="/courses">ดูทั้งหมด <ArrowRight /></RouterLink></Button>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CourseCard v-for="c in courses.slice(0, 3)" :key="c.id" :course="c" />
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
      <RouterLink v-for="s in shortcuts" :key="s.to" :to="s.to" class="group">
        <Card class="h-full gap-0 py-4 transition-colors group-hover:bg-muted/50">
          <CardContent class="flex items-center gap-3 px-4">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted"><component :is="s.icon" class="size-5" /></span>
            <div class="min-w-0 flex-1">
              <div class="font-medium">{{ s.title }}</div>
              <div class="text-sm text-muted-foreground">{{ s.text }}</div>
            </div>
            <ArrowRight class="size-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </RouterLink>
    </div>
  </section>
</template>
