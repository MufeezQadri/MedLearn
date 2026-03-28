import { useState, FormEvent, useRef, DragEvent } from "react";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/auth-context";
import { mockApp } from "../data/mock-app";
import {
  BookPlus,
  CheckCircle2,
  Loader2,
  BookOpen,
  ShieldAlert,
  Upload,
  X,
  FileImage,
} from "lucide-react";

export const AdminPage = () => {
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [uploadedCoverUrl, setUploadedCoverUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const courses = mockApp.getCourses();
  const quizzes = mockApp.getQuizzes();
  const [booksCount, setBooksCount] = useState(34);

  if (!user || user.role !== "admin") {
    return (
      <Card className="flex flex-col items-center gap-4 py-16 text-center">
        <ShieldAlert className="h-12 w-12 text-on-surface-variant" />
        <h2 className="font-headline text-2xl font-extrabold">Access Restricted</h2>
        <p className="max-w-sm text-on-surface-variant">
          You must be logged in as an administrator to manage platform content.
        </p>
      </Card>
    );
  }

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:4000/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to upload file");
    return data.data.url as string;
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);
    setError("");

    try {
      const url = await uploadFile(file);
      setUploadedCoverUrl(url);
    } catch (err: any) {
      setError(err.message || "Cover upload failed");
      setCoverPreview(null);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const coverUrl = uploadedCoverUrl || (formData.get("coverUrl") as string);

    if (!coverUrl) {
      setError("Please upload a cover image or provide a URL.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      category: formData.get("category") as string,
      subject: formData.get("subject") as string,
      edition: formData.get("edition") as string,
      coverUrl,
      description: formData.get("description") as string,
      tags: (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("http://localhost:4000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload book");

      setSuccess(true);
      setBooksCount((prev) => prev + 1);
      setUploadedCoverUrl("");
      setCoverPreview(null);
      e.currentTarget.reset();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-surface border border-surface-variant rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-headline text-3xl font-extrabold flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          Admin Dashboard
        </h2>
        <p className="text-on-surface-variant mt-1">
          Logged in as <span className="font-semibold text-on-surface">{user.fullName}</span> ·{" "}
          <span className="text-primary font-medium">Admin</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Courses", value: courses.length, color: "text-blue-500" },
          { label: "Quizzes", value: quizzes.length, color: "text-purple-500" },
          { label: "Live Books", value: booksCount, color: "text-emerald-500" },
        ].map(({ label, value, color }) => (
          <Card key={label} className="hover:border-primary/40 transition-colors">
            <p className={`text-xs font-bold uppercase tracking-[0.16em] ${color}`}>{label}</p>
            <p className="mt-2 font-headline text-4xl font-extrabold">{value}</p>
          </Card>
        ))}
      </div>

      {/* Upload Form */}
      <Card className="overflow-hidden border-surface-variant p-0">
        <div className="border-b border-surface-variant bg-surface-variant/20 px-6 py-4 flex items-center gap-3">
          <BookPlus className="h-5 w-5 text-primary" />
          <h3 className="font-headline text-lg font-bold">Upload New Study Material</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-600 px-4 py-3 rounded-xl text-sm">
              <X className="h-4 w-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 px-4 py-3 rounded-xl text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Book successfully added to the live database!
            </div>
          )}

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Book Cover</label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all py-8
                ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-surface-variant hover:border-primary/50 bg-surface-variant/20"}`}
            >
              {coverPreview ? (
                <>
                  <img src={coverPreview} alt="Cover preview" className="h-32 w-24 object-cover rounded-lg shadow-md" />
                  <p className="text-xs text-on-surface-variant">Click to change</p>
                </>
              ) : (
                <>
                  <FileImage className="h-10 w-10 text-on-surface-variant/50" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-on-surface">Drag & drop cover image here</p>
                    <p className="text-xs text-on-surface-variant mt-1">or click to browse · JPG, PNG, WebP</p>
                  </div>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
              />
            </div>
            <p className="text-xs text-on-surface-variant">Or paste a direct image URL below:</p>
            <input name="coverUrl" type="url" className={inputClass} placeholder="https://example.com/cover.jpg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Book Title</label>
              <input required name="title" type="text" className={inputClass} placeholder="e.g. Gray's Anatomy" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Author(s)</label>
              <input required name="author" type="text" className={inputClass} placeholder="e.g. Richard Drake" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Subject</label>
              <input required name="subject" type="text" className={inputClass} placeholder="e.g. Anatomy" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Category</label>
              <select required name="category" className={inputClass}>
                <option value="Pre-Clinical">Pre-Clinical</option>
                <option value="Para-Clinical">Para-Clinical</option>
                <option value="Clinical">Clinical</option>
                <option value="Reference">Reference</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Edition</label>
              <input required name="edition" type="text" className={inputClass} placeholder="e.g. 4th Edition" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Tags (comma-separated)</label>
              <input name="tags" type="text" className={inputClass} placeholder="anatomy, mbbs, high-yield" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Description / Study Focus</label>
            <textarea
              required
              name="description"
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Describe the content, key topics covered, and why students should study this book..."
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-on-primary px-8 py-3 rounded-full font-bold transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {isSubmitting ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Publishing...</>
              ) : (
                <><Upload className="h-5 w-5" /> Publish to Library</>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
