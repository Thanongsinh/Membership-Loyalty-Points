"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/product.service";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const debounced = useDebounce(query, 300);

  const { data } = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => getProducts(1, 5, { search: debounced }),
    enabled: debounced.length >= 2,
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-xs">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query.length >= 2 && setOpen(true)}
          className="pl-9 h-9"
        />
      </div>
      {open && data && data.data.length > 0 && (
        <Card className="absolute top-10 w-full z-50 p-2 shadow-lg max-h-64 overflow-y-auto">
          {data.data.map((p) => (
            <button
              key={p.id}
              className="w-full text-left px-3 py-2 rounded hover:bg-muted text-sm"
              onClick={() => {
                if (p.storeId) router.push(`/portal/stores/${p.storeId}`);
                setOpen(false);
                setQuery("");
              }}
            >
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.store?.name} — {p.price.toLocaleString()} THB</div>
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
