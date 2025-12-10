'use client';
import React, { useEffect, useMemo, useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


import { useTerritoryContext } from "@/contexts/TerritoryContext";
import type { Territory as TerritoryType } from "@/types/Territory.types";
import TerritoryModal from "./_components/TerritoryModal";
import MultiSelect from "./_components/Multiselect";
import GroupedMultiSelect from "./_components/GroupedMultiSelect";
import TerritoryTable from "./_components/TerritoryTable";

type Group = {
  id: number;
  label: string;
  options: { id: number; name: string }[];
};

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

  // Build groups (district label + unions) from selectedDistrictIds
  const unionGroups: Group[] = useMemo(() => {
    // preserve order of selectedDistrictIds
    return selectedDistrictIds
      .map((districtId) => {
        const district = DISTRICTS.find((d) => d.id === districtId);
        const label = district ? district.name : `District ${districtId}`;
        const options = (UNIONS_BY_DISTRICT[districtId] || []).map((u) => ({ id: u.id, name: u.name }));
        return { id: districtId, label, options };
      })
      .filter((g) => g.options.length > 0);
  }, [selectedDistrictIds]);

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

            <TerritoryModal open={modalOpen} onOpenChange={setModalOpen} title="Create Territory">
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
                      <MultiSelect options={DISTRICTS} selected={selectedDistrictIds} onChange={setSelectedDistrictIds} placeholder="Select districts" dropdownMaxHeight={280} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Unions (grouped by selected districts)</label>
                    <div className="mt-2">
                      <GroupedMultiSelect
                        groups={unionGroups}
                        selected={selectedUnionIds}
                        onChange={setSelectedUnionIds}
                        placeholder={selectedDistrictIds.length === 0 ? "Select districts first" : "Select unions"}
                        dropdownMaxHeight={180}
                      />
                    </div>
                    {unionGroups.reduce((sum, g) => sum + g.options.length, 0) > 250 && <p className="mt-1 text-xs text-muted-foreground">Large list — use search to find unions faster.</p>}
                  </div>
                </div>

                <div className="mt-36 flex justify-end gap-2">
                  <Button variant="outline" size="md" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button variant="greenish" size="md" onClick={handleCreate}>Create</Button>
                </div>
              </div>
            </TerritoryModal>
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
            <TerritoryTable
              territories={territoriesForMapping}
              onView={(t) => {
                alert(`Viewing "${t.name}"\nDistricts: ${t.districtIds.join(", ")}\nUnions: ${t.unionIds.join(", ")}`);
              }}
            />
          </section>
        )}
      </div>
    </main>
  );
};

export default TerritoryList;