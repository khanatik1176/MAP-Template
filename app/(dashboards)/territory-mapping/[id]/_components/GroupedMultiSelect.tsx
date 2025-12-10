'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

export type Group = { id: number; label: string; options: { id: number; name: string }[] };

export default function GroupedMultiSelect({
  groups,
  selected,
  onChange,
  placeholder,
  dropdownMaxHeight = 80,
}: {
  groups: Group[];
  selected: number[];
  onChange: (next: number[]) => void;
  placeholder?: string;
  dropdownMaxHeight?: number;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const toggle = (id: number) => {
    if (selected.includes(id)) onChange(selected.filter((s) => s !== id));
    else onChange([...selected, id]);
  };

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return groups;
    const q = query.toLowerCase();
    return groups
      .map((g) => {
        const opts = g.options.filter((o) => o.name.toLowerCase().includes(q));
        return { ...g, options: opts };
      })
      .filter((g) => g.options.length > 0);
  }, [groups, query]);

  const selectedNames = useMemo(() => {
    const allOptions = groups.flatMap((g) => g.options);
    return allOptions.filter((o) => selected.includes(o.id)).map((o) => o.name);
  }, [groups, selected]);

  return (
    <div className="relative text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selectedNames.length > 0 ? selectedNames.join(', ') : placeholder}</span>
        <svg className={`h-4 w-4 transform transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-40 my-2 w-full rounded-md border bg-white shadow-lg" style={{ maxHeight: dropdownMaxHeight }}>
          <div className="p-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search unions..."
              className="w-full rounded-md border border-input px-2 py-1 text-sm focus:outline-none"
              aria-label="Search unions"
            />
          </div>

          <div className="h-full overflow-auto p-2" role="listbox" style={{ maxHeight: dropdownMaxHeight - 80 }}>
            {filteredGroups.length === 0 && <div className="p-2 text-sm text-muted-foreground">No unions found</div>}

            {filteredGroups.map((g) => (
              <div key={g.id} className="mb-2">
                <div className="sticky top-0 z-10 bg-white px-2 py-1 text-xs font-medium text-gray-600 border-b">
                  {g.label} <span className="ml-2 text-xs text-gray-400">({g.options.length})</span>
                </div>
                <div className="p-1">
                  {g.options.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-muted"
                      role="option"
                      aria-selected={selected.includes(opt.id)}
                    >
                      <Checkbox
                        checked={selected.includes(opt.id)}
                        onCheckedChange={() => toggle(opt.id)}
                        className="border-green-600 bg-emerald-50 text-white hover:bg-emerald-100 focus:ring-emerald-500 data-[state=checked]:bg-green-700 data-[state=checked]:border-green-800"
                      />
                      <span className="text-sm">{opt.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 border-t px-2 py-2">
            <button
              type="button"
              onClick={() => {
                onChange([]);
                setQuery('');
              }}
              className="text-sm text-muted-foreground"
            >
              Clear
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-sm text-primary">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}