
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, type User } from 'firebase/auth';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ToastAction } from '@/components/ui/toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleResendVerificationEmail = async (user: User) => {
    try {
        await sendEmailVerification(user);
        toast({
            title: 'Correo Reenviado',
            description: 'Se ha enviado un nuevo correo de verificación a tu bandeja de entrada.',
        });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error al Reenviar Correo',
            description: 'No se pudo reenviar el correo de verificación. Por favor, inténtalo de nuevo más tarde.',
        });
    }
  }

  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Correo Electrónico Requerido',
        description: 'Por favor, ingresa tu correo electrónico para restablecer la contraseña.',
      });
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Correo de Restablecimiento Enviado',
        description: 'Revisa tu bandeja de entrada para ver las instrucciones para restablecer tu contraseña.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al Enviar Correo',
        description: error.code === 'auth/user-not-found' ? 'No se encontró ninguna cuenta con ese correo.' : 'Ocurrió un error. Inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        toast({
          variant: 'destructive',
          title: 'Correo no verificado',
          description: 'Por favor, verifica tu correo electrónico para poder iniciar sesión.',
          action: (
            <ToastAction altText="Reenviar" onClick={() => handleResendVerificationEmail(user)}>
              Reenviar correo
            </ToastAction>
          ),
        });
        await signOut(auth); // Log out user until they verify
      } else {
        toast({
          title: 'Inicio de Sesión Exitoso',
          description: '¡Bienvenido de nuevo!',
        });
        router.push('/reports');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al Iniciar Sesión',
        description:
          error.code === 'auth/invalid-credential'
            ? 'Credenciales inválidas. Por favor, verifica tu email y contraseña.'
            : 'Ocurrió un error. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tu email y contraseña para acceder a tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="link" type="button" className="ml-auto inline-block text-sm underline">
                        ¿Olvidaste tu contraseña?
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Restablecer Contraseña</AlertDialogTitle>
                        <AlertDialogDescription>
                          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                          Asegúrate de que el correo sea: <span className="font-bold">{email || 'tu-email@ejemplo.com'}</span>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePasswordReset}>Continuar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O continuar con
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full" type="button" disabled>
                Ingresar con Mi Argentina
            </Button>
          </CardContent>
          <CardFooter className="text-center text-sm">
            ¿No tienes una cuenta?{' '}
            <Link href="/signup" className="underline ml-1">
              Regístrate
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
