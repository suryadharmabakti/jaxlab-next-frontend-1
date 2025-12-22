export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function includesText(value: string, q: string) {
  return value.toLowerCase().includes(q);
}

export function rolePillClass(role: String) {
  return cn(
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
    role === "admin" && "bg-jax-lime text-white",
    role === "kasir" && "bg-jax-lime text-white",
    role === "gudang" && "bg-jax-lime text-white"
  );
}

export function capitalizeWords(text: string) {
  text
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function exportToExcel(
  filename: string,
  headers: string[],
  rows: Array<Array<string | number | null | undefined>>
) {
  const thead =
    "<thead><tr>" +
    headers.map((h) => `<th>${escapeHtml(String(h))}</th>`).join("") +
    "</tr></thead>";

  const tbody =
    "<tbody>" +
    rows
      .map(
        (r) =>
          "<tr>" +
          r
            .map((cell) => `<td>${escapeHtml(String(cell ?? ""))}</td>`)
            .join("") +
          "</tr>"
      )
      .join("") +
    "</tbody>";

  const html =
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8" /></head><body><table border="1">' +
    thead +
    tbody +
    "</table></body></html>";

  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".xls") ? filename : `${filename}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
