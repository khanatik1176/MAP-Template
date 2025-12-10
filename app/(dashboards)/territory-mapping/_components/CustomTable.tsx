// app/(dashboards)/territory-mapping/_components/CustomTable.tsx
'use client';
import React from 'react';
import { Edit, Eye } from 'lucide-react';
import { useTerritoryContext } from '@/contexts/TerritoryContext';

export type TerritoryRow = {
  id: number;
  name: string;
  assignedTerritories: number[]; // now store ids
};

const TAG_STYLES = [
  'bg-blue-100 text-blue-800 ring-1 ring-blue-200',
  'bg-green-100 text-green-800 ring-1 ring-green-200',
  'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200',
  'bg-red-100 text-red-800 ring-1 ring-red-200',
  'bg-purple-100 text-purple-800 ring-1 ring-purple-200',
  'bg-pink-100 text-pink-800 ring-1 ring-pink-200',
  'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200',
  'bg-teal-100 text-teal-800 ring-1 ring-teal-200',
];

function pickTagStyle(value: string, styles = TAG_STYLES) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % styles.length;
  return styles[idx];
}

export default function CustomTable({
  rows,
  onEdit,
  onView,
}: {
  rows: TerritoryRow[];
  onEdit: (r: TerritoryRow) => void;
  onView: (r: TerritoryRow) => void;
}) {
  const { territories } = useTerritoryContext();

  const resolveNames = (ids: number[]) =>
    ids.map((id) => territories.find((t) => t.id === id)?.name || `#${id}`);

  return (
    <section>
      <div className="rounded-md border">
        <div className="grid grid-cols-12 items-center border-b px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700">
          <div className="col-span-5">Name</div>
          <div className="col-span-4">Territories</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        <div>
          {rows.map((t) => {
            const assignedNames = resolveNames(t.assignedTerritories || []);
            return (
              <div
                key={t.id}
                className="grid grid-cols-12 items-center gap-4 px-4 py-3 odd:bg-white even:bg-gray-50"
              >
                <div className="col-span-5 text-sm font-medium text-gray-900">{t.name}</div>

                <div className="col-span-4">
                  {assignedNames && assignedNames.length > 0 ? (
                    <div className="flex items-center gap-2">
                      {/* Count badge with hover tooltip listing territories */}
                      <div className="relative inline-block group">
                        <span
                          className="inline-flex items-center justify-center min-w-[30px] h-7 px-2 rounded-full bg-gray-100 text-sm font-medium text-gray-800 border"
                          aria-haspopup="true"
                          aria-expanded="false"
                          aria-label={`${assignedNames.length} territories`}
                          title={`${assignedNames.length} territories`}
                        >
                          {assignedNames.length}
                        </span>

                        {/* Tooltip: appears on hover/focus of the group */}
                        <div
                          role="tooltip"
                          className="pointer-events-none invisible opacity-0 group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100 transition-opacity duration-150 transform -translate-y-1 group-hover:translate-y-0 absolute left-1/2 -translate-x-1/2 mt-2 z-50 w-64 max-h-48 overflow-auto rounded-md border bg-white p-3 shadow-lg"
                        >
                          <div className="text-xs text-gray-500 mb-2">Territories</div>
                          <div className="flex flex-wrap gap-2">
                            {assignedNames.map((territory, idx) => {
                              const style = pickTagStyle(territory);
                              return (
                                <span
                                  key={`${t.id}-territory-${idx}`}
                                  className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium ${style}`}
                                >
                                  {territory}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Optionally show first territory label for clarity (small, muted) */}
                      <div className="text-sm text-gray-500 truncate max-w-[180px]">
                        {assignedNames[0]}
                        {assignedNames.length > 1 ? ` +${assignedNames.length - 1}` : ''}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No territories</div>
                  )}
                </div>

                <div className="col-span-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onEdit({
                          id: t.id,
                          name: t.name,
                          assignedTerritories: t.assignedTerritories,
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm"
                      aria-label={`Edit ${t.name}`}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onView({
                          id: t.id,
                          name: t.name,
                          assignedTerritories: t.assignedTerritories,
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm"
                      aria-label={`View ${t.name}`}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}