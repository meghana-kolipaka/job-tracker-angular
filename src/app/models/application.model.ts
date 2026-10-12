export const STATUSES = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn'] as const;

export type Status = (typeof STATUSES)[number];

export interface Application {
  id: string;
  company: string;
  role: string;
  location: string;
  status: Status;
  /** Date as YYYY-MM-DD, as produced by <input type="date"> */
  appliedOn: string;
  link: string;
  notes: string;
}

export type ApplicationDraft = Omit<Application, 'id'>;
