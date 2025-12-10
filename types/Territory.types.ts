export type Option = { id: number; name: string };

export type Territory = {
  id: number;
  mappingId: number;
  districtIds: number[];
  unionIds: number[];
  name: string;
  assignedTerritories?: string[];
};