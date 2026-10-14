<script setup lang="ts">
import { computed, ref } from "vue";
import { toast } from "vue-sonner";
import { BookOpenCheck, Check, CircleHelp, Search, Undo2 } from "@lucide/vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { glossary, termGroups, type Term } from "@/data/glossary";
import { learnedCount, termStatus } from "@/lib/progress";

const query = ref("");
const group = ref("ทั้งหมด");
const view = ref<"learning" | "learned">("learning");

const matches = (t: Term) =>
  (group.value === "ทั้งหมด" || t.group === group.value) && `${t.term} ${t.thai} ${t.meaning}`.toLowerCase().includes(query.value.trim().toLowerCase());
const sorted = computed(() => [...glossary].sort((a, b) => a.term.localeCompare(b.term)));
const learning = computed(() => sorted.value.filter((t) => termStatus[t.term] !== "got"));
const learned = computed(() => sorted.value.filter((t) => termStatus[t.term] === "got"));
const shown = computed(() => (view.value === "learning" ? learning.value : learned.value).filter(matches));
const notYet = computed(() => learning.value.filter((t) => termStatus[t.term] === "not").length);
const percent = computed(() => Math.round((learnedCount() / glossary.length) * 100));

function understood(t: Term): void {
  termStatus[t.term] = "got";
  toast.success(`ย้าย “${t.term}” ไปที่คำศัพท์ที่เรียนรู้แล้ว`);
}
function notUnderstood(t: Term): void {
  termStatus[t.term] = "not";
  toast(`ทำเครื่องหมาย “${t.term}” ว่ายังไม่เข้าใจ`, { description: "คำนี้จะอยู่ในรายการให้ทบทวนต่อ" });
}
function reviewAgain(t: Term): void {
  termStatus[t.term] = "not";
  toast(`ย้าย “${t.term}” กลับไปทบทวนอีกครั้ง`);
}
</script>

<template>
  <section class="flex flex-col gap-5">
    <div class="flex flex-wrap items-end gap-3">
      <div class="mr-auto flex flex-col gap-1">
        <h1 class="text-2xl font-semibold tracking-tight">คลังคำศัพท์การตลาด</h1>
        <p class="text-sm text-muted-foreground">{{ glossary.length }} คำที่ได้ยินบ่อยในที่ประชุม อธิบายด้วยภาษาง่าย ๆ · อ่านแล้วกดบอกว่าเข้าใจหรือยัง</p>
      </div>
      <div class="relative w-full sm:w-72">
        <Search class="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input v-model="query" placeholder="ค้นหาคำศัพท์ เช่น ROAS" class="pl-8" />
      </div>
    </div>

    <Card class="gap-0 py-4">
      <CardContent class="flex flex-col gap-2 px-4">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span class="flex items-center gap-1.5 font-medium"><BookOpenCheck class="size-4 text-emerald-600" />เรียนรู้แล้ว {{ learnedCount() }} จาก {{ glossary.length }} คำ</span>
          <span class="text-muted-foreground">ยังไม่เข้าใจ {{ notYet }} คำ</span>
          <span class="ml-auto font-medium tabular-nums">{{ percent }}%</span>
        </div>
        <Progress :model-value="percent" class="h-2 *:bg-emerald-600" />
      </CardContent>
    </Card>

    <div class="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1 sm:inline-grid sm:self-start">
      <button
        class="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors"
        :class="view === 'learning' && 'bg-background text-foreground shadow-sm'"
        @click="view = 'learning'"
      >
        คำศัพท์ที่ต้องเรียน ({{ learning.length }})
      </button>
      <button
        class="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors"
        :class="view === 'learned' && 'bg-background text-foreground shadow-sm'"
        @click="view = 'learned'"
      >
        คำศัพท์ที่เรียนรู้แล้ว ({{ learned.length }})
      </button>
    </div>

    <Tabs v-model="group">
      <div class="-mx-4 overflow-x-auto px-4">
        <TabsList>
          <TabsTrigger value="ทั้งหมด">ทั้งหมด</TabsTrigger>
          <TabsTrigger v-for="g in termGroups" :key="g" :value="g">{{ g }}</TabsTrigger>
        </TabsList>
      </div>
    </Tabs>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Card
        v-for="t in shown"
        :key="t.term"
        class="gap-2"
        :class="termStatus[t.term] === 'got' ? 'border-emerald-300 bg-emerald-50/50' : termStatus[t.term] === 'not' ? 'border-amber-300 bg-amber-50/50' : ''"
      >
        <CardHeader>
          <div class="flex items-start justify-between gap-2">
            <CardTitle>{{ t.term }}</CardTitle>
            <Badge v-if="termStatus[t.term] === 'got'" class="shrink-0 bg-emerald-600 text-white"><Check />เข้าใจแล้ว</Badge>
            <Badge v-else-if="termStatus[t.term] === 'not'" class="shrink-0 bg-amber-500 text-white"><CircleHelp />ยังไม่เข้าใจ</Badge>
            <Badge v-else variant="outline" class="shrink-0">{{ t.group }}</Badge>
          </div>
          <CardDescription>{{ t.thai }}</CardDescription>
        </CardHeader>
        <CardContent class="flex-1 text-sm leading-relaxed">{{ t.meaning }}</CardContent>
        <CardFooter class="gap-2 pt-2">
          <template v-if="view === 'learning'">
            <Button size="sm" class="flex-1 bg-emerald-600 text-white hover:bg-emerald-700" @click="understood(t)"><Check /> เข้าใจแล้ว</Button>
            <Button size="sm" variant="outline" class="flex-1" :class="termStatus[t.term] === 'not' && 'border-amber-400 text-amber-700'" @click="notUnderstood(t)">
              <CircleHelp /> ยังไม่เข้าใจ
            </Button>
          </template>
          <Button v-else size="sm" variant="outline" class="flex-1" @click="reviewAgain(t)"><Undo2 /> ยังไม่แน่ใจ ขอทบทวนอีกครั้ง</Button>
        </CardFooter>
      </Card>
    </div>

    <div v-if="!shown.length" class="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
      <template v-if="query || group !== 'ทั้งหมด'">ไม่พบคำศัพท์ที่ค้นหา</template>
      <template v-else-if="view === 'learning'">
        <BookOpenCheck class="size-10 text-emerald-600" />
        <p>เก่งมาก! คุณเข้าใจคำศัพท์ครบทุกคำแล้ว 🎉</p>
      </template>
      <template v-else>
        <p>ยังไม่มีคำศัพท์ที่เรียนรู้แล้ว — กด “เข้าใจแล้ว” ที่คำศัพท์เพื่อย้ายมาไว้ตรงนี้</p>
        <Button variant="outline" @click="view = 'learning'">ไปที่คำศัพท์ที่ต้องเรียน</Button>
      </template>
    </div>
  </section>
</template>
