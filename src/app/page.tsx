"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Boxes,
  Check,
  ChevronRight,
  GitBranch,
  Github,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  X,
} from "lucide-react";

const repositories = [
  { name: "repodope", description: "Lightweight developer workspace for GitHub projects.", language: "TypeScript", updated: "now", updatedRank: 3, stars: 0, branch: "main", url: "https://github.com/VICSRJ/repodope" },
  { name: "notion-style-editor-components220", description: "Notion-like editor components and interaction patterns.", language: "TypeScript", updated: "yesterday", updatedRank: 2, stars: 3, branch: "main", url: "https://github.com/VICSRJ/notion-style-editor-components220" },
  { name: "akcizur.github.io", description: "Experimental frontend, motion and visual interaction playground.", language: "HTML", updated: "3d", updatedRank: 1, stars: 1, branch: "main", url: "https://github.com/AKCIZUR/akcizur.github.io" },
] as const;

const activities = [
  { type: "commit", title: "GitHub Pages deployment workflow fixed", repo: "repodope", time: "today" },
  { type: "deploy", title: "GitHub Pages deployment succeeded", repo: "repodope", time: "today" },
  { type: "branch", title: "main updated", repo: "notion-style-editor-components220", time: "yesterday" },
  { type: "release", title: "UI foundation updated", repo: "akcizur.github.io", time: "3d" },
] as const;

type View = "Overview" | "Repositories" | "Projects" | "Activity";
type Project = { id: string; name: string; repoNames: string[]; createdAt: string };
type Workspace = { favorites: string[]; projects: Project[]; reduceMotion: boolean; compact: boolean };

const STORAGE_KEY = "repodope-workspace";
const LEGACY_PROJECT_KEY = "repodope-projects";
const DEFAULT_WORKSPACE: Workspace = { favorites: [], projects: [], reduceMotion: false, compact: false };

function readWorkspace(): Workspace {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Workspace>;
      return {
        favorites: Array.isArray(parsed.favorites) ? parsed.favorites.filter((x): x is string => typeof x === "string") : [],
        projects: Array.isArray(parsed.projects) ? parsed.projects : [],
        reduceMotion: parsed.reduceMotion === true,
        compact: parsed.compact === true,
      };
    }
    const legacy = localStorage.getItem(LEGACY_PROJECT_KEY);
    const names = legacy ? JSON.parse(legacy) : [];
    const projects = Array.isArray(names)
      ? names.filter((x): x is string => typeof x === "string").map((name) => ({ id: crypto.randomUUID(), name, repoNames: [], createdAt: new Date().toISOString() }))
      : [];
    return { ...DEFAULT_WORKSPACE, projects };
  } catch {
    return DEFAULT_WORKSPACE;
  }
}

function saveWorkspace(workspace: Workspace) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
}

export default function Home() {
  const [view, setView] = useState<View>("Overview");
  const [query, setQuery] = useState("");
  const [repoFilter, setRepoFilter] = useState<"all" | "favorites">("all");
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState<"updated" | "name" | "stars">("updated");
  const [activityFilter, setActivityFilter] = useState("all");
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectDialog, setProjectDialog] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [favoriteRepos, setFavoriteRepos] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const workspace = readWorkspace();
    setFavoriteRepos(workspace.favorites);
    setProjects(workspace.projects);
    setReduceMotion(workspace.reduceMotion);
    setCompact(workspace.compact);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setCommandOpen(true); }
      if (event.key === "/" && !typing) { event.preventDefault(); setCommandOpen(true); }
      if (event.key === "Escape") {
        setCommandOpen(false); setProjectDialog(false); setSettingsOpen(false); setSelectedRepo(null); setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const languages = useMemo(() => Array.from(new Set(repositories.map((repo) => repo.language))), []);

  const filteredRepos = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = repositories.filter((repo) => {
      const matchesQuery = !q || `${repo.name} ${repo.description} ${repo.language} ${repo.branch}`.toLowerCase().includes(q);
      const matchesLanguage = language === "all" || repo.language === language;
      const matchesFavorite = repoFilter === "all" || favoriteRepos.includes(repo.name);
      return matchesQuery && matchesLanguage && matchesFavorite;
    });
    return [...result].sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "stars" ? b.stars - a.stars : b.updatedRank - a.updatedRank);
  }, [favoriteRepos, language, query, repoFilter, sort]);

  const filteredActivities = useMemo(() => activities.filter((item) => activityFilter === "all" || item.type === activityFilter || item.repo === activityFilter), [activityFilter]);

  const workspace: Workspace = { favorites: favoriteRepos, projects, reduceMotion, compact };

  const openView = (next: View) => { setView(next); setCommandOpen(false); setQuery(""); };

  const toggleFavorite = (name: string) => {
    const next = favoriteRepos.includes(name) ? favoriteRepos.filter((x) => x !== name) : [...favoriteRepos, name];
    setFavoriteRepos(next); saveWorkspace({ ...workspace, favorites: next });
  };

  const createProject = () => {
    const name = projectName.trim();
    if (!name || projects.some((project) => project.name.toLowerCase() === name.toLowerCase())) return;
    const next = [...projects, { id: crypto.randomUUID(), name, repoNames: [], createdAt: new Date().toISOString() }];
    setProjects(next); setProjectName(""); setProjectDialog(false); setView("Projects"); saveWorkspace({ ...workspace, projects: next });
  };

  const deleteProject = (id: string) => {
    const next = projects.filter((project) => project.id !== id);
    setProjects(next); setSelectedProject(null); saveWorkspace({ ...workspace, projects: next });
  };

  const toggleProjectRepo = (projectId: string, repoName: string) => {
    const next = projects.map((project) => {
      if (project.id !== projectId) return project;
      const repoNames = project.repoNames.includes(repoName) ? project.repoNames.filter((name) => name !== repoName) : [...project.repoNames, repoName];
      return { ...project, repoNames };
    });
    setProjects(next); saveWorkspace({ ...workspace, projects: next });
  };

  const resetLocalData = () => {
    setFavoriteRepos([]); setProjects([]); setReduceMotion(false); setCompact(false);
    saveWorkspace(DEFAULT_WORKSPACE); localStorage.removeItem(LEGACY_PROJECT_KEY);
  };

  const selectedRepository = repositories.find((repo) => repo.name === selectedRepo);
  const activeProject = projects.find((project) => project.id === selectedProject);

  const navItems: { label: View; icon: typeof LayoutDashboard }[] = [
    { label: "Overview", icon: LayoutDashboard }, { label: "Repositories", icon: Boxes }, { label: "Projects", icon: Boxes }, { label: "Activity", icon: Activity },
  ];

  return (
    <main className={`min-h-screen bg-[#f5f5f3] text-[#111] selection:bg-black selection:text-white ${reduceMotion ? "[&_*]:!transition-none" : ""}`}>
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        <aside className="hidden w-[248px] shrink-0 border-r border-black/8 bg-white/80 px-4 py-5 backdrop-blur-xl lg:flex lg:flex-col">
          <button type="button" onClick={() => openView("Overview")} className="flex items-center gap-2 rounded-xl px-3 pb-6 text-left">
            <span className="flex size-8 items-center justify-center rounded-xl bg-black text-white"><Github size={16}/></span>
            <span><span className="block text-sm font-semibold tracking-tight">RepoDope</span><span className="block text-[11px] text-black/40">Developer workspace</span></span>
          </button>
          <nav className="space-y-1" aria-label="Primary navigation">
            {navItems.map(({ label, icon: Icon }) => <button key={label} type="button" onClick={() => openView(label)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${view === label ? "bg-black text-white" : "text-black/60 hover:bg-black/[.05] hover:text-black"}`}><Icon size={16}/>{label}</button>)}
          </nav>
          <div className="mt-auto pt-6"><button type="button" onClick={() => setSettingsOpen(true)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-black/60 hover:bg-black/[.05] hover:text-black"><Settings size={16}/>Settings</button></div>
        </aside>

        <section className="min-w-0 flex-1 pb-20 lg:pb-0">
          <header className="sticky top-0 z-20 border-b border-black/7 bg-[#f5f5f3]/90 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 lg:hidden"><button type="button" onClick={() => openView("Overview")} className="flex size-8 items-center justify-center rounded-xl bg-black text-white"><Github size={15}/></button><span className="text-sm font-semibold">RepoDope</span></div>
              <button type="button" onClick={() => setCommandOpen(true)} className="ml-auto flex w-full max-w-md items-center gap-3 rounded-xl border border-black/8 bg-white/80 px-3 py-2 text-left text-sm text-black/40"><Search size={15}/><span className="flex-1">Search repositories, projects, activity…</span><kbd className="hidden rounded-md border border-black/10 px-1.5 py-0.5 text-[10px] sm:inline">⌘ K</kbd></button>
              <button type="button" onClick={() => setProjectDialog(true)} aria-label="Create project" className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-black/8 bg-white/80 text-black/60 hover:text-black"><Plus size={17}/></button>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <div className="mx-auto max-w-6xl">
              <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div><div className="mb-2 text-[11px] font-semibold uppercase tracking-[.18em] text-black/35">Workspace</div><h1 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{view}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-black/48">{view === "Overview" ? "One place for the repositories, projects and activity that matter now." : view === "Repositories" ? "Organize repositories with search, filters, sorting and favorites." : view === "Projects" ? "Group repositories into local workspaces and keep the structure in your browser." : "Inspect recent repository events and narrow the timeline by type or repository."}</p></div>
                {view === "Projects" && <button type="button" onClick={() => setProjectDialog(true)} className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white"><Plus size={16}/>New project</button>}
              </div>

              {view === "Overview" && <div className="space-y-6">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <Stat label="Repositories" value={repositories.length} action={() => openView("Repositories")} hint="Browse repository list"/>
                  <Stat label="Favorites" value={favoriteRepos.length} action={() => { openView("Repositories"); setRepoFilter("favorites"); }} hint="Pinned locally"/>
                  <Stat label="Projects" value={projects.length} action={() => openView("Projects")} hint="Saved in this browser"/>
                  <Stat label="Activity" value={activities.length} action={() => openView("Activity")} hint="Recent events"/>
                </div>
                <div className="grid gap-6 xl:grid-cols-[1.35fr_.9fr]">
                  <Panel title="Pinned repositories" meta={`${favoriteRepos.length} saved`}>
                    {favoriteRepos.length === 0 ? <Empty text="No favorites yet. Star a repository to keep it here." action="Browse repositories" onClick={() => openView("Repositories")}/> : <div className="divide-y divide-black/6">{repositories.filter((repo) => favoriteRepos.includes(repo.name)).map((repo) => <RepoRow key={repo.name} repo={repo} favorite onFavorite={toggleFavorite} onOpen={setSelectedRepo}/>)}</div>}
                  </Panel>
                  <Panel title="Recent activity" meta="latest">
                    <div className="divide-y divide-black/6">{activities.slice(0, 4).map((item, index) => <ActivityRow key={`${item.title}-${index}`} item={item} onRepo={setSelectedRepo}/>)}</div>
                  </Panel>
                </div>
              </div>}

              {view === "Repositories" && <div className="space-y-4">
                <div className="flex flex-col gap-3 rounded-2xl border border-black/7 bg-white/80 p-4 lg:flex-row lg:items-center">
                  <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" size={15}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter repositories…" className="w-full rounded-xl border border-black/8 bg-black/[.025] py-2.5 pl-9 pr-3 text-sm outline-none focus:bg-white"/></div>
                  <select value={repoFilter} onChange={(e) => setRepoFilter(e.target.value as "all" | "favorites")} className="rounded-xl border border-black/8 bg-white px-3 py-2.5 text-sm"><option value="all">All repositories</option><option value="favorites">Favorites</option></select>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-xl border border-black/8 bg-white px-3 py-2.5 text-sm"><option value="all">All languages</option>{languages.map((value) => <option key={value}>{value}</option>)}</select>
                  <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-xl border border-black/8 bg-white px-3 py-2.5 text-sm"><option value="updated">Recently updated</option><option value="name">Name</option><option value="stars">Stars</option></select>
                </div>
                <Panel title="Repositories" meta={`${filteredRepos.length} shown`}>
                  <div className="divide-y divide-black/6">{filteredRepos.map((repo) => <RepoRow key={repo.name} repo={repo} favorite={favoriteRepos.includes(repo.name)} onFavorite={toggleFavorite} onOpen={setSelectedRepo}/>)}</div>
                  {filteredRepos.length === 0 && <Empty text="No repository matches the current filters." action="Reset filters" onClick={() => { setQuery(""); setLanguage("all"); setRepoFilter("all"); }}/>}</Panel>
              </div>}

              {view === "Projects" && <div className="grid gap-4 lg:grid-cols-2">{projects.length === 0 ? <Panel title="Projects"><Empty text="Create your first local project and assign repositories to it." action="New project" onClick={() => setProjectDialog(true)}/></Panel> : projects.map((project) => <div key={project.id} className="rounded-2xl border border-black/7 bg-white/80 p-5 shadow-[0_12px_34px_rgba(0,0,0,.04)]"><div className="flex items-start justify-between gap-4"><div><h2 className="text-base font-semibold">{project.name}</h2><p className="mt-1 text-xs text-black/40">{project.repoNames.length} repositories · local project</p></div><div className="flex gap-1"><button type="button" onClick={() => setSelectedProject(project.id)} className="rounded-lg p-2 text-black/45 hover:bg-black/[.05] hover:text-black" aria-label={`Open ${project.name}`}><ChevronRight size={16}/></button><button type="button" onClick={() => deleteProject(project.id)} className="rounded-lg p-2 text-black/35 hover:bg-black/[.05] hover:text-black" aria-label={`Delete ${project.name}`}><Trash2 size={15}/></button></div></div><div className="mt-4 flex flex-wrap gap-2">{project.repoNames.length ? project.repoNames.map((name) => <button key={name} type="button" onClick={() => setSelectedRepo(name)} className="rounded-lg bg-black/[.04] px-2.5 py-1.5 text-xs hover:bg-black/[.08]">{name}</button>) : <span className="text-xs text-black/35">No repositories assigned yet.</span>}</div></div>)}</div>}

              {view === "Activity" && <Panel title="Activity" meta={`${filteredActivities.length} events`}><div className="mb-3 flex flex-wrap gap-2"><button type="button" onClick={() => setActivityFilter("all")} className={chip(activityFilter === "all")}>All</button>{["commit","deploy","branch","release",...repositories.map((repo) => repo.name)].map((filter) => <button key={filter} type="button" onClick={() => setActivityFilter(filter)} className={chip(activityFilter === filter)}>{filter}</button>)}</div><div className="divide-y divide-black/6">{filteredActivities.map((item, index) => <ActivityRow key={`${item.title}-${index}`} item={item} onRepo={setSelectedRepo}/>)}</div></Panel>}
            </div>
          </div>
        </section>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-30 rounded-2xl border border-black/8 bg-white/94 p-1.5 shadow-[0_14px_45px_rgba(0,0,0,.13)] backdrop-blur-xl lg:hidden"><div className="grid grid-cols-4 gap-1">{navItems.map(({ label, icon: Icon }) => <button key={label} type="button" onClick={() => openView(label)} className={`flex items-center justify-center gap-1.5 rounded-xl px-1.5 py-2.5 text-[11px] font-medium ${view === label ? "bg-black text-white" : "text-black/50"}`}><Icon size={14}/>{label}</button>)}</div></nav>

      {commandOpen && <Modal onClose={() => setCommandOpen(false)} title="Command palette"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" size={15}/><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search commands or repositories…" className="w-full rounded-xl border border-black/8 bg-black/[.025] py-3 pl-9 pr-3 text-sm outline-none"/></div><div className="mt-2 space-y-1">{[...navItems.map((item) => ({ label: `Open ${item.label.toLowerCase()}`, run: () => openView(item.label) })), { label: "Create project", run: () => { setCommandOpen(false); setProjectDialog(true); } }, { label: "Open settings", run: () => { setCommandOpen(false); setSettingsOpen(true); } }, ...repositories.filter((repo) => !query.trim() || repo.name.toLowerCase().includes(query.toLowerCase())).map((repo) => ({ label: `Open repository · ${repo.name}`, run: () => { setCommandOpen(false); setSelectedRepo(repo.name); } }))].map((item) => <button key={item.label} type="button" onClick={item.run} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm hover:bg-black/[.04]">{item.label}<ChevronRight size={15} className="text-black/25"/></button>)}</div></Modal>}

      {projectDialog && <Modal onClose={() => setProjectDialog(false)} title="New project"><form onSubmit={(e) => { e.preventDefault(); createProject(); }}><label htmlFor="project-name" className="text-xs font-medium text-black/55">Project name</label><input id="project-name" autoFocus value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="frontend" className="mt-2 w-full rounded-xl border border-black/10 bg-black/[.025] px-3 py-3 text-sm outline-none"/><button disabled={!projectName.trim()} className="mt-4 w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white disabled:opacity-30">Create project</button></form></Modal>}

      {selectedProject && activeProject && <Modal onClose={() => setSelectedProject(null)} title={activeProject.name}><p className="text-xs text-black/40">Choose which repositories belong to this project.</p><div className="mt-4 divide-y divide-black/6">{repositories.map((repo) => <label key={repo.name} className="flex cursor-pointer items-center gap-3 py-3"><input type="checkbox" checked={activeProject.repoNames.includes(repo.name)} onChange={() => toggleProjectRepo(activeProject.id, repo.name)} className="size-4"/><span className="flex-1 text-sm">{repo.name}</span>{activeProject.repoNames.includes(repo.name) && <Check size={15}/>}</label>)}</div></Modal>}

      {selectedRepository && <Modal onClose={() => setSelectedRepo(null)} title={selectedRepository.name}><div className="flex items-center gap-2"><span className="rounded-md bg-black/[.05] px-2 py-1 text-[11px]">{selectedRepository.language}</span><span className="rounded-md bg-black/[.05] px-2 py-1 text-[11px]">{selectedRepository.branch}</span><span className="rounded-md bg-black/[.05] px-2 py-1 text-[11px]">★ {selectedRepository.stars}</span></div><p className="mt-4 text-sm leading-6 text-black/55">{selectedRepository.description}</p><div className="mt-5 flex gap-2"><button type="button" onClick={() => toggleFavorite(selectedRepository.name)} className="flex items-center gap-2 rounded-xl border border-black/8 px-3 py-2 text-sm"><Star size={15} fill={favoriteRepos.includes(selectedRepository.name) ? "currentColor" : "none"}/>{favoriteRepos.includes(selectedRepository.name) ? "Favorited" : "Favorite"}</button><a href={selectedRepository.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl bg-black px-3 py-2 text-sm text-white"><Github size={15}/>Open on GitHub</a></div></Modal>}

      {settingsOpen && <Modal onClose={() => setSettingsOpen(false)} title="Settings"><div className="space-y-3"><Toggle label="Reduce motion" value={reduceMotion} onChange={() => { const next = !reduceMotion; setReduceMotion(next); saveWorkspace({ ...workspace, reduceMotion: next }); }} hint="Disable UI transitions."/><Toggle label="Compact interface" value={compact} onChange={() => { const next = !compact; setCompact(next); saveWorkspace({ ...workspace, compact: next }); }} hint="Use tighter spacing in future views."/><div className="rounded-xl border border-black/8 bg-black/[.02] p-3"><div className="text-xs font-medium">GitHub Pages</div><div className="mt-1 text-[11px] text-black/40">Static export · /repodope/</div></div><button type="button" onClick={resetLocalData} className="w-full rounded-xl border border-black/8 px-3 py-3 text-left text-sm hover:bg-black/[.03]">Reset local workspace</button></div></Modal>}
    </main>
  );
}

function Stat({ label, value, hint, action }: { label: string; value: number; hint: string; action: () => void }) { return <button type="button" onClick={action} className="rounded-2xl border border-black/7 bg-white/80 p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,.04)] transition hover:-translate-y-0.5"><div className="text-xs text-black/40">{label}</div><div className="mt-2 text-2xl font-semibold">{value}</div><div className="mt-1 text-xs text-black/35">{hint}</div></button>; }
function Panel({ title, meta, children }: { title: string; meta?: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-black/7 bg-white/80 shadow-[0_14px_40px_rgba(0,0,0,.045)]"><div className="flex items-center justify-between border-b border-black/6 px-5 py-4"><h2 className="text-sm font-semibold">{title}</h2>{meta && <span className="text-[11px] text-black/35">{meta}</span>}</div>{children}</section>; }
function Empty({ text, action, onClick }: { text: string; action: string; onClick: () => void }) { return <div className="px-5 py-12 text-center"><p className="text-sm text-black/40">{text}</p><button type="button" onClick={onClick} className="mt-4 rounded-xl border border-black/8 px-3 py-2 text-xs font-medium hover:bg-black/[.03]">{action}</button></div>; }
function RepoRow({ repo, favorite, onFavorite, onOpen }: { repo: (typeof repositories)[number]; favorite: boolean; onFavorite: (name: string) => void; onOpen: (name: string) => void }) { return <div className="flex items-center gap-3 px-5 py-4"><button type="button" onClick={() => onFavorite(repo.name)} aria-label={`${favorite ? "Remove" : "Add"} ${repo.name} favorite`} className="rounded-lg p-1.5 text-black/35 hover:bg-black/[.05] hover:text-black"><Star size={16} fill={favorite ? "currentColor" : "none"}/></button><button type="button" onClick={() => onOpen(repo.name)} className="min-w-0 flex-1 text-left"><div className="flex items-center gap-2"><span className="truncate text-sm font-semibold">{repo.name}</span><span className="rounded-md bg-black/[.045] px-1.5 py-0.5 text-[10px]">{repo.language}</span></div><p className="mt-1 truncate text-xs text-black/40">{repo.description}</p></button><span className="hidden text-[11px] text-black/30 sm:block">{repo.updated}</span><a href={repo.url} target="_blank" rel="noreferrer" aria-label={`Open ${repo.name} on GitHub`} className="rounded-lg p-2 text-black/35 hover:bg-black/[.05] hover:text-black"><Github size={15}/></a></div>; }
function ActivityRow({ item, onRepo }: { item: (typeof activities)[number]; onRepo: (name: string) => void }) { return <button type="button" onClick={() => onRepo(item.repo)} className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-black/[.02]"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/[.035] text-black/50">{item.type === "branch" ? <GitBranch size={14}/> : item.type === "release" ? <Boxes size={14}/> : <Activity size={14}/>}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">{item.title}</span><span className="mt-1 block text-[11px] text-black/35">{item.repo} · {item.time}</span></span><ChevronRight size={14} className="text-black/20"/></button>; }
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-50 bg-black/25 p-4 backdrop-blur-sm" onClick={onClose}><div className="mx-auto mt-[10vh] max-h-[80vh] max-w-xl overflow-auto rounded-2xl border border-black/8 bg-white p-5 shadow-[0_25px_80px_rgba(0,0,0,.22)]" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between gap-4"><h2 className="text-base font-semibold">{title}</h2><button type="button" onClick={onClose} aria-label={`Close ${title}`} className="rounded-lg p-2 text-black/35 hover:bg-black/[.05] hover:text-black"><X size={17}/></button></div><div className="mt-5">{children}</div></div></div>; }
function Toggle({ label, value, onChange, hint }: { label: string; value: boolean; onChange: () => void; hint: string }) { return <button type="button" onClick={onChange} className="flex w-full items-center justify-between rounded-xl border border-black/8 px-3 py-3 text-left"><span><span className="block text-sm font-medium">{label}</span><span className="mt-0.5 block text-xs text-black/35">{hint}</span></span><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${value ? "bg-black text-white" : "bg-black/[.05] text-black/40"}`}>{value ? "ON" : "OFF"}</span></button>; }
function chip(active: boolean) { return `rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${active ? "bg-black text-white" : "bg-black/[.04] text-black/55 hover:bg-black/[.08]"}`; }
