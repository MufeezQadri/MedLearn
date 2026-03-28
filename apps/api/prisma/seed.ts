import { PrismaClient } from "@prisma/client";
import { courses, books } from "../../../packages/shared/src/mockData.js";
import { modules } from "../../../packages/shared/src/mockData.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ── Real MBBS-level quiz data ─────────────────────────────────────────────────
const quizSeed = [
  {
    id: "quiz-anatomy-1",
    title: "Anatomy: Upper Limb Essentials",
    description: "High-yield anatomy MCQs covering the brachial plexus, muscles, and joints of the upper limb.",
    subject: "Anatomy",
    examTrack: "MBBS",
    durationMinutes: 20,
    difficulty: "medium",
    topicFocus: "Brachial Plexus,Shoulder Joint,Muscles of the Arm",
    questions: [
      {
        id: "q-a1-1",
        topic: "Brachial Plexus",
        subject: "Anatomy",
        prompt: "Which nerve is damaged in 'Saturday night palsy'?",
        explanation: "The radial nerve winds around the posterior aspect of the humerus in the spiral groove. Compression here (e.g., sleeping with arm over a chair) causes wrist drop — the hallmark of radial nerve injury.",
        difficulty: "medium",
        correctOptionId: "q-a1-1-c",
        options: [
          { id: "q-a1-1-a", label: "A", text: "Ulnar nerve" },
          { id: "q-a1-1-b", label: "B", text: "Median nerve" },
          { id: "q-a1-1-c", label: "C", text: "Radial nerve" },
          { id: "q-a1-1-d", label: "D", text: "Musculocutaneous nerve" },
        ],
      },
      {
        id: "q-a1-2",
        topic: "Shoulder Joint",
        subject: "Anatomy",
        prompt: "The rotator cuff is composed of all EXCEPT:",
        explanation: "The rotator cuff consists of SITS: Supraspinatus, Infraspinatus, Teres minor, and Subscapularis. Teres major is NOT part of the rotator cuff; it is a powerful medial rotator but does not contribute to the cuff.",
        difficulty: "easy",
        correctOptionId: "q-a1-2-d",
        options: [
          { id: "q-a1-2-a", label: "A", text: "Supraspinatus" },
          { id: "q-a1-2-b", label: "B", text: "Infraspinatus" },
          { id: "q-a1-2-c", label: "C", text: "Subscapularis" },
          { id: "q-a1-2-d", label: "D", text: "Teres major" },
        ],
      },
      {
        id: "q-a1-3",
        topic: "Brachial Plexus",
        subject: "Anatomy",
        prompt: "Erb's palsy results from injury to which roots of the brachial plexus?",
        explanation: "Erb's palsy (waiter's tip position) results from injury to C5-C6 roots, commonly from traumatic delivery or motorcycle accidents causing downward traction of the neck.",
        difficulty: "easy",
        correctOptionId: "q-a1-3-a",
        options: [
          { id: "q-a1-3-a", label: "A", text: "C5-C6" },
          { id: "q-a1-3-b", label: "B", text: "C7-C8" },
          { id: "q-a1-3-c", label: "C", text: "C8-T1" },
          { id: "q-a1-3-d", label: "D", text: "C5-T1" },
        ],
      },
      {
        id: "q-a1-4",
        topic: "Muscles of the Arm",
        subject: "Anatomy",
        prompt: "Which muscle is the primary flexor of the elbow?",
        explanation: "The biceps brachii is the primary flexor of the elbow, especially when the forearm is supinated. Brachialis is the workhorse flexor regardless of forearm position, but biceps is considered primary.",
        difficulty: "easy",
        correctOptionId: "q-a1-4-b",
        options: [
          { id: "q-a1-4-a", label: "A", text: "Brachialis" },
          { id: "q-a1-4-b", label: "B", text: "Biceps brachii" },
          { id: "q-a1-4-c", label: "C", text: "Coracobrachialis" },
          { id: "q-a1-4-d", label: "D", text: "Triceps brachii" },
        ],
      },
      {
        id: "q-a1-5",
        topic: "Brachial Plexus",
        subject: "Anatomy",
        prompt: "Klumpke's palsy causes the 'claw hand' deformity due to injury of:",
        explanation: "Klumpke's palsy involves C8-T1 roots. These form the medial cord supplying the ulnar nerve — responsible for the intrinsic hand muscles. Their loss causes the typical claw hand appearance.",
        difficulty: "medium",
        correctOptionId: "q-a1-5-c",
        options: [
          { id: "q-a1-5-a", label: "A", text: "C5-C6 roots" },
          { id: "q-a1-5-b", label: "B", text: "C6-C7 roots" },
          { id: "q-a1-5-c", label: "C", text: "C8-T1 roots" },
          { id: "q-a1-5-d", label: "D", text: "C7-C8 roots" },
        ],
      },
    ],
  },
  {
    id: "quiz-physiology-1",
    title: "Physiology: Cardiac & Hemodynamics",
    description: "Core cardiac physiology MCQs — action potentials, pressure-volume loops, and Frank-Starling.",
    subject: "Physiology",
    examTrack: "NEET_PG",
    durationMinutes: 25,
    difficulty: "hard",
    topicFocus: "Action Potentials,Frank-Starling,Cardiac Output",
    questions: [
      {
        id: "q-p1-1",
        topic: "Action Potentials",
        subject: "Physiology",
        prompt: "Which ion is primarily responsible for Phase 0 (rapid depolarization) of the ventricular action potential?",
        explanation: "Phase 0 is due to rapid opening of fast Na⁺ channels, causing a sudden influx of sodium ions into the cell. This rapid depolarization brings the membrane potential from -90 mV to +30 mV.",
        difficulty: "easy",
        correctOptionId: "q-p1-1-a",
        options: [
          { id: "q-p1-1-a", label: "A", text: "Na⁺ (sodium)" },
          { id: "q-p1-1-b", label: "B", text: "K⁺ (potassium)" },
          { id: "q-p1-1-c", label: "C", text: "Ca²⁺ (calcium)" },
          { id: "q-p1-1-d", label: "D", text: "Cl⁻ (chloride)" },
        ],
      },
      {
        id: "q-p1-2",
        topic: "Cardiac Output",
        subject: "Physiology",
        prompt: "Cardiac output (CO) is calculated as:",
        explanation: "Cardiac Output = Stroke Volume × Heart Rate. In a healthy adult at rest: CO ≈ 70 mL × 72 bpm ≈ 5 L/min.",
        difficulty: "easy",
        correctOptionId: "q-p1-2-b",
        options: [
          { id: "q-p1-2-a", label: "A", text: "Heart Rate × Blood Pressure" },
          { id: "q-p1-2-b", label: "B", text: "Stroke Volume × Heart Rate" },
          { id: "q-p1-2-c", label: "C", text: "EDV − ESV × Contractility" },
          { id: "q-p1-2-d", label: "D", text: "Preload × Afterload" },
        ],
      },
      {
        id: "q-p1-3",
        topic: "Frank-Starling",
        subject: "Physiology",
        prompt: "Frank-Starling's law states that stroke volume increases with increased:",
        explanation: "Frank-Starling mechanism: as end-diastolic volume (preload) increases, myocardial fibres are stretched more, leading to a stronger contraction and greater stroke volume. This is intrinsic autoregulation of the heart.",
        difficulty: "medium",
        correctOptionId: "q-p1-3-a",
        options: [
          { id: "q-p1-3-a", label: "A", text: "Preload (end-diastolic volume)" },
          { id: "q-p1-3-b", label: "B", text: "Afterload" },
          { id: "q-p1-3-c", label: "C", text: "Heart rate" },
          { id: "q-p1-3-d", label: "D", text: "Peripheral vascular resistance" },
        ],
      },
      {
        id: "q-p1-4",
        topic: "Action Potentials",
        subject: "Physiology",
        prompt: "The plateau phase (Phase 2) of the ventricular action potential is mainly due to:",
        explanation: "Phase 2 (plateau) is maintained by slow L-type Ca²⁺ channel opening balanced by K⁺ efflux. The calcium influx triggers further release from the sarcoplasmic reticulum (calcium-induced calcium release), driving contraction.",
        difficulty: "medium",
        correctOptionId: "q-p1-4-c",
        options: [
          { id: "q-p1-4-a", label: "A", text: "Na⁺ influx" },
          { id: "q-p1-4-b", label: "B", text: "K⁺ efflux" },
          { id: "q-p1-4-c", label: "C", text: "Ca²⁺ influx (L-type channels)" },
          { id: "q-p1-4-d", label: "D", text: "Cl⁻ influx" },
        ],
      },
      {
        id: "q-p1-5",
        topic: "Cardiac Output",
        subject: "Physiology",
        prompt: "In heart failure, which compensatory mechanism initially maintains cardiac output?",
        explanation: "Initially, the heart compensates via the Frank-Starling mechanism — increased EDV stretches myocytes, boosting stroke volume. Other compensations (sympathetic activation, RAAS) also activate but Starling is the primary intrinsic mechanism.",
        difficulty: "hard",
        correctOptionId: "q-p1-5-b",
        options: [
          { id: "q-p1-5-a", label: "A", text: "Tachycardia alone" },
          { id: "q-p1-5-b", label: "B", text: "Frank-Starling mechanism (increased preload)" },
          { id: "q-p1-5-c", label: "C", text: "Decreased afterload" },
          { id: "q-p1-5-d", label: "D", text: "Reduced systemic vascular resistance" },
        ],
      },
    ],
  },
  {
    id: "quiz-pharmacology-1",
    title: "Pharmacology: Autonomic Drugs",
    description: "MCQs on adrenergic and cholinergic pharmacology — key for NEET PG exams.",
    subject: "Pharmacology",
    examTrack: "NEET_PG",
    durationMinutes: 20,
    difficulty: "hard",
    topicFocus: "Adrenergic Drugs,Cholinergic Drugs,Beta Blockers",
    questions: [
      {
        id: "q-ph1-1",
        topic: "Adrenergic Drugs",
        subject: "Pharmacology",
        prompt: "Adrenaline (epinephrine) acts on which receptors?",
        explanation: "Epinephrine acts on both α (α1, α2) and β (β1, β2) adrenoceptors. At low doses β2 effects dominate (vasodilation, bronchodilation). At high doses α1 effects dominate (vasoconstriction).",
        difficulty: "easy",
        correctOptionId: "q-ph1-1-d",
        options: [
          { id: "q-ph1-1-a", label: "A", text: "β1 only" },
          { id: "q-ph1-1-b", label: "B", text: "α1 only" },
          { id: "q-ph1-1-c", label: "C", text: "β1 and β2 only" },
          { id: "q-ph1-1-d", label: "D", text: "α1, α2, β1, β2" },
        ],
      },
      {
        id: "q-ph1-2",
        topic: "Beta Blockers",
        subject: "Pharmacology",
        prompt: "Which beta-blocker is cardioselective (β1-selective)?",
        explanation: "Metoprolol selectively blocks β1 receptors at therapeutic doses, making it safer in asthmatic patients where β2 blockade would cause bronchoconstriction. Propranolol is non-selective (blocks both β1 and β2).",
        difficulty: "medium",
        correctOptionId: "q-ph1-2-b",
        options: [
          { id: "q-ph1-2-a", label: "A", text: "Propranolol" },
          { id: "q-ph1-2-b", label: "B", text: "Metoprolol" },
          { id: "q-ph1-2-c", label: "C", text: "Labetalol" },
          { id: "q-ph1-2-d", label: "D", text: "Carvedilol" },
        ],
      },
      {
        id: "q-ph1-3",
        topic: "Cholinergic Drugs",
        subject: "Pharmacology",
        prompt: "Atropine is used to treat organophosphate poisoning because it:",
        explanation: "Organophosphates inhibit acetylcholinesterase, causing excess ACh buildup and muscarinic overstimulation (SLUDGE symptoms). Atropine is a muscarinic antagonist that blocks these M-receptor effects. Pralidoxime regenerates the enzyme.",
        difficulty: "medium",
        correctOptionId: "q-ph1-3-a",
        options: [
          { id: "q-ph1-3-a", label: "A", text: "Blocks muscarinic receptors" },
          { id: "q-ph1-3-b", label: "B", text: "Blocks nicotinic receptors" },
          { id: "q-ph1-3-c", label: "C", text: "Regenerates acetylcholinesterase" },
          { id: "q-ph1-3-d", label: "D", text: "Activates adrenergic receptors" },
        ],
      },
      {
        id: "q-ph1-4",
        topic: "Adrenergic Drugs",
        subject: "Pharmacology",
        prompt: "Dopamine at low doses (2–5 mcg/kg/min) primarily acts on which receptors?",
        explanation: "At low 'renal doses', dopamine stimulates D1 receptors in renal and mesenteric vasculature causing vasodilation and increased renal perfusion. At higher doses it activates β1 (cardiac) and then α1 (vasoconstriction).",
        difficulty: "hard",
        correctOptionId: "q-ph1-4-c",
        options: [
          { id: "q-ph1-4-a", label: "A", text: "β1 adrenoceptors" },
          { id: "q-ph1-4-b", label: "B", text: "α1 adrenoceptors" },
          { id: "q-ph1-4-c", label: "C", text: "D1 dopamine receptors" },
          { id: "q-ph1-4-d", label: "D", text: "β2 adrenoceptors" },
        ],
      },
      {
        id: "q-ph1-5",
        topic: "Cholinergic Drugs",
        subject: "Pharmacology",
        prompt: "Neostigmine is used to reverse neuromuscular blockade because it:",
        explanation: "Neostigmine inhibits acetylcholinesterase, increasing ACh at the neuromuscular junction. More ACh competes with non-depolarizing muscle relaxants (e.g., vecuronium) at nicotinic receptors, reversing the block.",
        difficulty: "hard",
        correctOptionId: "q-ph1-5-b",
        options: [
          { id: "q-ph1-5-a", label: "A", text: "Directly stimulates nicotinic receptors" },
          { id: "q-ph1-5-b", label: "B", text: "Inhibits acetylcholinesterase enzyme" },
          { id: "q-ph1-5-c", label: "C", text: "Blocks muscarinic receptors" },
          { id: "q-ph1-5-d", label: "D", text: "Releases ACh from nerve terminals" },
        ],
      },
    ],
  },
];

async function main() {
  console.log("Starting seed...");

  await prisma.enrollment.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.questionOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const passwordHash = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.create({
    data: { fullName: "Admin User", email: "admin@medlearn.com", passwordHash, role: "admin", examTrack: "MBBS", streakDays: 45 },
  });
  const student = await prisma.user.create({
    data: { fullName: "Priya Sharma", email: "priya@example.com", passwordHash, role: "student", examTrack: "NEET_PG", streakDays: 12 },
  });
  console.log(`Created users: ${admin.email}, ${student.email}`);

  // Courses
  let cCount = 0;
  for (const c of courses) {
    try {
      await prisma.course.create({
        data: {
          id: c.id, slug: c.slug, title: c.title, description: c.description,
          section: c.section || "General", subject: c.subject, difficulty: c.difficulty,
          durationHours: c.durationHours, educator: c.educator || "MedLearn Faculty",
          thumbnailUrl: c.thumbnailUrl || "", enrolledStudents: c.enrolledStudents || 0,
          tags: c.tags.join(","),
        },
      });
      cCount++;
    } catch (e) { /* skip duplicates */ }
  }
  console.log(`Seeded ${cCount} courses.`);

  // Enroll student in 3 courses
  const allCourses = await prisma.course.findMany({ take: 3 });
  for (const c of allCourses) {
    await prisma.enrollment.create({ data: { userId: student.id, courseId: c.id, progressPercent: Math.floor(Math.random() * 70) } });
  }

  // Books
  let bCount = 0;
  for (const b of books) {
    await prisma.book.create({
      data: {
        id: b.id, title: b.title, author: b.author, category: b.category,
        subject: b.subject, edition: b.edition, coverUrl: b.coverUrl,
        description: b.description, featured: b.featured, tags: b.tags.join(","),
      },
    });
    bCount++;
  }
  console.log(`Seeded ${bCount} books.`);

  // Quizzes with questions
  for (const quiz of quizSeed) {
    const { questions, ...quizData } = quiz;
    const createdQuiz = await prisma.quiz.create({
      data: { ...quizData, totalQuestions: questions.length },
    });

    for (const q of questions) {
      const { options, ...qData } = q;
      await prisma.question.create({
        data: {
          ...qData,
          quizId: createdQuiz.id,
          options: { create: options },
        },
      });
    }
    console.log(`Seeded quiz: ${quiz.title} (${questions.length} questions)`);
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
