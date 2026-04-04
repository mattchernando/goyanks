"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { RoleFilter } from "@/types";

interface FilterTabsProps {
  currentFilter: RoleFilter;
}

const FILTERS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "starters", label: "Starters" },
  { value: "bullpen", label: "Bullpen" },
];

export default function FilterTabs({ currentFilter }: FilterTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (filter: RoleFilter) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "all") {
      params.delete("role");
    } else {
      params.set("role", filter);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex gap-2">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          onClick={() => handleFilterChange(filter.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentFilter === filter.value
              ? "bg-gold text-navy"
              : "bg-navy-500 text-gray-300 hover:bg-navy-400 hover:text-white"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
