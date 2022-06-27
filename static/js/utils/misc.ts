export function valueChange(oldValue: string, newValue?: string) {
  if (!newValue || oldValue === newValue) return oldValue;
  return `${oldValue} -> ${newValue}`;
}
