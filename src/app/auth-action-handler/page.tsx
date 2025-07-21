
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

function ActionHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [mode, setMode] = useState<string | null>(null);
  const [actionCode, setActionCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const currentMode = searchParams.get('mode');
    const currentActionCode = searchParams.get('oobCode');

    setMode(currentMode);
    setActionCode(currentActionCode);

    if (!currentMode || !currentActionCode) {
      setError('Parámetros inválidos. Por favor, solicita un nuevo enlace.');
      setIsLoading(false);
      return;
    }
    
    // Handle email verification immediately
    if (currentMode === 'verifyEmail') {
        handleVerifyEmail(currentActionCode);
    } else if (currentMode === 'resetPassword') {
        handleVerifyResetCode(currentActionCode);
    } else {
        setError(`Modo no soportado: ${currentMode}`);
        setIsLoading(false);
    }

  }, [searchParams]);

  const handleVerifyResetCode = async (code: string) => {
    try {
        await verifyPasswordResetCode(auth, code);
        setIsLoading(false); // Code is valid, show password reset form
    } catch (err) {
        setError('El enlace para restablecer la contraseña es inválido o ha expirado. Por favor, solicita uno nuevo.');
        setIsLoading(false);
    }
  }

  const handleVerifyEmail = async (code: string) => {
    try {
        await applyActionCode(auth, code);
        setSuccess('¡Tu correo ha sido verificado! Ahora puedes iniciar sesión.');
        toast({
            title: 'Correo Verificado',
            description: 'Tu dirección de correo ha sido verificada exitosamente.'
        });
    } catch (err) {
        setError('El enlace de verificación es inválido o ha expirado. Por favor, intenta iniciar sesión de nuevo para reenviar el correo.');
    } finally {
        setIsLoading(false);
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionCode) return;
    setIsLoading(true);
    setError(null);

    try {
      await confirmPasswordReset(auth, actionCode, newPassword);
      setSuccess('Tu contraseña ha sido restablecida con éxito. Ahora puedes iniciar sesión con tu nueva contraseña.');
       toast({
        title: 'Contraseña Restablecida',
        description: 'Tu contraseña ha sido cambiada exitosamente.',
      });
      // Do not redirect immediately, show success message first.
      // The user can click the button to go to login.
    } catch (err) {
      setError('Hubo un error al restablecer la contraseña. El enlace puede haber expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Verificando tu solicitud...</p>
      </div>
    );
  }

  if (error) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="items-center text-center">
                <AlertTriangle className="h-12 w-12 text-destructive"/>
                <CardTitle className="mt-4">Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground">{error}</p>
            </CardContent>
             <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/login">Volver a Inicio de Sesión</Link>
                </Button>
            </CardFooter>
        </Card>
    );
  }

  if (success) {
     return (
        <Card className="w-full max-w-md">
            <CardHeader className="items-center text-center">
                <CheckCircle className="h-12 w-12 text-green-500"/>
                <CardTitle className="mt-4">¡Éxito!</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground">{success}</p>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/login">Ir a Inicio de Sesión</Link>
                </Button>
            </CardFooter>
        </Card>
    );
  }

  if (mode === 'resetPassword') {
    return (
      <Card className="w-full max-w-sm">
        <form onSubmit={handleResetPassword}>
          <CardHeader>
            <CardTitle>Restablecer Contraseña</CardTitle>
            <CardDescription>
              Por favor, ingresa tu nueva contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">Nueva Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Debe tener al menos 6 caracteres"
                  />
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Nueva Contraseña'
                )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }
  
  return null; // Fallback for unsupported modes after initial check
}

export default function AuthActionHandlerPage() {
    return (
        <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Cargando...</p>
                </div>
            }>
                <ActionHandler />
            </Suspense>
        </div>
    );
}
