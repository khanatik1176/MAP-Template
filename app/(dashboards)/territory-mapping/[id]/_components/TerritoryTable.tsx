'use client';
import React, { useMemo } from 'react';
import { Eye } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { GenericTable } from '@/components/GenericTable';
import { useSearchParams } from 'next/navigation';
import type { Territory as TerritoryType } from '@/types/Territory.types';

export type TerritoryRow = {
  id: number;
  name: string;
  unionIds: number[];
};

const ITEMS_PER_PAGE = 10;

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

export default function TerritoryTable({
  territories,
  onView,
}: {
  territories: TerritoryType[];
  onView: (t: TerritoryType) => void;
}) {
  const searchParams = useSearchParams();
  const pageNumber = Number(searchParams.get('page') || '1');

  // resolve names for unions — here we don't have a union lookup, so show "#id"
  const resolveNames = (ids: number[]) => ids.map((id) => `#${id}`);

  // map territories to lightweight rows if needed by GenericTable (we'll reference original data via row.original)
  const rows: TerritoryRow[] = territories.map((t) => ({
    id: t.id,
    name: t.name,
    unionIds: t.unionIds || [],
  }));

  const columns = useMemo<ColumnDef<TerritoryRow>[]>(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: () => <div className="font-medium">Name</div>,
        cell: ({ row }) => <div className="text-sm font-medium text-gray-900">{row.getValue('name')}</div>,
      },
      {
        id: 'unions',
        header: () => <div className="font-medium">Unions</div>,
        cell: ({ row }) => {
          const assignedIds: number[] = row.original.unionIds || [];
          const assignedNames = resolveNames(assignedIds);
          if (!assignedNames || assignedNames.length === 0) {
            return <div className="text-sm text-gray-500">No unions</div>;
          }

          return (
            <div className="flex items-center gap-2">
              <div className="relative inline-block group">
                <span
                  className="inline-flex items-center justify-center min-w-[30px] h-7 px-2 rounded-full bg-gray-100 text-sm font-medium text-gray-800 border"
                  aria-haspopup="true"
                  aria-expanded="false"
                  aria-label={`${assignedNames.length} unions`}
                  title={`${assignedNames.length} unions`}
                >
                  {assignedNames.length}
                </span>

                <div
                  role="tooltip"
                  className="pointer-events-none invisible opacity-0 group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100 transition-opacity duration-150 transform -translate-y-1 group-hover:translate-y-0 absolute left-1/2 -translate-x-1/2 mt-2 z-50 w-64 max-h-48 overflow-auto rounded-md border bg-white p-3 shadow-lg"
                >
                  <div className="text-xs text-gray-500 mb-2">Unions</div>
                  <div className="flex flex-wrap gap-2">
                    {assignedNames.map((union, idx) => {
                      const style = pickTagStyle(union);
                      return (
                        <span
                          key={`${row.original.id}-union-${idx}`}
                          className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium ${style}`}
                        >
                          {union}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* <div className="text-sm text-gray-500 truncate max-w-[180px]">
                {assignedNames[0]}
                {assignedNames.length > 1 ? ` +${assignedNames.length - 1}` : ''}
              </div> */}
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: () => <div className="font-medium text-right">Actions</div>,
        cell: ({ row }) => {
          const originalTerritory = territories.find((t) => t.id === row.original.id)!;
          return (
            <div className="flex justify-end">
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onView(originalTerritory)}
                  className="inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm"
                  aria-label={`View ${row.original.name}`}
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
              </div>
            </div>
          );
        },
      },
    ],
    [territories, onView]
  );

  // client-side pagination
  const totalCount = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, pageNumber || 1), totalPages);
  const pageData = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return rows.slice(start, start + ITEMS_PER_PAGE);
  }, [rows, safePage]);

  const totalCountAndLimit = { totalCount, size: ITEMS_PER_PAGE };

  return (
    <div className="mt-2">
      <GenericTable
        columns={columns}
        data={pageData}
        totalCountAndLimit={totalCountAndLimit}
        currentPage={safePage}
        loading={false}
        refetch={() => {
          // client-side list – nothing to fetch
          return;
        }}
        headerClassNames={{
          name: 'min-w-[220px] w-[220px] pl-4',
          unions: 'min-w-[300px] w-[300px]',
          actions: 'min-w-[160px] w-[160px] text-right pr-4',
        }}
        cellClassNames={{
          name: 'min-w-[220px] w-[220px] !pl-4 truncate',
          unions: 'min-w-[300px] w-[300px] !pr-2',
          actions: 'min-w-[160px] w-[160px] !pr-4',
        }}
      />
    </div>
  );
}