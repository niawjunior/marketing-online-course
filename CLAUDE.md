# สร้างเว็บสื่อการสอน marketing

<!-- sup-plana:brief — written by the sup-plana runner from the app's page; edit it there, not here -->
- **What it is:** เดโม — a DEMO for a client meeting: polished, every step of the story the owner will walk through works, believable data; breadth over depth
- **For:** (not said) · **its owner on sup-plana:** เนี้ยว
- **Started from:** vue (Vue 3, Vite, Tailwind CSS 4, shadcn-vue)

### What is needed (from its owner, as they wrote it)
สร้างเว็บสื่อการสอน marketing

### Where it is deployed
At `/marketing/` under the team's demo site — built with `BASE_PATH=/marketing/ bun run build`. Never write a link, an asset path or a fetch as an absolute `/…`: go through the router, `import.meta.env.BASE_URL` and the app's api client, so it works at `/` in dev and at `/marketing/` deployed.
<!-- /sup-plana:brief -->

## How this app is worked
- Its owner asks for one change at a time on sup-plana; each request is one turn, and the runner keeps every turn as a
  version (v1, v2 …). **Do not commit, branch, tag or push** — the runner does it when your turn ends.
- End every turn with `bun run check` passing (typecheck + build). The runner runs it after you; if it fails you are
  told the errors in the same turn.
- Look at what you built before you say it is done: the `shot` tool (a picture on the app's page) or `browse`.
- Keep the section **What we decided** at the end of this file current — the pages, the flow, choices made with the
  owner. It is how the next session knows the app; a long chat is not.

## Rules for a demo
- Every word a person reads on screen is Thai unless the brief says otherwise; dates and numbers in th-TH.
- Data is believable sample data in the client's own terms — never real people's data, real systems, real keys or
  secrets; no call to an outside service unless the owner asks for one.
- One look across every page; it works on a phone as well as a laptop.
- Prefer the shadcn components already in `src/components/ui` and Tailwind utilities; add more components with the CLI
  below rather than writing your own.
- It may be deployed under a path (`/<name>/` on the team's demo site, built with `BASE_PATH=/<name>/`): never write an
  absolute `/…` link or asset path — go through the router and `import.meta.env.BASE_URL`, which already follow it.

## Stack
- Vue 3 (`<script setup lang="ts">`) + Vite + TypeScript, Tailwind CSS 4, shadcn-vue (reka-ui) in `src/components/ui`;
  icons from `@lucide/vue`; toasts with `vue-sonner` (`toast.success(…)`).
- Pages in `src/pages`, listed in `src/router.ts` (the menu in `src/components/AppShell.vue` reads that list); sample
  data in `src/data`. Change the app's name in `AppShell.vue`.
- More components: `bunx --bun shadcn-vue@latest add <name>` (e.g. `calendar`, `chart`, `form`).

## What we decided
- Name: "ห้องเรียนการตลาด" — an e-learning site for marketing; the learner is a made-up staff member "คุณพิมพ์ชนก" (top right).
- Pages (menu): หน้าแรก (greeting, stats, เรียนต่อ, คอร์สแนะนำ, shortcuts) · คอร์สเรียน (6 courses, category tabs, search)
  · แบบทดสอบ (3 quizzes, answer → instant เฉลย + คำอธิบาย, pass at 60) · คลังคำศัพท์ (32 terms, groups, search)
  · เครื่องคำนวณ (ROAS/CPA from campaign numbers; sales funnel).
- Course page `/courses/:id?lesson=` (not in menu): pretend video player / article card, ประเด็นสำคัญ, กรณีศึกษา,
  lesson list; "เรียนจบบทนี้" marks done and goes to the next; the last lesson leads to the course's quiz.
- Progress lives in memory (`src/lib/progress.ts`), seeded mid-way (6 lessons done, basics quiz 80) — a reload resets it.
- Content in `src/data/courses.ts`, `quizzes.ts`, `glossary.ts`; instructors are made-up names.
