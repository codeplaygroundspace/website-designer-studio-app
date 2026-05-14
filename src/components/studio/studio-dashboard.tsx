"use client";

import * as React from "react";
import { toPng } from "html-to-image";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Download,
  FilePlus2,
  ImageIcon,
  Layers3,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  studioAssets,
  studioAssetsById,
  studioCategories,
  type StudioCategory,
} from "./studio-assets";

type PlacedSection = {
  instanceId: string;
  assetId: string;
};

type StudioPage = {
  id: string;
  name: string;
  sections: PlacedSection[];
};

type StudioProject = {
  pages: StudioPage[];
  activePageId: string;
};

const STORAGE_KEY = "website-design-studio-project";

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createDefaultProject(): StudioProject {
  return {
    pages: [
      {
        id: "page-home",
        name: "Home",
        sections: [],
      },
    ],
    activePageId: "page-home",
  };
}

function readStoredProject(): StudioProject | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    return sanitizeProject(JSON.parse(stored));
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function sanitizeProject(value: unknown): StudioProject | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const project = value as Partial<StudioProject>;
  if (!Array.isArray(project.pages) || project.pages.length === 0) {
    return null;
  }

  const pages = project.pages
    .filter((page): page is StudioPage => {
      return Boolean(
        page &&
          typeof page.id === "string" &&
          typeof page.name === "string" &&
          Array.isArray(page.sections),
      );
    })
    .map((page) => ({
      ...page,
      sections: page.sections.filter((section) =>
        studioAssetsById.has(section.assetId),
      ),
    }));

  if (pages.length === 0) {
    return null;
  }

  const activePageId =
    typeof project.activePageId === "string" &&
    pages.some((page) => page.id === project.activePageId)
      ? project.activePageId
      : pages[0].id;

  return { pages, activePageId };
}

export function StudioDashboard() {
  const [project, setProject] =
    React.useState<StudioProject>(createDefaultProject);
  const [activeCategory, setActiveCategory] =
    React.useState<StudioCategory>("Top of page");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [exportError, setExportError] = React.useState("");
  const [isExporting, setIsExporting] = React.useState(false);
  const [deletePageId, setDeletePageId] = React.useState<string | null>(null);
  const [resetOpen, setResetOpen] = React.useState(false);
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const canSaveProjectRef = React.useRef(false);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedProject = readStoredProject();
    const timeout = window.setTimeout(() => {
      if (storedProject) {
        setProject(storedProject);
      }

      canSaveProjectRef.current = true;
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined" || !canSaveProjectRef.current) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }, [project]);

  const activePage =
    project.pages.find((page) => page.id === project.activePageId) ??
    project.pages[0];

  const filteredAssets = studioAssets.filter((asset) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesCategory = asset.category === activeCategory;
    const matchesSearch =
      query.length === 0 ||
      asset.title.toLowerCase().includes(query) ||
      asset.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  function updateActivePage(updater: (page: StudioPage) => StudioPage) {
    setProject((current) => ({
      ...current,
      pages: current.pages.map((page) =>
        page.id === current.activePageId ? updater(page) : page,
      ),
    }));
  }

  function addPage() {
    const newPage: StudioPage = {
      id: createId("page"),
      name: `Page ${project.pages.length + 1}`,
      sections: [],
    };

    setProject((current) => ({
      pages: [...current.pages, newPage],
      activePageId: newPage.id,
    }));
  }

  function renameActivePage(name: string) {
    updateActivePage((page) => ({ ...page, name }));
  }

  function duplicatePage(pageId: string) {
    setProject((current) => {
      const sourcePage = current.pages.find((page) => page.id === pageId);
      if (!sourcePage) {
        return current;
      }

      const duplicatedPage: StudioPage = {
        id: createId("page"),
        name: `${sourcePage.name || "Untitled"} copy`,
        sections: sourcePage.sections.map((section) => ({
          ...section,
          instanceId: createId("section"),
        })),
      };

      return {
        pages: [...current.pages, duplicatedPage],
        activePageId: duplicatedPage.id,
      };
    });
  }

  function deletePage(pageId: string) {
    setProject((current) => {
      if (current.pages.length === 1) {
        return current;
      }

      const pageIndex = current.pages.findIndex((page) => page.id === pageId);
      const pages = current.pages.filter((page) => page.id !== pageId);
      const nextActivePageId =
        current.activePageId === pageId
          ? pages[Math.max(0, pageIndex - 1)]?.id ?? pages[0].id
          : current.activePageId;

      return { pages, activePageId: nextActivePageId };
    });
    setDeletePageId(null);
  }

  function addSection(assetId: string) {
    setExportError("");
    updateActivePage((page) => ({
      ...page,
      sections: [
        ...page.sections,
        {
          instanceId: createId("section"),
          assetId,
        },
      ],
    }));
  }

  function moveSection(index: number, direction: -1 | 1) {
    updateActivePage((page) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= page.sections.length) {
        return page;
      }

      const sections = [...page.sections];
      const [section] = sections.splice(index, 1);
      sections.splice(nextIndex, 0, section);

      return { ...page, sections };
    });
  }

  function duplicateSection(index: number) {
    updateActivePage((page) => {
      const section = page.sections[index];
      if (!section) {
        return page;
      }

      const sections = [...page.sections];
      sections.splice(index + 1, 0, {
        ...section,
        instanceId: createId("section"),
      });

      return { ...page, sections };
    });
  }

  function removeSection(index: number) {
    updateActivePage((page) => ({
      ...page,
      sections: page.sections.filter((_, sectionIndex) => sectionIndex !== index),
    }));
  }

  function resetProject() {
    const nextProject = createDefaultProject();
    setProject(nextProject);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProject));
    setResetOpen(false);
    setExportError("");
  }

  async function exportActivePage() {
    if (!canvasRef.current) {
      return;
    }

    setIsExporting(true);
    setExportError("");

    try {
      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      const fileName = `${activePage.name || "website-page"}`
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      link.download = `${fileName || "website-page"}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setExportError("Export failed. Try again after the images finish loading.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <main className="min-h-dvh bg-zinc-100 text-zinc-950">
      <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[300px_minmax(320px,420px)_1fr]">
        <aside className="border-b border-zinc-200 bg-white lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col gap-6 p-4">
            <div>
              <p className="text-xs font-semibold uppercase text-emerald-700">
                Studio
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-balance">
                Website Design Studio
              </h1>
            </div>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">Pages</h2>
                <Button size="sm" type="button" onClick={addPage}>
                  <FilePlus2 />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {project.pages.map((page) => (
                  <div
                    key={page.id}
                    className={cn(
                      "group flex items-center gap-2 rounded-md border p-2",
                      page.id === project.activePageId
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-zinc-200 bg-white",
                    )}
                  >
                    <button
                      type="button"
                      className="min-w-0 flex-1 truncate text-left text-sm font-medium"
                      onClick={() =>
                        setProject((current) => ({
                          ...current,
                          activePageId: page.id,
                        }))
                      }
                    >
                      {page.name || "Untitled page"}
                    </button>
                    <Button
                      aria-label={`Duplicate ${page.name || "page"}`}
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => duplicatePage(page.id)}
                    >
                      <Copy />
                    </Button>
                    <Button
                      aria-label={`Delete ${page.name || "page"}`}
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={project.pages.length === 1}
                      onClick={() => setDeletePageId(page.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <label
                htmlFor="active-page-name"
                className="flex items-center gap-2 text-sm font-semibold"
              >
                <Pencil className="size-4" />
                Active page name
              </label>
              <Input
                id="active-page-name"
                value={activePage.name}
                onChange={(event) => renameActivePage(event.target.value)}
                placeholder="Page name"
              />
            </section>

            <div className="mt-auto space-y-3 border-t border-zinc-200 pt-4">
              <Button
                className="w-full"
                type="button"
                onClick={exportActivePage}
                disabled={isExporting || activePage.sections.length === 0}
              >
                <Download />
                {isExporting ? "Exporting..." : "Export PNG"}
              </Button>
              {exportError ? (
                <p className="text-sm leading-6 text-red-600">{exportError}</p>
              ) : null}
              <Button
                className="w-full"
                type="button"
                variant="outline"
                onClick={() => setResetOpen(true)}
              >
                <X />
                Reset project
              </Button>
            </div>
          </div>
        </aside>

        <section className="border-b border-zinc-200 bg-zinc-50 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col gap-4 p-4">
            <div className="space-y-3">
              <label htmlFor="asset-search" className="sr-only">
                Search design options
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="asset-search"
                  className="pl-9"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search options..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {studioCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={cn(
                      "rounded-md border px-3 py-2 text-left text-sm font-medium transition-colors",
                      category === activeCategory
                        ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                        : "border-zinc-200 bg-white hover:bg-zinc-100",
                    )}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {filteredAssets.length > 0 ? (
                <div className="grid gap-3">
                  {filteredAssets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      className="group overflow-hidden rounded-lg border border-zinc-200 bg-white text-left shadow-sm transition-colors hover:border-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                      onClick={() => addSection(asset.id)}
                    >
                      <Image
                        src={asset.image}
                        alt=""
                        width={960}
                        height={asset.height}
                        unoptimized
                        className="aspect-[16/10] w-full bg-zinc-100 object-cover"
                      />
                      <span className="flex items-center justify-between gap-3 px-3 py-2">
                        <span className="min-w-0 truncate text-sm font-medium">
                          {asset.title}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                          <Plus className="size-3.5" />
                          Add
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center">
                  <ImageIcon className="size-8 text-zinc-400" />
                  <p className="mt-3 text-sm font-semibold">No options found</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-600 text-pretty">
                    Try another category or clear the search field.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="min-w-0 bg-zinc-100">
          <div className="flex min-h-dvh flex-col gap-4 p-4 lg:p-6">
            <div className="flex flex-col justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase text-zinc-500">
                  Active canvas
                </p>
                <h2 className="mt-1 text-xl font-semibold text-balance">
                  {activePage.name || "Untitled page"}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Layers3 className="size-4" />
                <span>{activePage.sections.length} sections</span>
              </div>
            </div>

            <div className="min-w-0 flex-1 overflow-auto rounded-lg border border-zinc-200 bg-zinc-200/60 p-4 lg:p-8">
              <div
                ref={canvasRef}
                className="mx-auto w-[960px] max-w-full overflow-hidden bg-white shadow-sm"
              >
                {activePage.sections.length > 0 ? (
                  activePage.sections.map((section, index) => {
                    const asset = studioAssetsById.get(section.assetId);
                    if (!asset) {
                      return null;
                    }

                    return (
                      <div
                        key={section.instanceId}
                        className="group relative border-b border-zinc-100 last:border-b-0"
                      >
                        <Image
                          src={asset.image}
                          alt={asset.title}
                          width={960}
                          height={asset.height}
                          unoptimized
                          className="block w-full bg-white"
                        />
                        <div className="absolute right-3 top-3 flex rounded-md border border-zinc-200 bg-white/95 p-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                          <Button
                            aria-label={`Move ${asset.title} up`}
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={index === 0}
                            onClick={() => moveSection(index, -1)}
                          >
                            <ArrowUp />
                          </Button>
                          <Button
                            aria-label={`Move ${asset.title} down`}
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={index === activePage.sections.length - 1}
                            onClick={() => moveSection(index, 1)}
                          >
                            <ArrowDown />
                          </Button>
                          <Button
                            aria-label={`Duplicate ${asset.title}`}
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => duplicateSection(index)}
                          >
                            <Copy />
                          </Button>
                          <Button
                            aria-label={`Remove ${asset.title}`}
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSection(index)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex min-h-[520px] flex-col items-center justify-center p-8 text-center">
                    <ImageIcon className="size-10 text-zinc-400" />
                    <p className="mt-4 text-lg font-semibold">
                      Choose a section to start
                    </p>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-600 text-pretty">
                      Click any design option in the library and it will appear
                      here on the active page.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <AlertDialog
        open={Boolean(deletePageId)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletePageId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this page?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the page and all sections inside it. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                if (deletePageId) {
                  deletePage(deletePageId);
                }
              }}
            >
              Delete page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset the project?</AlertDialogTitle>
            <AlertDialogDescription>
              This clears all pages and starts over with a blank Home page. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={resetProject}
            >
              Reset project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
