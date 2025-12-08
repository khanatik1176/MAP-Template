'use client';
import React, { useEffect, useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Option, Territory } from "@/types/Territory.types";
import CustomTable, { TerritoryRow } from "./_components/CustomTable";
import ModalCustom from "./_components/ModalCustom";
import MultiSelectCustom from "./_components/MultiSelectCustom";
import EmptyView from "./_components/EmptyView";


/**
 * Mock territory options - replace with API calls as needed
 */
const TERRITORY_OPTIONS = [
  "Territory Alpha",
  "Territory Beta",
  "Territory Gamma",
  "Territory Delta",
];



const TerritoryMapping = () => {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // form state inside modal
  const [name, setName] = useState("");
  const [selectedAssignedTerritoryIds, setSelectedAssignedTerritoryIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const territoryOptions: Option[] = TERRITORY_OPTIONS.map((t, i) => ({ id: i + 1, name: t }));

  const router = useRouter();

  useEffect(() => {
    if (!modalOpen) {
      setName("");
      setSelectedAssignedTerritoryIds([]);
      setEditingId(null);
    }
  }, [modalOpen]);

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setSelectedAssignedTerritoryIds([]);
    setModalOpen(true);
  };

  const openEditModal = (t: Territory) => {
    setEditingId(t.id);
    setName(t.name);
    const ids = t.assignedTerritories
      .map((n) => territoryOptions.find((o) => o.name === n)?.id)
      .filter((v): v is number => typeof v === "number");
    setSelectedAssignedTerritoryIds(ids);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a name");
      return;
    }
    if (!selectedAssignedTerritoryIds || selectedAssignedTerritoryIds.length === 0) {
      alert("Please select at least one territory from the list");
      return;
    }

    const selectedNames = selectedAssignedTerritoryIds
      .map((id) => territoryOptions.find((o) => o.id === id)?.name)
      .filter((n): n is string => typeof n === "string");

    if (editingId != null) {
      setTerritories((prev) =>
        prev.map((p) =>
          p.id === editingId ? { ...p, name: name.trim(), assignedTerritories: selectedNames } : p
        )
      );
    } else {
      const id = Date.now();
      const next: Territory = {
        id,
        name: name.trim(),
        assignedTerritories: selectedNames,
      };
      setTerritories((s) => [next, ...s]);
    }

    setModalOpen(false);
  };

  const handleView = (t: Territory) => {
    router.push(`/territory-mapping/${t.id}`);
  };

  const handleEditRow = (r: TerritoryRow) => openEditModal({ id: r.id, name: r.name, assignedTerritories: r.assignedTerritories });
  const handleViewRow = (r: TerritoryRow) => handleView({ id: r.id, name: r.name, assignedTerritories: r.assignedTerritories });

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Territory Mapping</h1>

          <div>
            <Button variant="greenish" size="md" onClick={openCreateModal} className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add territory
            </Button>

            <ModalCustom open={modalOpen} onOpenChange={setModalOpen} title={editingId ? "Edit Territory" : "Create Territory"}>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{editingId ? "Edit Territory" : "Create Territory"}</h2>
                    <p className="mt-1 text-sm text-gray-600">Provide a name and select one or more territories from the list.</p>
                  </div>
                  <div>
                    <button aria-label="Close" onClick={() => setModalOpen(false)} className="rounded bg-transparent px-2 py-1 text-sm">✕</button>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" className="mt-2" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Territories</label>
                    <div className="mt-2">
                      <MultiSelectCustom
                        options={territoryOptions}
                        selected={selectedAssignedTerritoryIds}
                        onChange={setSelectedAssignedTerritoryIds}
                        placeholder="Select territories"
                        dropdownMaxHeight={320}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-32 flex justify-end gap-2">
                  <Button variant="outline" size="md" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button variant="greenish" size="md" onClick={handleSave}>{editingId ? "Save" : "Create"}</Button>
                </div>
              </div>
            </ModalCustom>
          </div>
        </header>

        {territories.length === 0 ? (
          <EmptyView title="No territory available" description="You don't have any entries yet. Add entries to start mapping." />
        ) : (
          <CustomTable rows={territories as TerritoryRow[]} onEdit={handleEditRow} onView={handleViewRow} />
        )}
      </div>
    </main>
  );
};

export default TerritoryMapping;