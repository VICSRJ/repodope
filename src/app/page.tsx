"use client";

import {
  Activity,
  Boxes,
  ChevronRight,
  GitBranch,
  Github,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Star,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const repositories = [
  { name: "repodope", description: "Lightweight developer workspace for GitHub projects.", language: "TypeScript", updated: "now", stars: 0, branch: "main", url: "https://github.com/VICSRJ/repodope" },
  { name: "notion-style-editor-components220", description: "Notion-like editor components and interaction patterns.", language: "TypeScript", updated: "yesterday", stars: 3, branch: "main", url: "https://github.com/VICSRJ/notion-style-editor-components220" },
  { name: "akcizur.github.io", description: "Experimental frontend, motion and visual interaction playground.", language: "HTML", updated: "3d", stars: 1, branch: "main", url: "https://github.com/AKCIZUR/akcizur.github.io" },
];

const activities = [
  { type: "commit", title: "fix: make GitHub Pages deployment reliable", repo: "repodope", time: "today" },
  { type: "deploy", title: "GitHub Pages deployment succeeded", repo: "repodope", time: "today" },
  { type: "branch", title: "main updated", repo: "notion-style-editor-components220", time: "yesterday" },
  { type: "release", title: "UI foundation updated", repo: "akcizur.github.io", time: "3d" },
];

const nav = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Repositories", icon: Boxes },
  { label: "Activity", icon: Activity },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [customProjects, setCustomProjects] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("repodope-projects");
      if (stored) setCustomProjects(JSON.parse(stored));
    } catch {
      // Ignore malformed local state.
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
        setProjectOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredRepos = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return repositories;
    return repositories.filter((repo) => `${repo.name} ${repo.description} ${repo.language}`.toLowerCase().includes(q));
  }, [query]);

  const selectNav = (label: string) => {
    setActiveNav(label);
    setQuery("");
  };

  const createProject = () => {
    const name = window.prompt("Název projektu", "new-project");
    if (!name?.trim()) return;
    const next = [...customProjects, name.trim()];
    setCustomProjects(next);
    localStorage.setItem("repodope-projects", JSON.stringify(next));
    setProjectOpen(false);
    setActiveNav("Overview");
  };

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-[#111] selection:bg-black selection:text-white">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        <aside className="hidden w-[250px] shrink-0 border-r border-black/8 bg-white/75 px-4 py-5 backdrop-blur-xl lg:flex lg:flex-col">
          <div className="flex items-center gap-2 px-3 pb-6">
            <div className="flex size-8 items-center justify-center rounded-xl bg-black text-white"><Github size={16} strokeWidth={2.4} /></div>
            <div><div className="text-sm font-semibold tracking-tight">RepoDope</div><div className="text-[11px] text-black/45">Developer workspace</div></div>
          </div>
          <nav className="space-y-1">
            {nav.map(({ label, icon: Icon }) => (
              <button key={label} onClick={() => selectNav(label)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${activeNav === label ? "bg-black text-white shadow-[0_7px_20px_rgba(0,0,0,.12)]" : "text-black/62 hover:bg-black/[.05] hover:text-black"}`}>
                <Icon size={16} /><span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto space-y-1 pt-6">
            <button onClick={() => setProjectOpen(true)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-black/58 transition hover:bg-black/[.05] hover:text-black"><Settings size={16} /> Settings</button>
            <div className="mt-4 rounded-2xl border border-black/7 bg-[#f8f8f6] p-3 shadow-[inset_0_1px_0_white,0_8px_30px_rgba(0,0,0,.035)]">
              <div className="text-[10px] font-semibold uppercase tracking-[.18em] text-black/35">Workspace</div>
              <div className="mt-1 text-sm font-medium">VICSRJ</div>
              <div className="mt-1 text-xs text-black/45">GitHub Pages ready</div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-black/7 bg-[#f5f5f3]/90 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 lg:hidden"><div className="flex size-8 items-center justify-center rounded-xl bg-black text-white"><Github size={15} /></div><span className="text-sm font-semibold">RepoDope</span></div>
              <button onClick={() => setCommandOpen(true)} className="ml-auto flex w-full max-w-md items-center gap-3 rounded-xl border border-black/8 bg-white/80 px-3 py-2 text-left text-sm text-black/40 shadow-[inset_0_1px_0_white,0_6px_18px_rgba(0,0,0,.03)] hover:border-black/15 hover:text-black/65">
                <Search size={15} /><span className="flex-1">Search repositories, projects, activity…</span><kbd className="hidden rounded-md border border-black/10 bg-black/[.03] px-1.5 py-0.5 text-[10px] sm:inline">⌘ K</kbd>
              </button>
              <button onClick={() => setProjectOpen(true)} aria-label="Create project" className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-black/8 bg-white/75 text-black/55 hover:bg-white hover:text-black"><Plus size={17} /></button>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div><div className="mb-2 text-xs font-semibold uppercase tracking-[.18em] text-black/35">{activeNav}</div><h1 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{activeNav === "Overview" ? "Your workspace" : activeNav}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-black/48 sm:text-base">{activeNav === "Overview" ? "A lightweight command center for repositories, projects and development activity." : activeNav === "Repositories" ? "Search and open your connected repositories." : "Recent repository and deployment changes."}</p></div>
                <button onClick={() => setProjectOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_rgba(0,0,0,.15)] hover:-translate-y-0.5"><Plus size={16} /> New project</button>
              </div>

              {activeNav !== "Activity" && <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[["Repositories", String(repositories.length), "Tracked repositories"],["Active", "03", "Updated recently"],["Branches", "31", "Across projects"],["Deployments", "12", "This month"]].map(([label, value, note]) => <button key={label} onClick={() => label === "Repositories" && selectNav("Repositories")} className="rounded-2xl border border-black/7 bg-white/80 p-4 text-left shadow-[inset_0_1px_0_white,0_10px_30px_rgba(0,0,0,.04)] transition hover:-translate-y-0.5"><div className="text-xs text-black/40">{label}</div><div className="mt-2 text-2xl font-semibold">{value}</div><div className="mt-1 text-xs text-black/35">{note}</div></button>)}
              </div>}

              {activeNav === "Activity" ? <section className="rounded-2xl border border-black/7 bg-white/80 shadow-[inset_0_1px_0_white,0_14px_40px_rgba(0,0,0,.045)]"><div className="border-b border-black/6 px-5 py-4"><h2 className="text-sm font-semibold">Activity</h2><p className="mt-0.5 text-xs text-black/35">Latest changes across workspace</p></div><div className="divide-y divide-black/6">{activities.map((item, index) => <div key={`${item.title}-${index}`} className="flex gap-3 px-5 py-4"><div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/[.035] text-black/55">{item.type === "commit" ? <Github size={14}/> : item.type === "deploy" ? <Activity size={14}/> : item.type === "branch" ? <GitBranch size={14}/> : <Boxes size={14}/>}</div><div><div className="text-xs font-medium leading-5">{item.title}</div><div className="mt-1 text-[11px] text-black/35">{item.repo} · {item.time}</div></div></div>)}</div></section> : <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_.9fr]">
                <section className="min-w-0 rounded-2xl border border-black/7 bg-white/80 shadow-[inset_0_1px_0_white,0_14px_40px_rgba(0,0,0,.045)]"><div className="flex flex-col gap-3 border-b border-black/6 px-5 py-4 sm:flex-row sm:items-center"><div><h2 className="text-sm font-semibold">Repositories</h2><p className="mt-0.5 text-xs text-black/35">{filteredRepos.length} matching repository{filteredRepos.length === 1 ? "" : "ies"}</p></div><div className="relative sm:ml-auto sm:w-56"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/30" size={14}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter repositories" className="w-full rounded-lg border border-black/7 bg-black/[.025] py-2 pl-8 pr-3 text-xs outline-none focus:border-black/20 focus:bg-white"/></div></div><div className="divide-y divide-black/6">{filteredRepos.map((repo) => <a key={repo.name} href={repo.url} target="_blank" rel="noreferrer" className="group flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-black/[.02]"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-black/7 bg-black/[.025] text-black/60"><Github size={16}/></div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="truncate text-sm font-semibold">{repo.name}</span><span className="rounded-md bg-black/[.045] px-1.5 py-0.5 text-[10px]">public</span></div><p className="mt-1 truncate text-xs text-black/42">{repo.description}</p><div className="mt-2 flex items-center gap-3 text-[11px] text-black/35"><span>{repo.language}</span><span className="inline-flex items-center gap-1"><GitBranch size={11}/>{repo.branch}</span><span className="inline-flex items-center gap-1"><Star size={11}/>{repo.stars}</span></div></div><ChevronRight className="text-black/25 transition-transform group-hover:translate-x-0.5" size={15}/></a>)}{filteredRepos.length === 0 && <div className="px-5 py-10 text-center text-sm text-black/35">No repositories found.</div>}</div></section>
                <section className="rounded-2xl border border-black/7 bg-white/80 shadow-[inset_0_1px_0_white,0_14px_40px_rgba(0,0,0,.045)]"><div className="border-b border-black/6 px-5 py-4"><h2 className="text-sm font-semibold">Recent activity</h2></div><div className="divide-y divide-black/6">{activities.slice(0, 4).map((item, index) => <div key={`${item.title}-${index}`} className="flex gap-3 px-5 py-4"><div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/[.035] text-black/55"><Activity size={14}/></div><div className="min-w-0"><div className="truncate text-xs font-medium">{item.title}</div><div className="mt-1 text-[11px] text-black/35">{item.repo} · {item.time}</div></div></div>)}</div></section>
              </div>}

              {customProjects.length > 0 && <section className="mt-6 rounded-2xl border border-black/7 bg-white/80 p-5"><h2 className="text-sm font-semibold">Your local projects</h2><div className="mt-3 flex flex-wrap gap-2">{customProjects.map((project) => <button key={project} onClick={() => setQuery(project)} className="rounded-lg border border-black/8 bg-black/[.025] px-3 py-2 text-xs hover:bg-black/[.05]">{project}</button>)}</div></section>}
            </div>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-3 bottom-3 z-30 rounded-2xl border border-black/8 bg-white/92 p-1.5 shadow-[0_14px_45px_rgba(0,0,0,.13)] backdrop-blur-xl lg:hidden"><div className="grid grid-cols-3 gap-1">{nav.map(({ label, icon: Icon }) => <button key={label} onClick={() => selectNav(label)} className={`flex items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-medium ${activeNav === label ? "bg-black text-white" : "text-black/50"}`}><Icon size={14}/>{label}</button>)}</div></div>

      {commandOpen && <div className="fixed inset-0 z-50 bg-black/25 p-4 backdrop-blur-sm" onClick={() => setCommandOpen(false)}><div className="mx-auto mt-[12vh] max-w-xl overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_25px_80px_rgba(0,0,0,.22)]" onClick={(e) => e.stopPropagation()}><div className="flex items-center gap-3 border-b border-black/7 px-4 py-3"><Search size={16} className="text-black/35"/><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search RepoDope…" className="flex-1 bg-transparent text-sm outline-none"/><button onClick={() => setCommandOpen(false)} aria-label="Close"><X size={16}/></button></div><div className="p-2"><button onClick={() => { selectNav("Repositories"); setCommandOpen(false); }} className="w-full rounded-xl px-3 py-3 text-left text-sm hover:bg-black/[.04]">Open repositories</button><button onClick={() => { selectNav("Activity"); setCommandOpen(false); }} className="w-full rounded-xl px-3 py-3 text-left text-sm hover:bg-black/[.04]">Open activity</button><button onClick={() => { setCommandOpen(false); setProjectOpen(true); }} className="w-full rounded-xl px-3 py-3 text-left text-sm hover:bg-black/[.04]">Create project</button></div></div></div>}

      {projectOpen && <div className="fixed inset-0 z-50 bg-black/25 p-4 backdrop-blur-sm" onClick={() => setProjectOpen(false)}><div className="mx-auto mt-[18vh] max-w-md rounded-2xl border border-black/8 bg-white p-5 shadow-[0_25px_80px_rgba(0,0,0,.22)]" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between"><div><h2 className="font-semibold">New project</h2><p className="mt-1 text-xs text-black/40">Create a local project shortcut.</p></div><button onClick={() => setProjectOpen(false)} aria-label="Close"><X size={17}/></button></div><button onClick={createProject} className="mt-5 w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white hover:opacity-90">Create project</button></div></div>}
    </main>
  );
}
