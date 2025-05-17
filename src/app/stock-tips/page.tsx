
"use client";

import { useState } from "react";
import { StockTipsForm } from "@/components/stock-tips/StockTipsForm";
import { StockTipsDisplay } from "@/components/stock-tips/StockTipsDisplay";
import { generateStockInvestmentTips, type StockInvestmentTipsInput, type StockInvestmentTipsOutput } from "@/ai/flows/stock-investment-strategy";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StockTipsPage() {
  const [stockTips, setStockTips] = useState<StockInvestmentTipsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: StockInvestmentTipsInput) => {
    setIsLoading(true);
    setError(null);
    setStockTips(null);
    try {
      const tips = await generateStockInvestmentTips(data);
      setStockTips(tips);
      toast({
        title: "AI Stock Tips Generated!",
        description: "Your personalized investment strategy is ready.",
      });
    } catch (err) {
      console.error("Error generating stock tips:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to generate stock tips: ${errorMessage}`);
      toast({
        title: "Error",
        description: `Could not generate stock tips. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Generate AI Stock Tips</CardTitle>
          <CardDescription>
            Get personalized stock investment advice based on your game situation.
            Fill in your details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StockTipsForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>

      <div className="md:col-span-2">
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Generating Tips</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {stockTips && !isLoading && <StockTipsDisplay tips={stockTips} />}
        {!stockTips && !isLoading && !error && (
           <Card className="h-full flex flex-col items-center justify-center min-h-[300px]">
             <CardHeader>
                <CardTitle className="text-center">Ready for Investment Insights?</CardTitle>
             </CardHeader>
            <CardContent className="text-center">
              <Terminal className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Fill out the form to get AI-powered stock tips tailored to your game.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
