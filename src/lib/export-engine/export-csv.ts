export interface CsvColumn<T = object> {
  key: keyof T | string;
  label: string;
  formatter?: (value: unknown, item: T) => string | number;
}

export function exportToCsv<T extends object>(filename: string, data: T[], columns?: CsvColumn<T>[]): void {
  if (data.length === 0) {
    return;
  }

  const cols: CsvColumn<T>[] =
    columns ??
    Object.keys(data[0]).map((key) => ({
      key: key as keyof T,
      label: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim(),
    }));

  const escapeCell = (val: unknown): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerRow = cols.map((col) => escapeCell(col.label)).join(";");

  const bodyRows = data.map((item) =>
    cols
      .map((col) => {
        const rawValue = (item as Record<string, unknown>)[col.key as string];
        const formatted = col.formatter ? col.formatter(rawValue, item) : rawValue;
        return escapeCell(formatted);
      })
      .join(";"),
  );

  // Prepend UTF-8 BOM for Excel compatibility
  const csvContent = `\uFEFF${[headerRow, ...bodyRows].join("\r\n")}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
