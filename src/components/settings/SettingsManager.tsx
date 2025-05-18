
"use client";

import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Save, Upload, Download, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function SettingsManager() {
  const { manualSaveGame, exportGameState, importGameState, lastSavedTimestamp, wipeGameData } = useGame();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);
  const [isWipeConfirmOpen, setIsWipeConfirmOpen] = useState(false);
  const [fileToImport, setFileToImport] = useState<File | null>(null);
  const [displayLastSaved, setDisplayLastSaved] = useState<string>("Never");

  useEffect(() => {
    if (lastSavedTimestamp) {
      setDisplayLastSaved(new Date(lastSavedTimestamp).toLocaleString());
    } else {
        const savedDataString = localStorage.getItem('bizTycoonSaveData_v1');
        if (savedDataString) {
            try {
                const loadedData = JSON.parse(savedDataString);
                if (loadedData.lastSaved) {
                    setDisplayLastSaved(new Date(loadedData.lastSaved).toLocaleString());
                } else {
                  setDisplayLastSaved("Never");
                }
            } catch (e) {
                setDisplayLastSaved("Never");
            }
        } else {
          setDisplayLastSaved("Never");
        }
    }
  }, [lastSavedTimestamp]);

  const handleExport = () => {
    try {
      const gameStateJson = exportGameState();
      const blob = new Blob([gameStateJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `biztycoon_save_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Game Exported",
        description: "Your save data has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Could not export game data.",
        variant: "destructive",
      });
      console.error("Export error:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileToImport(event.target.files[0]);
      setIsImportConfirmOpen(true); 
    }
  };

  const handleImportConfirm = async () => {
    if (!fileToImport) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        const success = importGameState(text);
        // Toasts handled by importGameState
      } else {
        toast({
          title: "Import Error",
          description: "Could not read the file.",
          variant: "destructive",
        });
      }
      setFileToImport(null); 
      if(fileInputRef.current) fileInputRef.current.value = ""; 
    };
    reader.onerror = () => {
        toast({
            title: "Import Error",
            description: "Error reading file.",
            variant: "destructive",
        });
        setFileToImport(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    }
    reader.readAsText(fileToImport);
    setIsImportConfirmOpen(false);
  };

  const handleTriggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleWipeConfirm = () => {
    wipeGameData();
    setIsWipeConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Save Management</h3>
        <p className="text-sm text-muted-foreground">
          Last saved: <span className="font-semibold">{displayLastSaved}</span>
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={manualSaveGame} className="flex-1">
          <Save className="mr-2 h-4 w-4" /> Manual Save
        </Button>
        <Button onClick={handleExport} variant="outline" className="flex-1">
          <Download className="mr-2 h-4 w-4" /> Export Save
        </Button>
      </div>

      <div>
        <Label htmlFor="import-save" className="text-lg font-medium mb-2 block">Import Save Data</Label>
        <p className="text-sm text-muted-foreground mb-3">
          Import a previously exported .json save file. This will overwrite your current game progress.
        </p>
        <Button onClick={handleTriggerImport} variant="outline" className="w-full">
          <Upload className="mr-2 h-4 w-4" /> Choose Save File (.json)
        </Button>
        <input
          type="file"
          id="import-save"
          accept=".json"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
         <p className="text-sm text-muted-foreground mb-3">
          Be careful, these actions are irreversible.
        </p>
        <Button onClick={() => setIsWipeConfirmOpen(true)} variant="destructive" className="w-full">
          <Trash2 className="mr-2 h-4 w-4" /> Wipe All Save Data
        </Button>
      </div>


      <AlertDialog open={isImportConfirmOpen} onOpenChange={setIsImportConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Import</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to import this save file? Your current game progress will be overwritten. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setFileToImport(null);
              if(fileInputRef.current) fileInputRef.current.value = "";
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleImportConfirm}>
              Import and Overwrite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isWipeConfirmOpen} onOpenChange={setIsWipeConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Confirm Wipe Data</AlertDialogTitle>
            <AlertDialogDescription>
              Are you absolutely sure you want to wipe all your save data? This action is irreversible and will reset all your game progress to the very beginning.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleWipeConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Wipe All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
