<script setup lang="ts">
import { computed, ref } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const baht = (n: number) => (Number.isFinite(n) ? n.toLocaleString("th-TH", { maximumFractionDigits: 0 }) : "–");
const num = (n: number, d = 2) => (Number.isFinite(n) ? n.toLocaleString("th-TH", { maximumFractionDigits: d }) : "–");

// Ad results: what a campaign of this size returned.
const ad = ref({ spend: 30000, impressions: 250000, clicks: 4200, orders: 168, aov: 890 });
const adOut = computed(() => {
  const a = ad.value;
  const sales = a.orders * a.aov;
  const roas = sales / a.spend;
  return [
    { label: "CTR", value: `${num((a.clicks / a.impressions) * 100)}%`, hint: "คลิก ÷ การแสดงผล" },
    { label: "CPC", value: `${num(a.spend / a.clicks)} บาท`, hint: "งบ ÷ คลิก" },
    { label: "Conversion Rate", value: `${num((a.orders / a.clicks) * 100)}%`, hint: "คนซื้อ ÷ คลิก" },
    { label: "CPA", value: `${baht(a.spend / a.orders)} บาท`, hint: "งบ ÷ คนซื้อ" },
    { label: "ยอดขายจากโฆษณา", value: `${baht(sales)} บาท`, hint: "คนซื้อ × ยอดซื้อเฉลี่ย" },
    { label: "ROAS", value: `${num(roas)} เท่า`, hint: roas >= 3 ? "คุ้มค่า — สูงกว่า 3 เท่า" : "ควรปรับ — ต่ำกว่า 3 เท่า", good: roas >= 3 },
  ];
});
const adFields = [
  { key: "spend", label: "งบโฆษณา (บาท)" },
  { key: "impressions", label: "จำนวนการแสดงผล" },
  { key: "clicks", label: "จำนวนคลิก" },
  { key: "orders", label: "จำนวนคำสั่งซื้อ" },
  { key: "aov", label: "ยอดซื้อเฉลี่ยต่อออเดอร์ (บาท)" },
] as const;

// Funnel: how many people are left at each stage.
const funnel = ref({ visitors: 20000, product: 45, cart: 20, paid: 40 });
const stages = computed(() => {
  const f = funnel.value;
  const viewed = f.visitors * (f.product / 100);
  const carted = viewed * (f.cart / 100);
  const paid = carted * (f.paid / 100);
  return [
    { label: "เข้าเว็บไซต์", count: f.visitors },
    { label: "ดูหน้าสินค้า", count: viewed },
    { label: "ใส่ตะกร้า", count: carted },
    { label: "ชำระเงิน", count: paid },
  ];
});
const funnelFields = [
  { key: "visitors", label: "ผู้เข้าชมเว็บไซต์ (คน)" },
  { key: "product", label: "% ที่ดูหน้าสินค้า" },
  { key: "cart", label: "% ที่ใส่ตะกร้า" },
  { key: "paid", label: "% ที่ชำระเงิน" },
] as const;
</script>

<template>
  <section class="flex flex-col gap-5">
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-semibold tracking-tight">เครื่องคำนวณการตลาด</h1>
      <p class="text-sm text-muted-foreground">ลองใส่ตัวเลขของแคมเปญจริง แล้วดูว่าผลลัพธ์คุ้มค่าแค่ไหน</p>
    </div>
    <Tabs default-value="ads" class="gap-4">
      <TabsList>
        <TabsTrigger value="ads">ผลโฆษณาและ ROAS</TabsTrigger>
        <TabsTrigger value="funnel">กรวยการขาย</TabsTrigger>
      </TabsList>

      <TabsContent value="ads" class="grid gap-4 lg:grid-cols-[340px_1fr]">
        <Card class="gap-4">
          <CardHeader><CardTitle class="text-base">ข้อมูลแคมเปญ</CardTitle><CardDescription>ตัวอย่าง: แคมเปญโฆษณาเดือนตุลาคม</CardDescription></CardHeader>
          <CardContent class="flex flex-col gap-3">
            <div v-for="f in adFields" :key="f.key" class="flex flex-col gap-1.5">
              <Label :for="f.key">{{ f.label }}</Label>
              <Input :id="f.key" v-model.number="ad[f.key]" type="number" min="0" />
            </div>
          </CardContent>
        </Card>
        <div class="grid content-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Card v-for="o in adOut" :key="o.label" class="gap-1 py-4" :class="o.good === true ? 'border-emerald-300 bg-emerald-50' : o.good === false ? 'border-amber-300 bg-amber-50' : ''">
            <CardHeader class="px-4">
              <CardDescription>{{ o.label }}</CardDescription>
              <CardTitle class="text-2xl tabular-nums">{{ o.value }}</CardTitle>
            </CardHeader>
            <CardContent class="px-4 text-xs text-muted-foreground">{{ o.hint }}</CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="funnel" class="grid gap-4 lg:grid-cols-[340px_1fr]">
        <Card class="gap-4">
          <CardHeader><CardTitle class="text-base">อัตราในแต่ละขั้น</CardTitle><CardDescription>ตัวอย่าง: ร้านค้าออนไลน์ 1 เดือน</CardDescription></CardHeader>
          <CardContent class="flex flex-col gap-3">
            <div v-for="f in funnelFields" :key="f.key" class="flex flex-col gap-1.5">
              <Label :for="f.key">{{ f.label }}</Label>
              <Input :id="f.key" v-model.number="funnel[f.key]" type="number" min="0" />
            </div>
          </CardContent>
        </Card>
        <Card class="gap-4">
          <CardHeader>
            <CardTitle class="text-base">ภาพกรวยการขาย</CardTitle>
            <CardDescription>ได้ลูกค้าที่จ่ายเงินจริง {{ baht(stages[3]!.count) }} คน จากผู้เข้าชม {{ baht(stages[0]!.count) }} คน ({{ num((stages[3]!.count / stages[0]!.count) * 100) }}%)</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col items-center gap-2">
            <div
              v-for="(s, i) in stages"
              :key="s.label"
              class="flex h-14 items-center justify-between rounded-lg bg-primary px-4 text-sm text-primary-foreground transition-all"
              :style="{ width: `${Math.max(42, 100 - i * 18)}%`, opacity: 1 - i * 0.15 }"
            >
              <span>{{ s.label }}</span>
              <span class="font-semibold tabular-nums">{{ baht(s.count) }}</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </section>
</template>
