'use client';
import React, { useEffect, useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomTable, { TerritoryRow } from "./_components/CustomTable";
import ModalCustom from "./_components/ModalCustom";
import EmptyView from "./_components/EmptyView";
import { MappingTerritory } from "@/types/TerritoryContext.types";
import { useTerritoryContext } from "@/contexts/TerritoryContext";

/**
 * Territory Mapping page
 * - Only collects a name when creating/editing mapping entries.
 * - Doesn't include territory selection here; assignedTerritories is empty on create.
 */
const TerritoryMapping = () => {
  const { mappingTerritories, addMappingTerritory, updateMappingTerritory } = useTerritoryContext();

  const [modalOpen, setModalOpen] = useState(false);

  // form state inside modal
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!modalOpen) {
      setName("");
      setEditingId(null);
    }
  }, [modalOpen]);

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setModalOpen(true);
  };

  const openEditModal = (t: MappingTerritory) => {
    setEditingId(t.id);
    setName(t.name);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a name");
      return;
    }

    if (editingId != null) {
      // Only update the name; leave assignedTerritories unchanged.
      updateMappingTerritory(editingId, { name: name.trim() });
    } else {
      const id = Date.now();
      const next: MappingTerritory = {
        id,
        name: name.trim(),
        assignedTerritories: [], // no territories selected from this page
      };
      addMappingTerritory(next);
    }

    setModalOpen(false);
  };

  const handleView = (t: MappingTerritory) => {
    router.push(`/territory-mapping/${t.id}`);
  };

  const handleEditRow = (r: TerritoryRow) =>
    openEditModal({ id: r.id, name: r.name, assignedTerritories: r.assignedTerritories });
  const handleViewRow = (r: TerritoryRow) =>
    handleView({ id: r.id, name: r.name, assignedTerritories: r.assignedTerritories });

  return (
    <main className="min-h-[350px] bg-white p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Territory Mapping</h1>

          <div>
            <Button variant="greenish" size="md" onClick={openCreateModal} className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Territory Mapping
            </Button>

            <ModalCustom open={modalOpen} onOpenChange={setModalOpen} title={editingId ? "Edit Territory Mapping" : "Create Territory Mapping"} height="max-h-[250px]">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{editingId ? "Edit Territory Mapping" : "Create Territory Mapping"}</h2>
                    <p className="mt-1 text-sm text-gray-600">Provide a name for the territory mapping entry.</p>
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
                </div>

                <div className="mt-8 flex justify-end gap-2">
                  <Button variant="outline" size="md" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button variant="greenish" size="md" onClick={handleSave}>{editingId ? "Save" : "Create"}</Button>
                </div>
              </div>
            </ModalCustom>
          </div>
        </header>

        {mappingTerritories.length === 0 ? (
          <EmptyView title="No territory available" description="You don't have any entries yet. Add entries to start mapping." />
        ) : (
          <CustomTable rows={mappingTerritories as TerritoryRow[]} onEdit={handleEditRow} onView={handleViewRow} />
        )}
      </div>
    </main>
  );
};

export default TerritoryMapping;