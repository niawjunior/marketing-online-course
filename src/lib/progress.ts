import { reactive } from "vue";
import { courses, type Course } from "@/data/courses";

// The learner's progress in this demo — kept in memory, seeded so the story starts mid-way.
export const learner = { name: "คุณพิมพ์ชนก", role: "เจ้าหน้าที่การตลาด", initials: "พช" };

const done = reactive(new Set<string>(["m101-1", "m101-2", "m101-3", "ads-1", "ads-2", "cm-1"]));
export const quizScores = reactive<Record<string, number>>({ "quiz-basics": 80 });

export const isDone = (lessonId: string) => done.has(lessonId);
export function markDone(lessonId: string): void {
  done.add(lessonId);
}
export const doneCount = () => done.size;
export const courseDone = (c: Course) => c.lessons.filter((l) => done.has(l.id)).length;
export const coursePercent = (c: Course) => Math.round((courseDone(c) / c.lessons.length) * 100);
export const nextLesson = (c: Course) => c.lessons.find((l) => !done.has(l.id)) ?? c.lessons[0]!;
export const inProgress = () => courses.filter((c) => courseDone(c) > 0 && courseDone(c) < c.lessons.length);
