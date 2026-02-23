export interface Option {
  id: number;
  label: string;
  value: number;
}

export type SelectionsMap = Record<number, Option | null>;
