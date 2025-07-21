
"use server";

import { generatePhotoDescription } from "@/ai/flows/generate-photo-description";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import type { PigeonReport, ReportIssueInput } from "@/lib/types";
import { z } from "zod";
import { generateAlias } from "@/lib/utils";
import { createHash } from "crypto";
import { reportIssue as reportIssueFlow } from "@/ai/flows/report-issue";

export async function analyzePigeonPhoto(photoDataUri: string) {
  try {
    const result = await generatePhotoDescription({ photoDataUri });
    const description = result.photoDescription;
    const count = result.pigeonCount;
    const modelVersion = result.modelVersion;
    return { success: true, description, count, modelVersion };
  } catch (e: any) {
    console.error("actions.ts: Caught error in analyzePigeonPhoto:", e);
    return { success: false, error: `Failed to analyze photo with AI. Details: ${e.message}` };
  }
}

const ReportSchema = z.object({
  userId: z.string(),
  userEmail: z.string().email(),
  alias: z.string(),
  timestamp: z.string().datetime(),
  location: z.string(),
  pigeonCount: z.number().int(),
  aiDescription: z.string(),
  photoUrl: z.string().url(),
  photoHash: z.string(),
  modelVersion: z.string(),
});

export async function submitPigeonReport(
  reportData: Omit<PigeonReport, "id" | "alias" | "photoUrl" | "photoHash"> & { photoDataUri: string }
) {
  // 1. Calculate photo hash from the Data URI
  const photoBuffer = Buffer.from(reportData.photoDataUri.split(",")[1], 'base64');
  const photoHash = createHash('sha256').update(photoBuffer).digest('hex');
  
  // 2. Upload photo to Storage and get URL
  const storageRef = ref(storage, `pigeon_reports/${photoHash}.jpg`);
  let photoUrl = "";
  try {
    const uploadResult = await uploadString(storageRef, reportData.photoDataUri, 'data_url', {
        contentType: 'image/jpeg'
    });
    photoUrl = await getDownloadURL(uploadResult.ref);
  } catch(error: any) {
      console.error("Error uploading photo to Firebase Storage:", error);
      return { success: false, error: `Failed to upload photo: ${error.message}`};
  }

  const finalReportData = {
    userId: reportData.userId,
    userEmail: reportData.userEmail,
    alias: generateAlias(reportData.userId),
    timestamp: reportData.timestamp,
    location: reportData.location,
    pigeonCount: reportData.pigeonCount,
    aiDescription: reportData.aiDescription,
    modelVersion: reportData.modelVersion,
    photoUrl: photoUrl,
    photoHash: photoHash,
  };
  
  const validation = ReportSchema.safeParse(finalReportData);
  if (!validation.success) {
    console.error("Invalid report data:", validation.error.flatten());
    return { success: false, error: "Invalid report data." };
  }

  try {
    const docRef = await addDoc(collection(db, "reports"), validation.data);
    const newReport: PigeonReport = {
      ...validation.data,
      id: docRef.id,
    };
    return { success: true, report: newReport };
  } catch (error: any) {
    console.error("Error submitting report to Firestore:", error);
    return { success: false, error: `Failed to save report to database: ${error.message}` };
  }
}

export type PigeonReportsResponse = {
    success: boolean;
    reports: PigeonReport[];
    error?: string;
}

export async function getPigeonReports(): Promise<PigeonReportsResponse> {
    try {
        const reportsCol = collection(db, "reports");
        const q = query(reportsCol, orderBy("timestamp", "desc"));
        const reportSnapshot = await getDocs(q);
        const reports: PigeonReport[] = reportSnapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<PigeonReport, "id">),
        }));
        return { success: true, reports: reports };
    } catch (error) {
        console.error("Error fetching reports:", error);
        return { success: false, reports: [], error: "Could not fetch reports." };
    }
}

export async function updateUserProfilePhoto(userId: string, photoDataUrl: string) {
    if (!userId) {
        return { success: false, error: "User not authenticated." };
    }
    try {
        const storageRef = ref(storage, `avatars/${userId}.jpg`);
        const uploadResult = await uploadString(storageRef, photoDataUrl, 'data_url', {
            contentType: 'image/jpeg'
        });
        const downloadURL = await getDownloadURL(uploadResult.ref);
        // The updateProfile call will be done on the client
        return { success: true, photoUrl: downloadURL };
    } catch (error: any) {
        console.error("Error updating profile photo:", error);
        return { success: false, error: `Failed to update profile picture: ${error.message}` };
    }
}

export async function reportIssue(
  data: ReportIssueInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await reportIssueFlow(data);
    return { success: result.success };
  } catch (e: any) {
    console.error('actions.ts: Error reporting issue', e);
    return { success: false, error: e.message || 'An unknown error occurred.' };
  }
}
