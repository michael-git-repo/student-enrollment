"use client";

import { FormEvent, useEffect, useState } from "react";

type Enrollment = { id: string; firstName: string; lastName: string; email: string; dateOfBirth: string; course: string; phone: string; address: string; createdAt: string };
const emptyForm = { firstName: "", lastName: "", email: "", dateOfBirth: "", course: "", phone: "", address: "" };

export default function Home() {
  const [form, setForm] = useState(emptyForm);
  const [students, setStudents] = useState<Enrollment[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/enrollments", { cache: "no-store" })
      .then(async (response) => ({ response, data: await response.json() }))
      .then(({ response, data }) => {
        if (!cancelled && response.ok) setStudents(data.enrollments);
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load enrolled students.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    const response = await fetch("/api/enrollments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) { setError(data.error ?? "Please check the form."); return; }
    setForm(emptyForm); setMessage("Student enrolled successfully."); setStudents((current) => [data.enrollment, ...current]);
  }

  return <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 sm:py-14">
    <header className="mb-8 flex items-start gap-4 sm:mb-10"><div className="brand-mark">ME</div><div><p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Michael Enrollment Portal</p><h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Add a new student</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">Capture enrollment details and keep your student register in one place.</p></div></header>
    <div className="notice mb-8"><span className="notice-icon">!</span><p><strong>Demo warning:</strong> this first version has no login and is for synthetic data only. Do not enter real student information.</p></div>
    <section className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
      <form onSubmit={submit} className="panel rounded-2xl p-6 sm:p-8"><div className="mb-6"><p className="section-kicker">New record</p><h2 className="mt-1 text-2xl font-semibold text-slate-950">Enrollment details</h2></div><div className="grid gap-4 sm:grid-cols-2">
        {([["firstName","First name","text"],["lastName","Last name","text"],["email","Email","email"],["dateOfBirth","Date of birth","date"],["course","Course or program","text"],["phone","Phone","tel"]] as const).map(([name, label, type]) => <label key={name} className="field-label">{label}<input required type={type} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} className="field-input" /></label>)}
        <label className="field-label sm:col-span-2">Address<textarea required rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="field-input resize-none" /></label>
      </div><button disabled={saving} className="submit-button mt-6 w-full">{saving ? "Saving…" : "Enroll student"}<span aria-hidden="true">→</span></button>{message && <p className="status-success mt-3">{message}</p>}{error && <p className="status-error mt-3">{error}</p>}</form>
      <section className="panel rounded-2xl p-6 sm:p-8"><div className="mb-6 flex items-end justify-between"><div><p className="section-kicker">Student register</p><h2 className="mt-1 text-2xl font-semibold text-slate-950">Enrolled students</h2></div><span className="count-badge">{students.length} total</span></div>{students.length === 0 ? <p className="empty-state">No students enrolled yet.</p> : <div className="grid gap-3">{students.map((student) => <article key={student.id} className="student-card"><div className="flex justify-between gap-3"><div><h3 className="font-semibold text-slate-950">{student.firstName} {student.lastName}</h3><p className="mt-1 text-sm font-medium text-blue-700">{student.course}</p></div><span className="date-badge">{new Date(student.createdAt).toLocaleDateString()}</span></div><div className="mt-4 grid gap-1 text-sm text-slate-600"><p>{student.email} · {student.phone}</p><p><span className="font-medium text-slate-700">DOB:</span> {student.dateOfBirth} · {student.address}</p></div></article>)}</div>}</section>
    </section>
  </main>;
}
