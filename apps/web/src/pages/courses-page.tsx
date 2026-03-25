import { useMemo, useState } from "react";
import { CourseCard } from "../components/course-card";
import { mockApp } from "../data/mock-app";

export const CoursesPage = () => {
  const [search, setSearch] = useState("");
  const courses = useMemo(() => mockApp.getCourses(search), [search]);

  return (
    <div className="space-y-8">
      <section className="rounded-editorial bg-surface-container-lowest p-6 shadow-ambient">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Course catalog</p>
        <h2 className="mt-2 font-headline text-4xl font-extrabold tracking-tight">Advance your clinical knowledge</h2>
        <input
          className="mt-6 w-full rounded-3xl bg-surface-container-low px-5 py-4 outline-none"
          placeholder="Search courses, modules, or subjects..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};
