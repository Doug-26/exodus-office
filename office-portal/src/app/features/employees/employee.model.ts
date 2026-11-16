/** Employee as returned by `GET /api/v1/employees`. Mirrors the API's EmployeeResponse contract. */
export interface Employee {
  id: number;
  name: string;
  /** Philippine mobile number in E.164 format, e.g. +639171234567. */
  mobile: string;
  email: string;
  city: string;
  region: string;
  address: string;
}

/** Body for create and update requests. */
export type EmployeeInput = Omit<Employee, 'id'>;

export function emptyEmployeeInput(): EmployeeInput {
  return { name: '', mobile: '+63', email: '', city: '', region: '', address: '' };
}

/** First letters of the first and last word of a name, for avatar badges. */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return '?';
  }
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
}
