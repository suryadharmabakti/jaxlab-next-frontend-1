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
