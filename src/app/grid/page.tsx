"use client";

import { useMemo, useState } from "react";
import { Copy, Download, Grid3X3, Image, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { gridSpec, gridVariations, type GridVariation } from "@/data/grid-spec";

const textLock = "5110 · AE · vics";

function frameStyle(frame: GridVariation) {
  const seed = frame.id;
  return {
    transform: `rotate(${((seed % 5) - 2) * 0.8}deg)`,
    background: `radial-gradient(circle at ${18 + (seed * 13) % 64}% ${16 + (seed * 17) % 68}%, rgba(255,255,255,.10), transparent 32%), linear-gradient(${120 + seed % 70}deg, #050505 0%, #101010 46%, #020202 100%)`,
  } as const;
}

function copySpec() {
  const payload = JSON.stringify(
    {
      format: { type: "contact_sheet", grid: { rows: 10, columns: 10, total_frames: 100, aspect_ratio: "1:1" } },
      global_subject: { type: gridSpec.subject, background: gridSpec.background, palette: gridSpec.palette },
      mandatory_text: [
        { text: "5110", color: "white", style: "bold distressed serif graffiti" },
        { text: "AE", color: "orange", style: "large angular block graffiti" },
        { text: "vics", color: "orange", style: "smaller handwritten graffiti" },
      ],
      grid_variation: gridSpec.frameRule,
      frames: gridVariations,
    },
    null,
    2,
  );
  navigator.clipboard?.writeText(payload);
}

export default function GridStudioPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<GridVariation | null>(null);
  const [cameraOnly, setCameraOnly] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return gridVariations.filter((frame) => {
      const matchesQuery = !q || Object.values(frame).join(" ").toLowerCase().includes(q);
      const matchesCamera = cameraOnly === "all" || frame.camera === cameraOnly;
      return matchesQuery && matchesCamera;
    });
  }, [query, cameraOnly]);

  const cameras = useMemo(() => Array.from(new Set(gridVariations.map((frame) => frame.camera))), []);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-[1800px] px-3 py-3 sm:px-5 sm:py-5">
        <header className="sticky top-3 z-30 mb-4 rounded-2xl border border-white/10 bg-black/75 p-3 backdrop-blur-xl sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white text-black"><Grid3X3 size={17} /></div>
              <div>
                <h1 className="text-sm font-semibold tracking-tight">RepoDope / Grid Studio</h1>
                <p className="text-[11px] text-white/40">{gridSpec.rows}×{gridSpec.columns} · {gridSpec.totalFrames} frames · exact text lock</p>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-2 lg:justify-end">
              <div className="relative min-w-[220px] flex-1 lg:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search frame variations…" className="w-full rounded-xl border border-white/10 bg-white/[.05] py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-white/25 focus:border-white/20"/></div>
              <select value={cameraOnly} onChange={(e) => setCameraOnly(e.target.value)} className="rounded-xl border border-white/10 bg-white/[.05] px-3 py-2.5 text-xs text-white outline-none"><option value="all">All cameras</option>{cameras.map((camera) => <option key={camera}>{camera}</option>)}</select>
              <button type="button" onClick={() => { setQuery(""); setCameraOnly("all"); }} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.05] px-3 py-2.5 text-xs text-white/70 hover:bg-white/10"><RotateCcw size={13}/>Reset</button>
              <button type="button" onClick={copySpec} className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-semibold text-black hover:bg-white/90"><Copy size={13}/>Copy JSON</button>
            </div>
          </div>
        </header>

        <section className="mb-4 rounded-2xl border border-white/10 bg-white/[.035] p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.2em] text-white/35"><SlidersHorizontal size={12}/>Specification</div>
              <p className="max-w-4xl text-sm leading-6 text-white/60">100 distinct frames of the same dark weathered monolith. The only permitted text is <strong className="text-white">{textLock}</strong>. Variation is limited to camera, lighting, crop, texture, perspective and rotation.</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Spec label="Frames" value="100"/>
              <Spec label="Grid" value="10×10"/>
              <Spec label="Text" value="3 locked"/>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-black">
          <div className="grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 2xl:grid-cols-10">
            {filtered.map((frame) => (
              <button key={frame.id} type="button" onClick={() => setSelected(frame)} className="group relative aspect-square overflow-hidden bg-[#080808] text-left">
                <div className="absolute inset-2 rounded-lg border border-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,.02)]" style={frameStyle(frame)}>
                  <div className="absolute inset-[20%_17%_9%_20%] rounded-[42%_38%_28%_34%] border border-white/10 bg-gradient-to-br from-[#1c1c1c] via-[#0c0c0c] to-[#020202] shadow-[inset_-18px_-12px_26px_rgba(0,0,0,.85),inset_10px_8px_18px_rgba(255,255,255,.05),0_12px_28px_rgba(0,0,0,.65)]">
                    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: `repeating-linear-gradient(${12 + frame.id % 35}deg, transparent 0 12px, rgba(255,255,255,.06) 13px 14px, transparent 15px 29px)` }} />
                    <div className="absolute left-[12%] top-[18%] text-[clamp(7px,1.1vw,14px)] font-black tracking-tight text-white/85">5110</div>
                    <div className="absolute bottom-[23%] left-[14%] text-[clamp(9px,1.4vw,18px)] font-black italic tracking-[-.08em] text-orange-300">AE</div>
                    <div className="absolute bottom-[13%] left-[19%] text-[clamp(5px,.8vw,11px)] italic text-orange-300">vics</div>
                  </div>
                </div>
                <div className="absolute inset-x-2 bottom-2 flex items-center justify-between rounded-md bg-black/65 px-2 py-1 text-[9px] text-white/55 backdrop-blur-sm"><span>#{String(frame.id).padStart(2, "0")}</span><span className="truncate pl-2">{frame.camera}</span></div>
                <div className="absolute inset-0 bg-white/0 transition group-hover:bg-white/[.03]" />
              </button>
            ))}
          </div>
        </section>

        <div className="mt-3 flex items-center justify-between px-1 text-[10px] text-white/30"><span>{filtered.length} / {gridSpec.totalFrames} frames</span><span>AE · 5110 · vics only</span></div>
      </div>

      {selected && <div className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur-md" onClick={() => setSelected(null)}><div className="mx-auto mt-[4vh] max-h-[92vh] max-w-3xl overflow-auto rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="aspect-square max-h-[65vh] bg-[#050505] p-6 sm:p-10"><div className="relative h-full overflow-hidden rounded-2xl border border-white/10" style={frameStyle(selected)}><div className="absolute inset-[17%_16%_8%_20%] rounded-[42%_38%_28%_34%] border border-white/10 bg-gradient-to-br from-[#202020] via-[#0b0b0b] to-[#010101] shadow-[inset_-30px_-20px_40px_rgba(0,0,0,.9),inset_20px_10px_30px_rgba(255,255,255,.05),0_28px_70px_rgba(0,0,0,.8)]"><div className="absolute inset-0 opacity-60" style={{ backgroundImage: `repeating-linear-gradient(${12 + selected.id % 35}deg, transparent 0 16px, rgba(255,255,255,.07) 17px 19px, transparent 20px 43px)` }} /><div className="absolute left-[13%] top-[19%] text-[clamp(24px,5vw,58px)] font-black text-white/90">5110</div><div className="absolute bottom-[24%] left-[14%] text-[clamp(31px,6vw,74px)] font-black italic tracking-[-.09em] text-orange-300">AE</div><div className="absolute bottom-[13%] left-[19%] text-[clamp(15px,2.5vw,28px)] italic text-orange-300">vics</div></div></div></div>
        <div className="border-t border-white/10 p-5"><div className="flex flex-wrap items-center gap-2"><span className="rounded-lg bg-white/10 px-2 py-1 text-[11px] text-white/70">Frame #{selected.id}</span><span className="rounded-lg bg-white/10 px-2 py-1 text-[11px] text-white/70">{selected.camera}</span><span className="rounded-lg bg-white/10 px-2 py-1 text-[11px] text-white/70">{selected.light}</span></div><div className="mt-4 grid gap-3 text-xs text-white/55 sm:grid-cols-2"><Detail label="Crop" value={selected.crop}/><Detail label="Texture" value={selected.texture}/><Detail label="Perspective" value={selected.perspective}/><Detail label="Rotation" value={selected.rotation}/></div><div className="mt-5 flex gap-2"><button type="button" onClick={() => navigator.clipboard?.writeText(JSON.stringify(selected, null, 2))} className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-semibold text-black"><Copy size={13}/>Copy frame JSON</button><button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-white/10 px-3 py-2.5 text-xs text-white/70 hover:bg-white/5">Close</button></div></div>
      </div></div>}
    </main>
  );
}

function Spec({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-white/8 bg-black/20 px-3 py-3"><div className="text-[10px] uppercase tracking-[.15em] text-white/30">{label}</div><div className="mt-1 text-sm font-semibold text-white">{value}</div></div>; }
function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-white/8 bg-white/[.025] p-3"><div className="text-[10px] uppercase tracking-[.15em] text-white/25">{label}</div><div className="mt-1 text-white/70">{value}</div></div>; }
