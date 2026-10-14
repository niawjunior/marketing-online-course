<script setup lang="ts">
import { computed, ref } from "vue";
import { Search } from "@lucide/vue";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { glossary, termGroups } from "@/data/glossary";

const query = ref("");
const group = ref("ทั้งหมด");
const shown = computed(() =>
  glossary
    .filter((t) => (group.value === "ทั้งหมด" || t.group === group.value) && `${t.term} ${t.thai} ${t.meaning}`.toLowerCase().includes(query.value.trim().toLowerCase()))
    .sort((a, b) => a.term.localeCompare(b.term)),
);
</script>

<template>
  <section class="flex flex-col gap-5">
    <div class="flex flex-wrap items-end gap-3">
      <div class="mr-auto flex flex-col gap-1">
        <h1 class="text-2xl font-semibold tracking-tight">คลังคำศัพท์การตลาด</h1>
        <p class="text-sm text-muted-foreground">{{ glossary.length }} คำที่ได้ยินบ่อยในที่ประชุม อธิบายด้วยภาษาง่าย ๆ</p>
      </div>
      <div class="relative w-full sm:w-72">
        <Search class="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input v-model="query" placeholder="ค้นหาคำศัพท์ เช่น ROAS" class="pl-8" />
      </div>
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
      <Card v-for="t in shown" :key="t.term" class="gap-2">
        <CardHeader>
          <div class="flex items-start justify-between gap-2">
            <CardTitle>{{ t.term }}</CardTitle>
            <Badge variant="outline" class="shrink-0">{{ t.group }}</Badge>
          </div>
          <CardDescription>{{ t.thai }}</CardDescription>
        </CardHeader>
        <CardContent class="text-sm leading-relaxed">{{ t.meaning }}</CardContent>
      </Card>
    </div>
    <p v-if="!shown.length" class="py-12 text-center text-muted-foreground">ไม่พบคำศัพท์ที่ค้นหา</p>
  </section>
</template>
