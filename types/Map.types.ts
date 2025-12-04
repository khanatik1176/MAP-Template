export type LocationData = {
  id: string;
  lat: number;
  lon: number;
  name?: string;
  description?: string;
};

export type ExtLocation = LocationData & {
  acc?: string;
  imei?: string;
  device_ts?: string;
  category?: string;
};