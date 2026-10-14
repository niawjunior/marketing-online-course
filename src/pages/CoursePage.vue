<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, ClipboardCheck, FileText, Lightbulb, Pause, Play, Star, Users, Wrench } from "@lucide/vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { courseMinutes, findCourse, formatMinutes, kindLabel, type Lesson } from "@/data/courses";
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
const kindIcon = { video: Play, article: FileText, workshop: Wrench };

// A pretend player: pressing play runs a bar, so the demo feels alive without a real video.
const playing = ref(false);
const played = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;
function togglePlay(): void {
  playing.value = !playing.value;
  clearInterval(timer);
  if (playing.value) timer = setInterval(() => (played.value = Math.min(100, played.value + 1)), 120);
}
watch(lesson, () => {
  playing.value = false;
  played.value = 0;
  clearInterval(timer);
});

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
        <div class="relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-xl bg-zinc-900 bg-gradient-to-br text-white" :class="lesson.kind === 'video' ? '' : course.tone">
          <template v-if="lesson.kind === 'video'">
            <button class="flex size-16 items-center justify-center rounded-full bg-white/15 backdrop-blur transition hover:bg-white/25" :aria-label="playing ? 'หยุด' : 'เล่น'" @click="togglePlay">
              <Pause v-if="playing" class="size-7" /><Play v-else class="ml-1 size-7" />
            </button>
            <p class="mt-3 px-6 text-center text-sm text-white/80">บทที่ {{ index + 1 }} · {{ lesson.title }}</p>
            <div class="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-black/40 px-4 py-2 text-xs">
              <span class="tabular-nums">{{ Math.floor((lesson.minutes * played) / 100) }}:{{ String(Math.floor(((lesson.minutes * played * 60) / 100) % 60)).padStart(2, "0") }}</span>
              <div class="h-1 flex-1 rounded-full bg-white/25"><div class="h-1 rounded-full bg-white transition-all" :style="{ width: `${played}%` }" /></div>
              <span class="tabular-nums">{{ lesson.minutes }}:00</span>
            </div>
          </template>
          <template v-else>
            <component :is="kindIcon[lesson.kind]" class="size-12 opacity-80" />
            <p class="mt-3 text-sm font-medium">{{ kindLabel[lesson.kind] }} · อ่านประมาณ {{ lesson.minutes }} นาที</p>
          </template>
        </div>

        <div class="flex flex-col gap-2">
          <p class="text-sm text-muted-foreground">บทที่ {{ index + 1 }} จาก {{ course.lessons.length }} · {{ kindLabel[lesson.kind] }} {{ lesson.minutes }} นาที</p>
          <h2 class="text-xl font-semibold tracking-tight md:text-2xl">{{ lesson.title }}</h2>
          <p class="leading-relaxed text-muted-foreground">{{ lesson.summary }}</p>
        </div>

        <Card class="gap-3">
          <CardHeader><CardTitle class="text-base">ประเด็นสำคัญ</CardTitle></CardHeader>
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
                <span class="text-xs text-muted-foreground">{{ kindLabel[l.kind] }} · {{ l.minutes }} นาที</span>
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
