// types/TerritoryContext.types.ts
export type Option = { id: number; name: string };

export type Territory = {
  id: number;
  mappingId: number; // which mapping this territory belongs to
  name: string;
  districtIds: number[];
  unionIds: number[];
};

export type MappingTerritory = {
  id: number;
  name: string;
  // store territory ids (not names) — safer and avoids duplication
  assignedTerritories: number[];
};

export type TerritoryContextValue = {
  mappingTerritories: MappingTerritory[];
  territories: Territory[];

  addMappingTerritory: (t: MappingTerritory) => void;
  updateMappingTerritory: (id: number, next: Partial<MappingTerritory>) => void;
  removeMappingTerritory: (id: number) => void;

  addTerritory: (mappingId: number, t: Territory) => void;
  updateTerritory: (id: number, next: Partial<Territory>) => void;
  removeTerritory: (id: number) => void;

  getTerritoriesForMapping: (mappingId: number) => Territory[];

  clearAll: () => void;
};