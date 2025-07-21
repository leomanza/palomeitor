
"use client";

import { useState, useTransition, useEffect, type ChangeEvent } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Camera,
  BookOpen,
  Hash,
  ShieldCheck,
  MailWarning,
  Info,
  MapPinOff,
} from "lucide-react";
import { onAuthStateChanged, type User } from 'firebase/auth';
import { analyzePigeonPhoto, submitPigeonReport } from "@/app/actions";
import { useLocation } from "@/hooks/use-location";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Dictionary } from "@/lib/i18n";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { auth } from "@/lib/firebase"; 
import Link from "next/link";
import type { PigeonReport } from "@/lib/types";

type Stage =
  | "idle"
  | "previewing"
  | "analyzing"
  | "confirming"
  | "submitting"
  | "success"
  | "error";

interface PigeonUploaderProps {
  dict: Dictionary["pigeonUploader"];
}

const MAX_WIDTH = 800; // Max width for uploaded images
const COMPRESSION_QUALITY = 0.7; // JPEG quality (0 to 1)

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleFactor = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleFactor;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error("Could not get canvas context"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', COMPRESSION_QUALITY));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

export default function PigeonUploader({ dict }: PigeonUploaderProps) {
  const [stage, setStage] = useState<Stage>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dataUri, setDataUri] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [aiDescription, setAiDescription] = useState("");
  const [pigeonCount, setPigeonCount] = useState(0);
  const [modelVersion, setModelVersion] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const { toast } = useToast();
  const location = useLocation();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setAuthInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  const handleError = (error: string | undefined, stageOnError: Stage) => {
    const errorMessage = error || "An unknown error occurred.";
    setLastError(errorMessage);
    toast({
      variant: "destructive",
      title: stageOnError === 'analyzing' ? dict.toast.analysisFailed.title : dict.toast.submissionFailed.title,
      description: errorMessage,
    });
    setStage("error");
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        try {
            const compressedDataUri = await compressImage(selectedFile);
            setPreviewUrl(compressedDataUri);
            setDataUri(compressedDataUri);
            setStage("previewing");
        } catch (error) {
            console.error("Image compression failed:", error);
            toast({
                variant: "destructive",
                title: "Error al procesar la imagen",
                description: "No se pudo comprimir la imagen. Inténtalo de nuevo."
            });
        }
    }
  };

  const handleAnalyze = () => {
    if (!dataUri) return;

    setStage("analyzing");

    startTransition(async () => {
      const result = await analyzePigeonPhoto(dataUri);
      if (result.success) {
        setAiDescription(result.description!);
        setPigeonCount(result.count!);
        setModelVersion(result.modelVersion!);
        setStage("confirming");
      } else {
        handleError(result.error, 'analyzing');
      }
    });
  };

  const handleSubmit = () => {
    if (!dataUri || !user?.uid || !user?.email || !location.coordinates) return;
    if (pigeonCount === 0) return;

    setStage("submitting");

    const finalLocation = `${location.coordinates.lat.toFixed(5)}, ${location.coordinates.lng.toFixed(5)}`;

    const reportData: Omit<PigeonReport, "id" | "alias" | "photoUrl" | "photoHash"> & { photoDataUri: string } = {
      userId: user.uid,
      userEmail: user.email,
      timestamp: new Date().toISOString(),
      location: finalLocation,
      pigeonCount,
      aiDescription,
      modelVersion,
      photoDataUri: dataUri,
    };

    startTransition(async () => {
      const result = await submitPigeonReport(reportData);
      if (result.success) {
        setStage("success");
      } else {
        handleError(result.error, 'submitting');
      }
    });
  };

  const reset = () => {
    setStage("idle");
    setPreviewUrl(null);
    setDataUri(null);
    setAiDescription("");
    setPigeonCount(0);
    setModelVersion("");
    setLastError(null);
  };

  const isLoading = stage === 'analyzing' || stage === 'submitting';
  
  const canUpload = !!user && user.emailVerified;
  const isLoggedInButNotVerified = !!user && !user.emailVerified;
  console.log("location", location)

  const canSubmit = !isLoading && pigeonCount > 0 && !!location.coordinates;

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-center">
          {dict.cardTitle}
        </CardTitle>
        <CardDescription className="text-center">
          {dict.cardDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[320px] flex flex-col justify-center items-center">
        {!authInitialized && (
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
        )}

        {authInitialized && !user && (
            <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Requiere Inicio de Sesión</AlertTitle>
                <AlertDescription>
                    Debes <Link href="/login" className="font-bold underline">iniciar sesión</Link> para poder reportar un avistamiento.
                </AlertDescription>
            </Alert>
        )}
        
        {authInitialized && isLoggedInButNotVerified && (
            <Alert variant="destructive">
                <MailWarning className="h-4 w-4" />
                <AlertTitle>Verificación de Correo Requerida</AlertTitle>
                <AlertDescription>
                    Debes verificar tu dirección de correo electrónico para poder enviar reportes. Por favor, revisa tu bandeja de entrada o <Link href="/login" className="font-bold underline">inicia sesión de nuevo</Link> para reenviar el correo.
                </AlertDescription>
            </Alert>
        )}

        {stage === "idle" && canUpload && (
          <div className="w-full space-y-4 text-center">
            <div className="w-full px-6">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ShieldCheck className="h-4 w-4"/>
                        <span>{dict.privacy.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground text-left">
                       {dict.privacy.description}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </div>
            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              size="lg"
            >
              <Camera className="mr-2 h-5 w-5" />
              {dict.idle.uploadButton}
            </Button>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              disabled={!canUpload}
            />
          </div>
        )}

        {(stage === 'analyzing' || stage === 'submitting') && (
            <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-16 w-16 animate-spin text-primary"/>
                <p className="text-lg text-muted-foreground">{stage === 'analyzing' ? dict.loading.analyzing : dict.loading.submitting}</p>
            </div>
        )}

        {stage === "previewing" && previewUrl && (
          <div className="w-full space-y-4">
            <Image
              src={previewUrl}
              alt={dict.previewing.imageAlt}
              width={400}
              height={300}
              className="rounded-lg object-cover w-full aspect-[4/3]"
            />
            <Button onClick={handleAnalyze} className="w-full" disabled={isPending}>
              {dict.previewing.analyzeButton}
            </Button>
          </div>
        )}

        {stage === 'confirming' && previewUrl && (
            <div className="w-full space-y-4 text-left">
                <Image src={previewUrl} alt={dict.confirming.imageAlt} width={400} height={300} className="rounded-lg object-cover w-full aspect-[4/3]"/>
                
                {pigeonCount === 0 && (
                    <Alert variant="default" className="border-yellow-500 text-yellow-700">
                        <Info className="h-4 w-4" />
                        <AlertTitle>{dict.confirming.noPigeonsFound.title}</AlertTitle>
                        <AlertDescription>
                            {dict.confirming.noPigeonsFound.description}
                        </AlertDescription>
                    </Alert>
                )}

                {location.error && (
                     <Alert variant="destructive">
                        <MapPinOff className="h-4 w-4" />
                        <AlertTitle>{dict.confirming.locationError.title}</AlertTitle>
                        <AlertDescription>
                            {dict.confirming.locationError.description}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                        <Hash className="h-6 w-6 text-primary"/>
                        <div>
                            <p className="font-bold text-2xl">{pigeonCount}</p>
                            <p className="text-sm text-muted-foreground">{dict.confirming.pigeonsDetected}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                        <MapPin className="h-6 w-6 text-primary"/>
                        <div>
                           {location.loading && <p>{dict.confirming.gettingLocation}</p>}
                           {location.coordinates && <p className="font-semibold">{`${location.coordinates.lat.toFixed(4)}, ${location.coordinates.lng.toFixed(4)}`}</p>}
                           {!location.loading && !location.coordinates && <p className="font-semibold text-destructive">{dict.confirming.locationUnavailable}</p>}
                            <p className="text-sm text-muted-foreground">{dict.confirming.location}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-secondary rounded-lg">
                    <BookOpen className="h-6 w-6 text-primary mt-1 flex-shrink-0"/>
                    <div>
                        <p className="font-semibold">{dict.confirming.aiAnalysis}</p>
                        <p className="text-sm text-muted-foreground">{aiDescription}</p>
                    </div>
                </div>
            </div>
        )}
        
        {stage === "success" && (
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-semibold">{dict.success.title}</h3>
            <p className="text-muted-foreground">
              {dict.success.description}
            </p>
            <Button onClick={reset}>{dict.success.resetButton}</Button>
          </div>
        )}
        
        {stage === "error" && (
            <div className="text-center space-y-4">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
            <h3 className="text-2xl font-semibold">{dict.error.title}</h3>
            <p className="text-muted-foreground max-w-sm">
              {lastError || dict.error.description}
            </p>
            <Button onClick={reset} variant="destructive">{dict.error.resetButton}</Button>
          </div>
        )}

      </CardContent>
      {stage === "confirming" && (
        <CardFooter className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={reset} disabled={isLoading}>
            {dict.confirming.discardButton}
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {dict.loading.submitting}
                </>
            ) : (
                dict.confirming.submitButton
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
