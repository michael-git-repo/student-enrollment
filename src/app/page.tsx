"use client";

import { FormEvent, useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

type Enrollment = { id: string; firstName: string; lastName: string; sex?: string; email: string; dateOfBirth: string; course: string; phone: string; address: string; createdAt: string };
const emptyForm = { firstName: "", lastName: "", sex: "", email: "", dateOfBirth: "", course: "", phone: "", address: "" };
const exportHeaders = ["S/N", "First name", "Last name", "Sex", "Date of birth", "Course", "Email", "Phone", "Address", "Enrolled"];

function exportRows(students: Enrollment[]) {
  return students.map((student, index) => [
    index + 1,
    student.firstName,
    student.lastName,
    student.sex ?? "",
    student.dateOfBirth,
    student.course,
    student.email,
    student.phone,
    student.address,
    new Date(student.createdAt).toLocaleDateString(),
  ]);
}

function downloadBlob(content: BlobPart, fileName: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

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

  function downloadCsv() {
    const csv = [exportHeaders, ...exportRows(students)]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    downloadBlob(`\uFEFF${csv}`, "student-enrollments.csv", "text/csv;charset=utf-8");
  }

  function downloadExcel() {
    const worksheet = XLSX.utils.aoa_to_sheet([exportHeaders, ...exportRows(students)]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enrollments");
    XLSX.writeFile(workbook, "student-enrollments.xlsx");
  }

  function downloadPdf() {
    const pdf = new jsPDF({ orientation: "landscape" });
    pdf.setFontSize(16);
    pdf.text("Michael Enrollment Portal - Student Register", 14, 15);
    autoTable(pdf, { head: [exportHeaders], body: exportRows(students), startY: 22, styles: { fontSize: 7 }, headStyles: { fillColor: [49, 94, 251] } });
    pdf.save("student-enrollments.pdf");
  }

  return <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 sm:py-14">
    <header className="mb-8 flex items-start gap-4 sm:mb-10"><div className="brand-mark">ME</div><div><p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Michael Enrollment Portal</p><h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Add a new student</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">Capture enrollment details and keep your student register in one place.</p></div></header>
    <div className="notice mb-8"><span className="notice-icon">!</span><p><strong>Demo warning:</strong> this first version has no login and is for synthetic data only. Do not enter real student information.</p></div>
    <section className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
      <form onSubmit={submit} className="panel rounded-2xl p-6 sm:p-8"><div className="mb-6"><p className="section-kicker">New record</p><h2 className="mt-1 text-2xl font-semibold text-slate-950">Enrollment details</h2></div><div className="grid gap-4 sm:grid-cols-2">
        {([["firstName","First name","text"],["lastName","Last name","text"],["email","Email","email"],["dateOfBirth","Date of birth","date"],["course","Course or program","text"],["phone","Phone","tel"]] as const).map(([name, label, type]) => <label key={name} className="field-label">{label}<input required type={type} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} className="field-input" /></label>)}
        <label className="field-label">Sex<select required value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })} className="field-input"><option value="">Select sex</option><option value="Female">Female</option><option value="Male">Male</option><option value="Other">Other</option><option value="Prefer not to say">Prefer not to say</option></select></label>
        <label className="field-label sm:col-span-2">Address<textarea required rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="field-input resize-none" /></label>
      </div><button disabled={saving} className="submit-button mt-6 w-full">{saving ? "Saving…" : "Enroll student"}<span aria-hidden="true">→</span></button>{message && <p className="status-success mt-3">{message}</p>}{error && <p className="status-error mt-3">{error}</p>}</form>
      <section className="panel rounded-2xl p-6 sm:p-8"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="section-kicker">Student register</p><h2 className="mt-1 text-2xl font-semibold text-slate-950">Enrolled students</h2></div><div className="flex flex-wrap items-center justify-end gap-2"><span className="count-badge">{students.length} total</span><button type="button" className="export-button" disabled={!students.length} onClick={downloadCsv}>CSV</button><button type="button" className="export-button" disabled={!students.length} onClick={downloadExcel}>Excel</button><button type="button" className="export-button export-button-primary" disabled={!students.length} onClick={downloadPdf}>PDF</button></div></div>{students.length === 0 ? <p className="empty-state">No students enrolled yet.</p> : <div className="table-wrap"><table className="student-table"><thead><tr>{exportHeaders.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{students.map((student, index) => <tr key={student.id}><td>{index + 1}</td><td className="font-semibold text-slate-950">{student.firstName}</td><td className="font-semibold text-slate-950">{student.lastName}</td><td>{student.sex ?? "—"}</td><td>{student.dateOfBirth}</td><td className="font-medium text-blue-700">{student.course}</td><td>{student.email}</td><td>{student.phone}</td><td>{student.address}</td><td>{new Date(student.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>}</section>
    </section>
  </main>;
}
