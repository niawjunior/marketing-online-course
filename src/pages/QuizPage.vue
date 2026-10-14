<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { ArrowLeft, ArrowRight, Award, CheckCircle2, ClipboardCheck, RotateCcw, XCircle } from "@lucide/vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { findCourse } from "@/data/courses";
import { quizzes } from "@/data/quizzes";
import { quizScores } from "@/lib/progress";

const route = useRoute();
const router = useRouter();
const quiz = computed(() => quizzes.find((q) => q.id === route.query.id));

const step = ref(0);
const picked = ref<number | null>(null);
const correct = ref(0);
const finished = ref(false);
const question = computed(() => quiz.value?.questions[step.value]);
const score = computed(() => (quiz.value ? Math.round((correct.value / quiz.value.questions.length) * 100) : 0));

function reset(): void {
  step.value = 0;
  picked.value = null;
  correct.value = 0;
  finished.value = false;
}
watch(() => route.query.id, reset);

function pick(i: number): void {
  if (picked.value !== null || !question.value) return;
  picked.value = i;
  if (i === question.value.answer) correct.value++;
}

function next(): void {
  const q = quiz.value;
  if (!q) return;
  if (step.value < q.questions.length - 1) {
    step.value++;
    picked.value = null;
    return;
  }
  finished.value = true;
  quizScores[q.id] = Math.max(quizScores[q.id] ?? 0, score.value);
  if (score.value >= 60) toast.success(`ผ่านแบบทดสอบ ได้ ${score.value} คะแนน`);
  else toast.error(`ได้ ${score.value} คะแนน — ต้องได้ 60 ขึ้นไปจึงจะผ่าน`);
}

function choiceClass(i: number): string {
  if (picked.value === null) return "hover:bg-muted";
  if (i === question.value?.answer) return "border-emerald-500 bg-emerald-50 text-emerald-900";
  if (i === picked.value) return "border-red-400 bg-red-50 text-red-900";
  return "opacity-60";
}
</script>

<template>
  <!-- One quiz being taken -->
  <section v-if="quiz" class="mx-auto flex w-full max-w-2xl flex-col gap-5">
    <Button variant="ghost" size="sm" class="-ml-2 self-start" @click="router.push('/quiz')"><ArrowLeft /> แบบทดสอบทั้งหมด</Button>
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-semibold tracking-tight">{{ quiz.title }}</h1>
      <p class="text-sm text-muted-foreground">{{ quiz.description }}</p>
    </div>

    <Card v-if="finished" class="items-center gap-4 py-10 text-center">
      <span class="flex size-16 items-center justify-center rounded-full" :class="score >= 60 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'">
        <Award v-if="score >= 60" class="size-8" /><RotateCcw v-else class="size-8" />
      </span>
      <div>
        <div class="text-4xl font-semibold tabular-nums">{{ score }}<span class="text-lg text-muted-foreground">/100</span></div>
        <p class="mt-1 text-muted-foreground">ตอบถูก {{ correct }} จาก {{ quiz.questions.length }} ข้อ · {{ score >= 60 ? "ผ่านเกณฑ์" : "ยังไม่ผ่านเกณฑ์ (60 คะแนน)" }}</p>
      </div>
      <div class="flex flex-wrap justify-center gap-2">
        <Button variant="outline" @click="reset"><RotateCcw /> ทำอีกครั้ง</Button>
        <Button as-child><RouterLink :to="`/courses/${quiz.courseId}`">ทบทวนบทเรียน</RouterLink></Button>
      </div>
    </Card>

    <Card v-else-if="question" class="gap-4">
      <CardHeader>
        <div class="flex items-center justify-between text-sm text-muted-foreground">
          <span>ข้อ {{ step + 1 }} จาก {{ quiz.questions.length }}</span>
          <span>ตอบถูก {{ correct }} ข้อ</span>
        </div>
        <Progress :model-value="((step + (picked !== null ? 1 : 0)) / quiz.questions.length) * 100" class="mt-2 h-1.5" />
        <CardTitle class="pt-3 text-lg leading-snug">{{ question.q }}</CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <button
          v-for="(c, i) in question.choices"
          :key="c"
          class="flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors"
          :class="choiceClass(i)"
          :disabled="picked !== null"
          @click="pick(i)"
        >
          <span class="flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium">{{ "กขคง"[i] }}</span>
          <span class="flex-1">{{ c }}</span>
          <CheckCircle2 v-if="picked !== null && i === question.answer" class="size-5 text-emerald-600" />
          <XCircle v-else-if="i === picked" class="size-5 text-red-500" />
        </button>
        <div v-if="picked !== null" class="mt-2 rounded-lg bg-muted p-4 text-sm leading-relaxed">
          <span class="font-medium">{{ picked === question.answer ? "ถูกต้อง! " : "ยังไม่ถูก — " }}</span>{{ question.why }}
        </div>
      </CardContent>
      <CardFooter class="justify-end">
        <Button :disabled="picked === null" @click="next">{{ step < quiz.questions.length - 1 ? "ข้อถัดไป" : "ดูคะแนน" }} <ArrowRight /></Button>
      </CardFooter>
    </Card>
  </section>

  <!-- All quizzes -->
  <section v-else class="flex flex-col gap-5">
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-semibold tracking-tight">แบบทดสอบ</h1>
      <p class="text-sm text-muted-foreground">ทบทวนความเข้าใจหลังเรียน ตอบแล้วเห็นเฉลยพร้อมคำอธิบายทันที · ผ่านเกณฑ์ที่ 60 คะแนน</p>
    </div>
    <div class="grid gap-4 md:grid-cols-3">
      <Card v-for="q in quizzes" :key="q.id" class="gap-4">
        <CardHeader>
          <CardDescription>{{ findCourse(q.courseId)?.category }}</CardDescription>
          <CardTitle class="leading-snug">{{ q.title }}</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-1 flex-col gap-3 text-sm text-muted-foreground">
          <p>{{ q.description }}</p>
          <div class="mt-auto flex items-center gap-2">
            <span>{{ q.questions.length }} ข้อ</span>
            <Badge v-if="quizScores[q.id] !== undefined" :variant="quizScores[q.id]! >= 60 ? 'secondary' : 'outline'" class="ml-auto">
              คะแนนดีที่สุด {{ quizScores[q.id] }}
            </Badge>
            <Badge v-else variant="outline" class="ml-auto">ยังไม่ได้ทำ</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button class="w-full" :variant="quizScores[q.id] !== undefined ? 'outline' : 'default'" @click="router.push({ query: { id: q.id } })">
            <ClipboardCheck /> {{ quizScores[q.id] !== undefined ? "ทำอีกครั้ง" : "เริ่มทำแบบทดสอบ" }}
          </Button>
        </CardFooter>
      </Card>
    </div>
  </section>
</template>
