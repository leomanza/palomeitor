'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, onAuthStateChanged, updateProfile, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { generateAlias } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { updateUserProfilePhoto } from '@/app/actions';
import { Camera, Loader2, MailCheck, MailWarning } from 'lucide-react';

const MAX_WIDTH = 256; // Max width for profile pictures
const COMPRESSION_QUALITY = 0.8; // JPEG quality

async function compressProfileImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_WIDTH) {
            width *= MAX_WIDTH / height;
            height = MAX_WIDTH;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error("Could not get canvas context"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', COMPRESSION_QUALITY));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}


const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Sesión Cerrada',
        description: 'Has cerrado sesión exitosamente.',
      });
      router.push('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al Cerrar Sesión',
        description: 'Ocurrió un error. Por favor, inténtalo de nuevo.',
      });
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        variant: 'destructive',
        title: 'Tipo de archivo no válido',
        description: 'Por favor, selecciona un archivo de imagen (JPEG, PNG, WEBP).',
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast({
        variant: 'destructive',
        title: 'Archivo demasiado grande',
        description: `El tamaño del archivo no puede exceder los ${MAX_FILE_SIZE_MB} MB.`,
      });
      return;
    }

    setIsUploading(true);

    try {
        const compressedDataUrl = await compressProfileImage(file);
        const result = await updateUserProfilePhoto(user.uid, compressedDataUrl);

        if (result.success && result.photoUrl) {
            // Update profile on Firebase Auth client-side
            await updateProfile(user, { photoURL: result.photoUrl });
            
            toast({
              title: 'Foto de perfil actualizada',
              description: 'Tu nueva foto de perfil ha sido guardada.',
            });

            // This is the key change: Refresh server components to get new photoURL
            router.refresh();

        } else {
            toast({
              variant: 'destructive',
              title: 'Error al subir la imagen',
              description: result.error || 'Ocurrió un error inesperado.',
            });
        }
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error al procesar la imagen',
            description: error.message || 'No se pudo procesar la imagen seleccionada.',
        });
    } finally {
        setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="items-center">
             <Skeleton className="h-24 w-24 rounded-full" />
             <Skeleton className="h-6 w-40 mt-4" />
             <Skeleton className="h-4 w-48 mt-2" />
          </CardHeader>
          <CardContent>
             <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  
  const getInitials = (email: string | null) => {
    return email ? email.substring(0, 2).toUpperCase() : '..';
  }

  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
            <div className="relative group">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.photoURL ?? ''} alt="User avatar" />
                    <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                </Avatar>
                <button
                    onClick={handleFileSelect}
                    disabled={isUploading}
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity duration-300"
                >
                    {isUploading ? (
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                    ) : (
                        <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={ALLOWED_FILE_TYPES.join(',')}
                    className="hidden"
                />
            </div>
          <CardTitle className="text-2xl">
            <Badge variant="secondary" className="text-lg">
                {generateAlias(user.uid)}
            </Badge>
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            {user.email}
            {user.emailVerified ? (
              <Badge variant="secondary" className="border-green-500 text-green-600">
                <MailCheck className="h-3 w-3 mr-1" />
                Verificado
              </Badge>
            ) : (
              <Badge variant="destructive">
                <MailWarning className="h-3 w-3 mr-1" />
                No Verificado
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground text-center">Aquí podrás ver tus reportes y gestionar tu cuenta en el futuro.</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
