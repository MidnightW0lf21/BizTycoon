
"use client";

import type { StockInvestmentTipsOutput } from "@/ai/flows/stock-investment-strategy";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, MinusCircle, Lightbulb } from "lucide-react";

interface StockTipsDisplayProps {
  tips: StockInvestmentTipsOutput;
}

const RecommendationIcon = ({ recommendation }: { recommendation: string }) => {
  if (recommendation.toLowerCase().includes("buy")) return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (recommendation.toLowerCase().includes("sell")) return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <MinusCircle className="h-4 w-4 text-gray-500" />;
};


export function StockTipsDisplay({ tips }: StockTipsDisplayProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
             <Lightbulb className="h-6 w-6 text-primary" />
            <CardTitle>Overall Investment Strategy</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground">{tips.overallStrategy}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Specific Stock Picks</CardTitle>
          <CardDescription>Detailed recommendations for individual stocks based on AI analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          {tips.stockPicks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No specific stock picks available with this strategy.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {tips.stockPicks.map((stock, index) => (
                <AccordionItem value={`item-${index}`} key={stock.ticker + index}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                         <RecommendationIcon recommendation={stock.recommendation} />
                        <span className="font-semibold text-primary">{stock.companyName} ({stock.ticker})</span>
                      </div>
                      <Badge variant={
                        stock.recommendation.toLowerCase().includes("buy") ? "default" :
                        stock.recommendation.toLowerCase().includes("sell") ? "destructive" : "secondary"
                      }>
                        {stock.recommendation}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pl-10 pr-4">
                    <strong>Rationale:</strong> {stock.rationale}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
