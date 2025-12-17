
export interface Park {
  id: number;
  name: string;
  type?: string;
  lat: number;
  lon: number;
  sizeAcres?: number;
  hasPlayground?: boolean;
  amenities: string[];

  visitedAt?: string;
  rating?: number;
  review?: string;
  updatedAt?: string;
}
