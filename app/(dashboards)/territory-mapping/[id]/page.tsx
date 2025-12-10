// app/(dashboards)/territory-mapping/[id]/page.tsx
'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { MapPin, Plus, Eye } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { useTerritoryContext } from "@/contexts/TerritoryContext";
import type { Territory as TerritoryType } from "@/types/Territory.types";

/**
 * Mock data - replace with API calls as needed
 */
const DISTRICTS = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: `District ${i + 1}`,
}));

// Example larger unions dataset (many unions per district)
const UNIONS_BY_DISTRICT: Record<number, { id: number; name: string }[]> =
  DISTRICTS.reduce<Record<number, { id: number; name: string }[]>>((acc, d) => {
    const count = d.id % 3 === 0 ? 60 : 8;
    acc[d.id] = Array.from({ length: count }).map((_, j) => ({
      id: d.id * 1000 + j + 1,
      name: `Union ${d.id}-${j + 1}`,
    }));
    return acc;
  }, {});

function useUniqueUnionsForDistricts(selectedDistrictIds: number[]) {
  return useMemo(() => {
    const map = new Map<number, { id: number; name: string }>();
    selectedDistrictIds.forEach((d) => {
      (UNIONS_BY_DISTRICT[d] || []).forEach((u) => map.set(u.id, u));
    });
    return Array.from(map.values());
  }, [selectedDistrictIds]);
}

/* Modal and MultiSelect components (unchanged) */
function Modal({ open, onOpenChange, children, title }: { open: boolean; onOpenChange: (next: boolean) => void; children: React.ReactNode; title?: string; }) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50" aria-hidden={false} role="dialog" aria-modal="true" aria-label={title || "Dialog"}>
      <div ref={overlayRef} className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[800px] h-full max-h-[550px] transform overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

function MultiSelect({ options, selected, onChange, placeholder, dropdownMaxHeight = 200 }: { options: { id: number; name: string }[]; selected: number[]; onChange: (next: number[]) => void; placeholder?: string; dropdownMaxHeight?: number; }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = options.filter((o) => o.name.toLowerCase().includes(query.toLowerCase()));

  const toggle = (id: number) => {
    if (selected.includes(id)) onChange(selected.filter((s) => s !== id));
    else onChange([...selected, id]);
  };

  const selectedNames = options.filter((o) => selected.includes(o.id)).map((o) => o.name);

  return (
    <div className="relative text-left" ref={containerRef}>
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none" aria-haspopup="listbox" aria-expanded={open}>
        <span className="truncate">{selectedNames.length > 0 ? selectedNames.join(", ") : placeholder}</span>
        <svg className={`h-4 w-4 transform transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-40 my-2 w-full rounded-md border bg-white shadow-lg" style={{ maxHeight: dropdownMaxHeight }}>
          <div className="p-2">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="w-full rounded-md border border-input px-2 py-1 text-sm focus:outline-none" aria-label="Search options" />
          </div>

          <div className="h-full max-h-[100px] overflow-auto p-2" role="listbox">
            {filtered.length === 0 && <div className="p-2 text-sm text-muted-foreground">No results</div>}
            {filtered.map((opt) => (
              <label key={opt.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-muted" role="option" aria-selected={selected.includes(opt.id)}>
                <Checkbox checked={selected.includes(opt.id)} onCheckedChange={() => toggle(opt.id)} className="border-green-600 bg-emerald-50 text-white hover:bg-emerald-100 focus:ring-emerald-500 data-[state=checked]:bg-green-700 data-[state=checked]:border-green-800" />
                <span className="text-sm">{opt.name}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 border-t px-2 py-2">
            <button type="button" onClick={() => { onChange([]); setQuery(""); }} className="text-sm text-muted-foreground">Clear</button>
            <button type="button" onClick={() => setOpen(false)} className="text-sm text-primary">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Main page component (TerritoryList)
 */
const TerritoryList = () => {
  const params = useParams();
  const mappingId = Number(params?.id);

  const [modalOpen, setModalOpen] = useState(false);

  // form state inside modal
  const [name, setName] = useState("");
  const [selectedDistrictIds, setSelectedDistrictIds] = useState<number[]>([]);
  const availableUnions = useUniqueUnionsForDistricts(selectedDistrictIds);
  const [selectedUnionIds, setSelectedUnionIds] = useState<number[]>([]);

  const { addTerritory, getTerritoriesForMapping } = useTerritoryContext();

  // territories for this mapping (derived from context)
  const territoriesForMapping = getTerritoriesForMapping(mappingId);

  // reset form when modal closes
  useEffect(() => {
    if (!modalOpen) {
      setName("");
      setSelectedDistrictIds([]);
      setSelectedUnionIds([]);
    }
  }, [modalOpen]);

  // If available unions change, drop any selected unions that are no longer available
  useEffect(() => {
    const allowed = new Set(availableUnions.map((u) => u.id));
    setSelectedUnionIds((prev) => prev.filter((id) => allowed.has(id)));
  }, [availableUnions]);

  const handleCreate = () => {
    if (!name.trim()) {
      alert("Please enter a territory name");
      return;
    }
    if (selectedDistrictIds.length === 0) {
      alert("Please select at least one district");
      return;
    }

    const id = Date.now();
    const next: TerritoryType = {
      id,
      mappingId,
      name: name.trim(),
      districtIds: selectedDistrictIds,
      unionIds: selectedUnionIds,
    };

    // add territory to the context (will also update mapping.assignedTerritories)
    addTerritory(mappingId, next);

    setModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Territory List</h1>

          <div>
            <Button variant="greenish" size="md" onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add territory
            </Button>

            <Modal open={modalOpen} onOpenChange={setModalOpen} title="Create Territory">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Create Territory</h2>
                    <p className="mt-1 text-sm text-gray-600">Give the territory a name, pick districts and unions.</p>
                  </div>
                  <div>
                    <button aria-label="Close" onClick={() => setModalOpen(false)} className="rounded bg-transparent px-2 py-1 text-sm">✕</button>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Territory name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter territory name" className="mt-2" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Districts</label>
                    <div className="mt-2">
                      <MultiSelect options={DISTRICTS} selected={selectedDistrictIds} onChange={(next) => setSelectedDistrictIds(next)} placeholder="Select districts" dropdownMaxHeight={280} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Unions (based on selected districts)</label>
                    <div className="mt-2">
                      <MultiSelect options={availableUnions} selected={selectedUnionIds} onChange={(next) => setSelectedUnionIds(next)} placeholder={availableUnions.length === 0 ? "Select districts first" : "Select unions"} dropdownMaxHeight={360} />
                    </div>
                    {availableUnions.length > 250 && <p className="mt-1 text-xs text-muted-foreground">Large list — use search to find unions faster.</p>}
                  </div>
                </div>

                <div className="mt-36 flex justify-end gap-2">
                  <Button variant="outline" size="md" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button variant="greenish" size="md" onClick={handleCreate}>Create</Button>
                </div>
              </div>
            </Modal>
          </div>
        </header>

        {territoriesForMapping.length === 0 ? (
          <section className="flex min-h-[60vh] items-center justify-center">
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <MapPin className="h-12 w-12 text-green-600" />
              </div>

              <h2 className="mt-6 text-2xl font-semibold text-gray-900">No territory Added</h2>

              <p className="mt-2 text-sm text-gray-500">You don't have any territories added yet. Add territories to start mapping areas and assign them to users or teams.</p>
            </div>
          </section>
        ) : (
          <section>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 items-center border-b px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700">
                <div className="col-span-6">Territory</div>
                <div className="col-span-3 text-center">Unions</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>

              <div>
                {territoriesForMapping.map((t) => (
                  <div key={t.id} className="grid grid-cols-12 items-center gap-4 px-4 py-3 odd:bg-white even:bg-gray-50">
                    <div className="col-span-6 text-sm font-medium text-gray-900">{t.name}</div>
                    <div className="col-span-3 text-center text-sm text-gray-700">{t.unionIds.length}</div>
                    <div className="col-span-3 text-right">
                      <button type="button" onClick={() => { alert(`Viewing "${t.name}"\nDistricts: ${t.districtIds.join(", ")}\nUnions: ${t.unionIds.join(", ")}`); }} className="inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm">
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default TerritoryList;