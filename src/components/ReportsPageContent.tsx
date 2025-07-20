'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import ReportTable from '@/components/ReportTable';
import type { Dictionary } from '@/lib/i18n';
import type { PigeonReport } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { List, Map, Loader2, Trophy } from 'lucide-react';
import dynamic from 'next/dynamic';
import Leaderboard from './Leaderboard';

const MapDisplay = dynamic(() => import('@/components/MapDisplay'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

function ReportsSkeleton() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="text-center mb-8">
                <Skeleton className="h-10 w-1/2 mx-auto" />
                <Skeleton className="h-4 w-2/3 mx-auto mt-4" />
            </div>
            <div className="space-y-4">
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="border rounded-lg p-4">
                     <Skeleton className="h-12 w-full mb-2" />
                     <Skeleton className="h-20 w-full mb-2" />
                     <Skeleton className="h-20 w-full mb-2" />
                     <Skeleton className="h-20 w-full mb-2" />
                </div>
            </div>
        </div>
    )
}

function MapSkeleton() {
    return (
        <div className="w-full h-[600px] bg-muted rounded-lg flex items-center justify-center">
             <div className="flex flex-col items-center gap-4 text-primary">
                <Loader2 className="h-12 w-12 animate-spin"/>
                <p className="text-lg font-semibold">Cargando mapa...</p>
            </div>
        </div>
    )
}


interface ReportsPageContentProps {
  dict: Dictionary;
}

export default function ReportsPageContent({ dict }: ReportsPageContentProps) {
  const [reports, setReports] = useState<PigeonReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthLoading(false);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribeAuth();
  }, [router]);
  
  useEffect(() => {
    if (isAuthLoading) return; // Don't fetch data until authentication is confirmed

    const reportsCol = collection(db, "reports");
    const q = query(reportsCol, orderBy("timestamp", "desc"));
    
    const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        const reportsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<PigeonReport, "id">),
        }));
        setReports(reportsData);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching real-time reports:", error);
        setIsLoading(false);
    });

    return () => unsubscribeFirestore();
  }, [isAuthLoading]);

  
  if (isAuthLoading) {
    return <ReportsSkeleton />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">
          {dict.reportsPage.title}
        </h1>
        <p className="text-muted-foreground mt-2">
          {dict.reportsPage.description}
        </p>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <div className="flex justify-center mb-4">
            <TabsList>
                <TabsTrigger value="table"><List className="mr-2 h-4 w-4" />{dict.reportsPage.tableView}</TabsTrigger>
                <TabsTrigger value="map"><Map className="mr-2 h-4 w-4" />{dict.reportsPage.mapView}</TabsTrigger>
                <TabsTrigger value="leaderboard"><Trophy className="mr-2 h-4 w-4" />{dict.reportsPage.leaderboardView}</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="table">
            {isLoading ? <ReportsSkeleton /> : <ReportTable reports={reports} dict={dict.reportTable} />}
        </TabsContent>
        <TabsContent value="map">
             <div className="w-full h-[600px] rounded-lg overflow-hidden border shadow-lg">
                {isLoading ? <MapSkeleton /> : <MapDisplay reports={reports} />}
             </div>
        </TabsContent>
        <TabsContent value="leaderboard">
            {isLoading ? <ReportsSkeleton /> : <Leaderboard reports={reports} dict={dict.leaderboard} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
