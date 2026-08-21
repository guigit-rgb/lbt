"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FilterField } from "@/lib/listing-config";

export default function CategoryFilters({
  basePath,
  filters,
  currentValues,
  options,
  currentTri,
}: {
  basePath: string;
  filters: FilterField[];
  currentValues: Record<string, string>;
  options: Record<string, string[]>;
  currentTri: string;
}) {
  const router = useRouter();
  const [localisation, setLocalisation] = useState(currentValues.localisation ?? "");

  function navigateWith(key: string, value: string) {
    const params = new URLSearchParams(currentValues);
    if (currentTri !== "pertinence") params.set("tri", currentTri);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${basePath}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function navigateTri(tri: string) {
    const params = new URLSearchParams(currentValues);
    if (tri !== "pertinence") params.set("tri", tri);
    router.push(`${basePath}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="wrap filter-row">
      {filters.map((filter) => {
        if (filter.widget === "location") {
          return (
            <form
              key={filter.key}
              className="filter-pill"
              style={{ padding: 0 }}
              onSubmit={(e) => {
                e.preventDefault();
                navigateWith(filter.key, localisation.trim());
              }}
            >
              <span className="pin">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </span>
              <input
                type="text"
                value={localisation}
                onChange={(e) => setLocalisation(e.target.value)}
                onBlur={() => navigateWith(filter.key, localisation.trim())}
                placeholder={filter.label}
                style={{ border: "none", background: "transparent", font: "inherit", width: "9rem", color: "inherit" }}
              />
            </form>
          );
        }

        if (filter.widget === "select") {
          const opts = options[filter.key] ?? [];
          return (
            <select
              key={filter.key}
              className="filter-pill"
              value={currentValues[filter.key] ?? ""}
              onChange={(e) => navigateWith(filter.key, e.target.value)}
            >
              <option value="">{filter.label}</option>
              {opts.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          );
        }

        // widget === "range" : prix ou kilométrage, un champ min et un champ max
        const minKey = `${filter.key}_min`;
        const maxKey = `${filter.key}_max`;
        return (
          <span key={filter.key} className="filter-pill" style={{ gap: "0.4rem" }}>
            {filter.label}
            <input
              type="number"
              defaultValue={currentValues[minKey] ?? ""}
              onBlur={(e) => navigateWith(minKey, e.target.value)}
              placeholder="min"
              style={{ border: "none", background: "transparent", font: "inherit", width: "3.5rem", color: "inherit" }}
            />
            –
            <input
              type="number"
              defaultValue={currentValues[maxKey] ?? ""}
              onBlur={(e) => navigateWith(maxKey, e.target.value)}
              placeholder="max"
              style={{ border: "none", background: "transparent", font: "inherit", width: "3.5rem", color: "inherit" }}
            />
          </span>
        );
      })}

      <select className="filter-pill" value={currentTri} onChange={(e) => navigateTri(e.target.value)}>
        <option value="pertinence">Tri : Pertinence</option>
        <option value="prix_asc">Prix croissant</option>
        <option value="prix_desc">Prix décroissant</option>
      </select>
    </div>
  );
}
