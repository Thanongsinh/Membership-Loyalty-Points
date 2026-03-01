"use client";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SocialShare({ title, text, url }: { title: string; text?: string; url?: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = text || title;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, text: shareText, url: shareUrl }); } catch {}
      return;
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: "X", url: `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
    { name: "WhatsApp", url: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}` },
  ];

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    return <Button variant="ghost" size="sm" onClick={handleNativeShare}><Share2 className="h-4 w-4" /></Button>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm"><Share2 className="h-4 w-4" /></Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="space-y-1">
          {shareLinks.map((link) => (
            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="block w-full text-left px-3 py-1.5 rounded hover:bg-muted text-sm">{link.name}</a>
          ))}
          <button onClick={copyLink} className="w-full text-left px-3 py-1.5 rounded hover:bg-muted text-sm flex items-center gap-2">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
