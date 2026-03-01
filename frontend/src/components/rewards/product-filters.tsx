"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal } from "lucide-react";

interface Filters {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
}

export function ProductFilters({ onApply }: { onApply: (f: Filters) => void }) {
  const [filters, setFilters] = useState<Filters>({});

  const apply = () => onApply(filters);
  const clear = () => { setFilters({}); onApply({}); };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm"><SlidersHorizontal className="h-4 w-4 mr-1" />Filters</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-3">
          <div className="font-medium text-sm">Filter & Sort</div>
          <Separator />
          <div className="space-y-2">
            <Label className="text-xs">Price Range</Label>
            <div className="flex gap-2">
              <Input type="number" placeholder="Min" value={filters.minPrice ?? ""} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })} className="h-8" />
              <Input type="number" placeholder="Max" value={filters.maxPrice ?? ""} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })} className="h-8" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Min Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setFilters({ ...filters, minRating: filters.minRating === n ? undefined : n })} className={`text-lg ${(filters.minRating ?? 0) >= n ? "text-yellow-400" : "text-gray-300"}`}>★</button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Sort By</Label>
            <div className="flex flex-wrap gap-1">
              {[
                { key: "newest", label: "Newest" },
                { key: "price_asc", label: "Price ↑" },
                { key: "price_desc", label: "Price ↓" },
                { key: "rating", label: "Rating" },
              ].map((s) => (
                <Button key={s.key} variant={filters.sortBy === s.key ? "default" : "outline"} size="sm" className="h-7 text-xs" onClick={() => setFilters({ ...filters, sortBy: filters.sortBy === s.key ? undefined : s.key })}>{s.label}</Button>
              ))}
            </div>
          </div>
          <Separator />
          <div className="flex gap-2">
            <Button size="sm" onClick={apply} className="flex-1">Apply</Button>
            <Button size="sm" variant="outline" onClick={clear}>Clear</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
