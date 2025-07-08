
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { IPO, Stock } from "@/types";
import { INITIAL_STOCKS } from '@/config/game-config';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Clock, Package, TrendingUp } from 'lucide-react';
import { Progress } from '../ui/progress';

interface IpoOfferingCardProps {
  ipo: IPO;
  onBuyShares: (stockId: string, shares: number) => void;
  playerMoney: number;
}

export function IpoOfferingCard({ ipo, onBuyShares, playerMoney }: IpoOfferingCardProps) {
  const [sharesAmount, setSharesAmount] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ipo.endTime - Date.now());

  const stockDetails = useMemo(() => INITIAL_STOCKS.find(s => s.id === ipo.stockId), [ipo.stockId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(ipo.endTime - Date.now());
    }, 1000);

    if (timeLeft <= 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [ipo.endTime, timeLeft]);

  if (!stockDetails) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Could not load IPO details.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleBuy = () => {
    if (sharesAmount > 0) {
      onBuyShares(ipo.stockId, sharesAmount);
    }
  };

  const totalCost = ipo.ipoPrice * sharesAmount;
  const canAfford = playerMoney >= totalCost;
  const canBuy = canAfford && sharesAmount <= ipo.sharesRemaining;
  const initialShares = stockDetails.totalOutstandingShares;
  const sharesSold = initialShares - ipo.sharesRemaining;
  const progressPercentage = (sharesSold / initialShares) * 100;
  
  const formatTime = (ms: number) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <Card className="border-accent shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-accent">Initial Public Offering</CardTitle>
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Clock className="h-4 w-4"/>
                <span>Time Left: {formatTime(timeLeft)}</span>
            </div>
        </div>
        <CardDescription>A unique opportunity to invest in a new company before it hits the public market.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <stockDetails.icon className="h-16 w-16 text-primary shrink-0"/>
                <div>
                    <h3 className="text-xl font-bold">{stockDetails.companyName} ({stockDetails.ticker})</h3>
                    <p className="text-sm text-muted-foreground">{stockDetails.description}</p>
                </div>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">IPO Price:</span>
                    <span className="font-semibold flex items-center gap-1"><DollarSign className="h-4 w-4 text-green-500"/>${ipo.ipoPrice.toLocaleString()}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Shares Remaining:</span>
                    <span className="font-semibold flex items-center gap-1"><Package className="h-4 w-4 text-blue-500"/>{ipo.sharesRemaining.toLocaleString()} / {initialShares.toLocaleString()}</span>
                </div>
            </div>
             <div>
                <Label className="text-xs">Shares Sold</Label>
                <Progress value={progressPercentage} className="h-2 mt-1"/>
            </div>
        </div>
        <div className="flex flex-col justify-center space-y-4 rounded-md border p-4 bg-muted/30">
            <h4 className="font-semibold text-center">Buy Shares</h4>
            <div className="space-y-1">
                <Label htmlFor={`ipo-shares-${ipo.stockId}`}>Number of shares:</Label>
                <Input
                    id={`ipo-shares-${ipo.stockId}`}
                    type="number"
                    min="1"
                    max={ipo.sharesRemaining}
                    value={sharesAmount}
                    onChange={(e) => setSharesAmount(Math.max(1, parseInt(e.target.value) || 1))}
                />
            </div>
            <div className="text-center text-sm">
                <p>Total Cost: <span className="font-semibold">${totalCost.toLocaleString()}</span></p>
            </div>
            <Button onClick={handleBuy} disabled={!canBuy}>
                <TrendingUp className="mr-2 h-4 w-4"/>
                {canBuy ? "Buy IPO Shares" : (!canAfford ? "Not Enough Money" : "Not Enough Shares Available")}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
