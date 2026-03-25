import { Card } from "../components/ui/card";
import { useAuth } from "../context/auth-context";
import { mockApp } from "../data/mock-app";

export const AdminPage = () => {
  const { user } = useAuth();
  const courses = mockApp.getCourses();
  const quizzes = mockApp.getQuizzes();
  const books = mockApp.getBooks();

  if (user?.role !== "admin") {
    return (
      <Card>
        <h2 className="font-headline text-3xl font-extrabold">Admin panel</h2>
        <p className="mt-3 text-on-surface-variant">Login with the admin account to manage catalog content and access platform operations.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <Card>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Courses</p>
        <p className="mt-3 font-headline text-4xl font-extrabold">{courses.length}</p>
      </Card>
      <Card>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Quizzes</p>
        <p className="mt-3 font-headline text-4xl font-extrabold">{quizzes.length}</p>
      </Card>
      <Card>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Books</p>
        <p className="mt-3 font-headline text-4xl font-extrabold">{books.length}</p>
      </Card>
    </div>
  );
};
