import { FileText, PlayCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { mockApp } from "../data/mock-app";
import { formatMinutes } from "../lib/utils";

export const CourseDetailPage = () => {
  const { id = "" } = useParams();
  const course = mockApp.getCourse(id);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-surface-container-low">
          <Badge>{course.subject}</Badge>
          <h2 className="mt-4 font-headline text-4xl font-extrabold tracking-tight">{course.title}</h2>
          <p className="mt-3 text-lg text-on-surface-variant">{course.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {course.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-on-surface-variant">
                {tag}
              </span>
            ))}
          </div>
        </Card>
        <img src={course.thumbnailUrl} alt={course.title} className="h-full min-h-72 w-full rounded-editorial object-cover shadow-ambient" />
      </section>

      <section className="space-y-4">
        {course.modules.map((module) => (
          <Card key={module.id} className="rounded-3xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">Module {module.orderIndex}</p>
                <h3 className="font-headline text-2xl font-bold">{module.title}</h3>
                <p className="mt-2 text-on-surface-variant">{module.summary}</p>
                <p className="mt-3 text-sm font-medium text-primary">{formatMinutes(module.durationMinutes)}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {module.videoId ? (
                  <Link to={`/learn/video/${module.videoId}`}>
                    <Button>
                      <span className="flex items-center gap-2">
                        <PlayCircle className="h-4 w-4" />
                        Watch video
                      </span>
                    </Button>
                  </Link>
                ) : null}
                {module.pdfId ? (
                  <Link to={`/learn/pdf/${module.pdfId}`}>
                    <Button variant="secondary">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Open PDF
                      </span>
                    </Button>
                  </Link>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
};
