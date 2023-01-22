// 함수 오버로딩
export function len(s: string): number;
export function len(s: any[]): number;

export function len(s: string | any[]) {
  return s.length;
}
