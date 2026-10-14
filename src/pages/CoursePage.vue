<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, ClipboardCheck, Clock, FileText, Lightbulb, Star, Users } from "@lucide/vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { articles } from "@/data/articles";
import { courseMinutes, findCourse, formatMinutes, type Lesson } from "@/data/courses";
import { quizzes } from "@/data/quizzes";
import { courseDone, coursePercent, isDone, markDone, nextLesson } from "@/lib/progress";

const route = useRoute();
const router = useRouter();
const course = computed(() => findCourse(String(route.params.id)));
const lesson = computed<Lesson | undefined>(() => {
  const c = course.value;
  if (!c) return undefined;
  return c.lessons.find((l) => l.id === route.query.lesson) ?? nextLesson(c);
});
const index = computed(() => (course.value && lesson.value ? course.value.lessons.indexOf(lesson.value) : 0));
const quiz = computed(() => quizzes.find((q) => q.courseId === course.value?.id));
const article = computed(() => (lesson.value ? (articles[lesson.value.id] ?? []) : []));

function open(l: Lesson): void {
  router.replace({ query: { lesson: l.id } });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function finish(): void {
  const c = course.value;
  const l = lesson.value;
  if (!c || !l) return;
  markDone(l.id);
  const next = c.lessons[index.value + 1];
  if (courseDone(c) === c.lessons.length) {
    toast.success("ยินดีด้วย! คุณเรียนจบคอร์สนี้แล้ว 🎉", { description: quiz.value ? "ลองทำแบบทดสอบเพื่อทบทวนความเข้าใจ" : undefined });
  } else {
    toast.success(`เรียนจบบท “${l.title}” แล้ว`);
  }
  if (next) open(next);
}
</script>

<template>
  <section v-if="course && lesson" class="flex flex-col gap-6">
    <div class="flex flex-col gap-3">
      <Button variant="ghost" size="sm" class="-ml-2 self-start" as-child><RouterLink to="/courses"><ArrowLeft /> คอร์สทั้งหมด</RouterLink></Button>
      <div class="overflow-hidden rounded-xl bg-gradient-to-br p-5 text-white md:p-7" :class="course.tone">
        <div class="flex flex-wrap gap-2">
          <Badge class="border-white/30 bg-white/20 text-white">{{ course.category }}</Badge>
          <Badge class="border-white/30 bg-white/20 text-white">ระดับ{{ course.level }}</Badge>
        </div>
        <h1 class="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{{ course.title }}</h1>
        <p class="mt-2 max-w-3xl text-white/90">{{ course.description }}</p>
        <div class="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/90">
          <span>{{ course.instructor }} · {{ course.instructorRole }}</span>
          <span class="flex items-center gap-1"><Users class="size-4" />{{ course.students.toLocaleString("th-TH") }} คน</span>
          <span class="flex items-center gap-1"><Star class="size-4 fill-white" />{{ course.rating.toLocaleString("th-TH") }}</span>
          <span>{{ course.lessons.length }} บท · {{ formatMinutes(courseMinutes(course)) }}</span>
        </div>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div class="flex min-w-0 flex-col gap-5">
        <article class="flex flex-col gap-6">
          <header class="flex flex-col gap-3 border-b pb-6">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span class="flex items-center gap-1.5"><FileText class="size-4" />บทความ · บทที่ {{ index + 1 }} จาก {{ course.lessons.length }}</span>
              <span class="flex items-center gap-1.5"><Clock class="size-4" />อ่านประมาณ {{ lesson.minutes }} นาที</span>
            </div>
            <h2 class="text-2xl font-semibold tracking-tight md:text-3xl">{{ lesson.title }}</h2>
            <p class="text-lg leading-relaxed text-muted-foreground">{{ lesson.summary }}</p>
            <p class="text-sm text-muted-foreground">เขียนโดย {{ course.instructor }}</p>
          </header>
          <section v-for="sec in article" :key="sec.heading" class="flex flex-col gap-3">
            <h3 class="text-lg font-semibold">{{ sec.heading }}</h3>
            <p v-for="para in sec.paragraphs" :key="para" class="leading-loose">{{ para }}</p>
          </section>
        </article>

        <Card class="gap-3">
          <CardHeader><CardTitle class="text-base">สรุปประเด็นสำคัญ</CardTitle></CardHeader>
          <CardContent>
            <ul class="flex flex-col gap-2.5">
              <li v-for="p in lesson.points" :key="p" class="flex gap-2.5"><CheckCircle2 class="mt-0.5 size-4.5 shrink-0 text-emerald-600" />{{ p }}</li>
            </ul>
          </CardContent>
        </Card>

        <div v-if="lesson.example" class="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <Lightbulb class="mt-0.5 size-5 shrink-0 text-amber-600" />
          <div><div class="mb-1 font-medium">กรณีศึกษา</div><p class="text-sm leading-relaxed">{{ lesson.example }}</p></div>
        </div>

        <div class="flex flex-wrap items-center gap-2 border-t pt-5">
          <Button variant="outline" :disabled="index === 0" @click="open(course.lessons[index - 1]!)"><ArrowLeft /> บทก่อนหน้า</Button>
          <div class="ml-auto flex gap-2">
            <Button v-if="!isDone(lesson.id)" @click="finish"><CheckCircle2 /> เรียนจบบทนี้</Button>
            <Button v-else-if="index < course.lessons.length - 1" @click="open(course.lessons[index + 1]!)">บทถัดไป <ArrowRight /></Button>
            <Button v-else-if="quiz" as-child><RouterLink :to="`/quiz?id=${quiz.id}`"><ClipboardCheck /> ทำแบบทดสอบ</RouterLink></Button>
          </div>
        </div>
      </div>

      <aside class="flex flex-col gap-4">
        <Card class="gap-3">
          <CardHeader>
            <CardTitle class="text-base">เนื้อหาคอร์ส</CardTitle>
            <div class="flex items-center gap-3 pt-1">
              <Progress :model-value="coursePercent(course)" class="h-2" />
              <span class="text-sm font-medium tabular-nums">{{ coursePercent(course) }}%</span>
            </div>
          </CardHeader>
          <CardContent class="flex flex-col gap-1 px-2">
            <button
              v-for="(l, i) in course.lessons"
              :key="l.id"
              class="flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-muted"
              :class="l.id === lesson.id && 'bg-muted'"
              @click="open(l)"
            >
              <CheckCircle2 v-if="isDone(l.id)" class="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <Circle v-else class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span class="flex-1">
                <span class="block" :class="l.id === lesson.id && 'font-medium'">{{ i + 1 }}. {{ l.title }}</span>
                <span class="text-xs text-muted-foreground">บทความ · อ่าน {{ l.minutes }} นาที</span>
              </span>
            </button>
          </CardContent>
        </Card>
        <Card class="gap-3">
          <CardHeader><CardTitle class="text-base">เรียนจบแล้วจะทำได้</CardTitle></CardHeader>
          <CardContent>
            <ul class="flex flex-col gap-2 text-sm">
              <li v-for="o in course.outcomes" :key="o" class="flex gap-2"><CheckCircle2 class="mt-0.5 size-4 shrink-0 text-muted-foreground" />{{ o }}</li>
            </ul>
          </CardContent>
        </Card>
        <Card v-if="quiz" class="gap-3">
          <CardHeader><CardTitle class="text-base">{{ quiz.title }}</CardTitle></CardHeader>
          <CardContent class="flex flex-col gap-3">
            <p class="text-sm text-muted-foreground">{{ quiz.questions.length }} ข้อ · {{ quiz.description }}</p>
            <Button variant="outline" as-child><RouterLink :to="`/quiz?id=${quiz.id}`"><ClipboardCheck /> ทำแบบทดสอบ</RouterLink></Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  </section>
  <section v-else class="flex flex-col items-center gap-4 py-20 text-center">
    <p class="text-muted-foreground">ไม่พบคอร์สนี้</p>
    <Button as-child><RouterLink to="/courses">กลับไปหน้าคอร์สเรียน</RouterLink></Button>
  </section>
</template>
