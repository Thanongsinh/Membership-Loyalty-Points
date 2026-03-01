"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getMyReferralCode, getMyReferrals, applyReferral, Referral } from "@/services/referral.service";
import QRCode from "qrcode";
import { toast } from "sonner";

export default function ReferralsPage() {
  const qc = useQueryClient();
  const { data: code } = useQuery({ queryKey: ["referral-code"], queryFn: getMyReferralCode });
  const { data: referrals = [] } = useQuery({ queryKey: ["my-referrals"], queryFn: getMyReferrals });
  const [referralInput, setReferralInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    if (code) {
      QRCode.toDataURL(code, { width: 200, margin: 2 }).then(setQrDataUrl);
    }
  }, [code]);

  const applyMut = useMutation({
    mutationFn: applyReferral,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-referrals"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
      setReferralInput("");
      setError("");
      toast.success("Referral code applied successfully!");
    },
    onError: (err: any) => {
      const errorMsg = err.response?.data?.message || "Failed to apply referral";
      setError(errorMsg);
      toast.error(errorMsg);
    },
  });

  const copyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Referrals</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Your Referral Code</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Share this code or QR with friends to earn bonus points!</p>
            <div className="flex gap-2">
              <Input value={code || "Loading..."} readOnly className="font-mono" />
              <Button onClick={copyCode} variant="outline">{copied ? "Copied!" : "Copy"}</Button>
            </div>
            {qrDataUrl && (
              <div className="flex justify-center pt-2">
                <img src={qrDataUrl} alt="Referral QR Code" className="rounded-lg border" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Use a Referral Code</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Enter a code from a friend to earn bonus points.</p>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2">
              <Input
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value)}
                placeholder="Enter referral code"
                className="font-mono"
              />
              <Button onClick={() => applyMut.mutate(referralInput)} disabled={!referralInput || applyMut.isPending}>
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Your Referrals ({referrals.length})</CardTitle></CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No referrals yet. Share your code!</p>
          ) : (
            <div className="space-y-3">
              {referrals.map((r: Referral) => (
                <div key={r.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <span className="font-medium">{r.referred?.firstName} {r.referred?.lastName}</span>
                    <p className="text-xs text-muted-foreground">Joined {new Date(r.referred?.createdAt || r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={r.status === "COMPLETED" ? "default" : "secondary"}>{r.status}</Badge>
                    <span className="text-sm font-medium text-green-600">+{r.referrerBonus} pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
