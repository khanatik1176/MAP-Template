// contexts/TerritoryContext.tsx
'use client';
import { MappingTerritory, Territory as TerritoryType, TerritoryContextValue } from '@/types/TerritoryContext.types';
import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY_MAPPINGS = 'map_template_mapping_territories_v1';
const STORAGE_KEY_TERRITORIES = 'map_template_territories_v1';

const TerritoryContext = createContext<TerritoryContextValue | undefined>(undefined);

export const TerritoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [mappingTerritories, setMappingTerritories] = useState<MappingTerritory[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_MAPPINGS);
      return raw ? (JSON.parse(raw) as MappingTerritory[]) : [];
    } catch {
      return [];
    }
  });

  const [territories, setTerritories] = useState<TerritoryType[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TERRITORIES);
      return raw ? (JSON.parse(raw) as TerritoryType[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MAPPINGS, JSON.stringify(mappingTerritories));
    } catch {
      // ignore storage errors
    }
  }, [mappingTerritories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TERRITORIES, JSON.stringify(territories));
    } catch {
      // ignore
    }
  }, [territories]);

  const addMappingTerritory = (t: MappingTerritory) => {
    // ensure assignedTerritories default
    const normalized = { ...t, assignedTerritories: t.assignedTerritories || [] };
    setMappingTerritories((prev) => [normalized, ...prev]);
  };

  const updateMappingTerritory = (id: number, next: Partial<MappingTerritory>) => {
    setMappingTerritories((prev) => prev.map((m) => (m.id === id ? { ...m, ...next } : m)));
  };

  const removeMappingTerritory = (id: number) => {
    // remove mapping and also remove its territories
    setMappingTerritories((prev) => prev.filter((m) => m.id !== id));
    setTerritories((prev) => prev.filter((t) => t.mappingId !== id));
  };

  const addTerritory = (mappingId: number, t: TerritoryType) => {
    const territory = t;
    setTerritories((prev) => [territory, ...prev]);

    // add territory id to mapping.assignedTerritories
    setMappingTerritories((prev) =>
      prev.map((m) =>
        m.id === mappingId
          ? { ...m, assignedTerritories: [territory.id, ...(m.assignedTerritories || [])] }
          : m
      )
    );
  };

  const updateTerritory = (id: number, next: Partial<TerritoryType>) => {
    setTerritories((prev) => prev.map((t) => (t.id === id ? { ...t, ...next } : t)));
  };

  const removeTerritory = (id: number) => {
    let mappingIdForRemoved: number | null = null;
    setTerritories((prev) => {
      const target = prev.find((t) => t.id === id);
      if (target) mappingIdForRemoved = target.mappingId;
      return prev.filter((t) => t.id !== id);
    });

    if (mappingIdForRemoved != null) {
      setMappingTerritories((maps) =>
        maps.map((m) =>
          m.id === mappingIdForRemoved ? { ...m, assignedTerritories: (m.assignedTerritories || []).filter((tid) => tid !== id) } : m
        )
      );
    }
  };

  const getTerritoriesForMapping = (mappingId: number) => {
    return territories.filter((t) => t.mappingId === mappingId);
  };

  const clearAll = () => {
    setMappingTerritories([]);
    setTerritories([]);
  };

  return (
    <TerritoryContext.Provider
      value={{
        mappingTerritories,
        territories,
        addMappingTerritory,
        updateMappingTerritory,
        removeMappingTerritory,
        addTerritory,
        updateTerritory,
        removeTerritory,
        getTerritoriesForMapping,
        clearAll,
      }}
    >
      {children}
    </TerritoryContext.Provider>
  );
};

export function useTerritoryContext() {
  const ctx = useContext(TerritoryContext);
  if (!ctx) {
    throw new Error('useTerritoryContext must be used within TerritoryProvider');
  }
  return ctx;
}