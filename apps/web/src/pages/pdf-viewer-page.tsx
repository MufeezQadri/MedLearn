import { useState } from "react";
import { FileText, PencilLine } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/auth-context";
import { mockApp } from "../data/mock-app";

export const PdfViewerPage = () => {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const [, setRefreshKey] = useState(0);
  const pdf = mockApp.getPdf(id);
  const [note, setNote] = useState("");
  const module = pdf ? mockApp.getModule(pdf.moduleId) : undefined;
  const notes = mockApp.getNotes(module?.id);

  if (!pdf) {
    return <Card>PDF not found.</Card>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="min-h-[560px] bg-surface-container-low">
        <div className="mb-6 flex items-center gap-3 text-primary">
          <FileText className="h-5 w-5" />
          <div>
            <h2 className="font-headline text-2xl font-extrabold">{pdf.title}</h2>
            <p className="text-sm text-on-surface-variant">{pdf.pageCount} pages</p>
          </div>
        </div>
        <div className="flex h-[440px] items-center justify-center rounded-[1.5rem] border border-dashed border-outline-variant/40 bg-surface-container-lowest text-center">
          <div>
            <p className="font-headline text-3xl font-extrabold">{pdf.title}</p>
            <p className="mt-2 text-on-surface-variant">{pdf.description}</p>
          </div>
        </div>
      </Card>
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <PencilLine className="h-5 w-5 text-primary" />
          <h3 className="font-headline text-2xl font-extrabold">Smart notes</h3>
        </div>
        <div className="space-y-3">
          {notes.map((item) => (
            <div key={item.id} className="rounded-3xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
              {item.content}
            </div>
          ))}
        </div>
        <form
          className="mt-6 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!note.trim()) return;
            mockApp.addNote(user!.id, { moduleId: module?.id, content: note });
            setNote("");
            setRefreshKey((current) => current + 1);
          }}
        >
          <textarea
            className="h-36 w-full rounded-3xl bg-surface-container-low px-4 py-4 outline-none"
            placeholder="Write key takeaways, mnemonics, or AI-suggested summaries..."
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <Button>Save note</Button>
        </form>
      </Card>
    </div>
  );
};
