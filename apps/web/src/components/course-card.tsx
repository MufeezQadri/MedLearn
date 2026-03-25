import { ArrowRight, Clock3, UserRound } from "lucide-react";
import type { Course } from "@medlearn/shared";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";

export const CourseCard = ({ course }: { course: Course }) => (
  <article className="overflow-hidden rounded-editorial bg-surface-container-lowest shadow-ambient transition hover:-translate-y-1">
    <img src={course.thumbnailUrl} alt={course.title} className="h-52 w-full object-cover" />
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <Badge>{course.subject}</Badge>
        <span className="rounded-full bg-error-container px-3 py-1 text-xs font-bold capitalize text-error">
          {course.difficulty}
        </span>
      </div>
      <div>
        <h3 className="font-headline text-2xl font-bold tracking-tight">{course.title}</h3>
        <p className="mt-2 text-sm text-on-surface-variant">{course.description}</p>
      </div>
      <div className="flex items-center gap-4 text-sm text-on-surface-variant">
        <span className="flex items-center gap-2">
          <UserRound className="h-4 w-4" />
          {course.educator}
        </span>
        <span className="flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          {course.durationHours}h
        </span>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-semibold">
          <span className="text-primary">{course.progressPercent}% complete</span>
          <span className="text-on-surface-variant">{course.enrolledStudents.toLocaleString()} learners</span>
        </div>
        <div className="h-2 rounded-full bg-surface-container-high">
          <div className="h-2 rounded-full bg-primary" style={{ width: `${course.progressPercent}%` }} />
        </div>
      </div>
      <Link
        to={`/courses/${course.id}`}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-signature px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition active:scale-[0.98]"
      >
        Continue learning <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </article>
);
