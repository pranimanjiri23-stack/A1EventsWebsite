
export interface Event {
  id: number;
  name: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  imageUrl: string | null;
  status: string;
}
