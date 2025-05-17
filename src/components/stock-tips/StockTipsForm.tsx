
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RiskTolerance } from "@/types";
import { useGame } from "@/contexts/GameContext";
import { useEffect } from "react";

const formSchema = z.object({
  currentBalance: z.coerce.number().min(0, "Balance must be non-negative."),
  riskTolerance: z.enum(["low", "medium", "high"]),
  marketTrends: z.string().min(10, "Market trends description must be at least 10 characters."),
});

type StockTipsFormValues = z.infer<typeof formSchema>;

interface StockTipsFormProps {
  onSubmit: (data: StockTipsFormValues) => Promise<void>;
  isLoading: boolean;
}

export function StockTipsForm({ onSubmit, isLoading }: StockTipsFormProps) {
  const { playerStats, lastMarketTrends, setLastMarketTrends, lastRiskTolerance, setLastRiskTolerance } = useGame();

  const form = useForm<StockTipsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentBalance: playerStats.money,
      riskTolerance: lastRiskTolerance,
      marketTrends: lastMarketTrends,
    },
  });

  useEffect(() => {
    form.reset({
      currentBalance: playerStats.money,
      riskTolerance: lastRiskTolerance,
      marketTrends: lastMarketTrends,
    });
  }, [playerStats.money, lastMarketTrends, lastRiskTolerance, form]);


  const handleFormSubmit = async (values: StockTipsFormValues) => {
    setLastMarketTrends(values.marketTrends);
    setLastRiskTolerance(values.riskTolerance as RiskTolerance);
    await onSubmit(values);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="currentBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Balance ($)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 10000" {...field} readOnly className="bg-muted/50"/>
              </FormControl>
              <FormDescription>Your current in-game cash balance.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="riskTolerance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Risk Tolerance</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your risk tolerance" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>How much risk are you willing to take?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="marketTrends"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Market Trends</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe current market trends, e.g., 'Tech stocks are booming, energy is down.'"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Briefly describe the current in-game stock market situation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-yellow-400">
          {isLoading ? "Generating Tips..." : "Get AI Stock Tips"}
        </Button>
      </form>
    </Form>
  );
}
