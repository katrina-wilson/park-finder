
export interface Park {
  id: number;
  name: string;
  type?: string;
  lat: number;
  lon: number;
  sizeAcres?: number;
  hasPlayground?: boolean;
}
