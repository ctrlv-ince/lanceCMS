"use client";

import Image from "next/image";
import { useState } from "react";

/* ─── Data ─────────────────────────────────────────────── */
const LECTURES = [
  {
    id: "sap3",
    code: "SAP-3",
    title: "Simple As Possible 3",
    description:
      "Advanced computer architecture covering 8-bit data bus, 16-bit address bus, ALU operations, and extended instruction set.",
    thumb: "/thumb_sap3.jpg",
    accent: "#F05A31",
    accentSoft: "#FFF0EA",
    tag: "Architecture",
    slides: 0, // will be populated when PPTX is added
    pptUrl: null as string | null,
  },
  {
    id: "raspi1",
    code: "RASPI-1",
    title: "Raspberry Pi 1",
    description:
      "Introduction to the Raspberry Pi platform — BCM2835 SoC, GPIO interfaces, architecture overview, and hands-on setup.",
    thumb: "/thumb_raspi1.jpg",
    accent: "#C0003C",
    accentSoft: "#FFF0F3",
    tag: "Embedded Systems",
    slides: 0,
    pptUrl: null as string | null,
  },
];

/* ─── Modal ─────────────────────────────────────────────── */
function LectureModal({
  lecture,
  onClose,
}: {
  lecture: (typeof LECTURES)[0];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-7 py-5"
          style={{ background: lecture.accent }}
        >
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-white/20 px-3 py-1.5 text-sm font-black uppercase tracking-widest text-white">
              {lecture.code}
            </span>
            <span className="text-lg font-bold text-white">
              {lecture.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* PPT Viewer area */}
        <div className="flex flex-col items-center justify-center bg-[#f8f8fb] px-8 py-16 text-center">
          {lecture.pptUrl ? (
            <iframe
              src={lecture.pptUrl}
              className="h-[500px] w-full rounded-2xl border border-gray-200 shadow-md"
              title={lecture.title}
            />
          ) : (
            <>
              {/* Placeholder — PPT not uploaded yet */}
              <div
                className="mb-5 grid h-24 w-24 place-items-center rounded-3xl text-4xl shadow-lg"
                style={{ backgroundColor: lecture.accentSoft, color: lecture.accent }}
              >
                📊
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight text-gray-900">
                Presentation coming soon
              </h3>
              <p className="mt-2 max-w-sm text-base leading-7 text-gray-500">
                The PPTX file for{" "}
                <span className="font-bold" style={{ color: lecture.accent }}>
                  {lecture.code}
                </span>{" "}
                hasn&apos;t been uploaded yet. Once it&apos;s added in Sanity CMS,
                it will appear here automatically.
              </p>
              <div
                className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-base font-bold"
                style={{ backgroundColor: lecture.accentSoft, color: lecture.accent }}
              >
                🗄️ Upload via Sanity Studio →
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Card ──────────────────────────────────────────────── */
function LectureCard({
  lecture,
  onOpen,
}: {
  lecture: (typeof LECTURES)[0];
  onOpen: () => void;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.14)]">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={lecture.thumb}
          alt={`${lecture.code} thumbnail`}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/40">
          <button
            onClick={onOpen}
            className="scale-0 rounded-2xl px-5 py-3 text-base font-black text-white opacity-0 shadow-xl transition duration-300 group-hover:scale-100 group-hover:opacity-100"
            style={{ backgroundColor: lecture.accent }}
          >
            ▶ View Presentation
          </button>
        </div>
        {/* Tag badge */}
        <span
          className="absolute left-4 top-4 rounded-full px-3 py-1 text-[13px] font-black uppercase tracking-widest"
          style={{ backgroundColor: lecture.accentSoft, color: lecture.accent }}
        >
          {lecture.tag}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        {/* Code badge */}
        <div className="mb-3 flex items-center gap-2">
          <span
            className="rounded-lg px-2.5 py-1 text-sm font-black tracking-widest"
            style={{ backgroundColor: lecture.accentSoft, color: lecture.accent }}
          >
            {lecture.code}
          </span>
          {lecture.pptUrl ? (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[13px] font-bold text-emerald-600">
              ● Available
            </span>
          ) : (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[13px] font-bold text-amber-600">
              ○ Coming Soon
            </span>
          )}
        </div>

        <h3 className="text-xl font-extrabold tracking-tight text-gray-900">
          {lecture.title}
        </h3>
        <p className="mt-2 flex-1 text-base leading-7 text-gray-500">
          {lecture.description}
        </p>

        {/* Divider */}
        <div className="my-5 border-t border-gray-100" />

        {/* CTA */}
        <button
          onClick={onOpen}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-base font-bold text-white transition hover:brightness-95"
          style={{ backgroundColor: lecture.accent }}
        >
          Open Lecture <span>→</span>
        </button>
      </div>
    </article>
  );
}

/* ─── Main export ───────────────────────────────────────── */
export function LectureViewer() {
  const [open, setOpen] = useState<(typeof LECTURES)[0] | null>(null);

  return (
    <>
      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {LECTURES.map((lec) => (
          <LectureCard key={lec.id} lecture={lec} onOpen={() => setOpen(lec)} />
        ))}
      </div>

      {/* Modal */}
      {open && <LectureModal lecture={open} onClose={() => setOpen(null)} />}
    </>
  );
}
