'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
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

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error de Registro',
        description: 'Las contraseñas no coinciden.',
      });
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);

      toast({
        title: '¡Registro Exitoso!',
        description: 'Tu cuenta ha sido creada. Se ha enviado un correo de verificación. Por favor, confirma tu email antes de iniciar sesión.',
      });
      router.push('/login');
    } catch (error: any) {
      console.error('Signup Error:', error);
      let description = 'Ocurrió un error. Por favor, inténtalo de nuevo.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'Este correo electrónico ya está en uso.';
      } else if (error.code === 'auth/weak-password') {
        description = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
      } else if (error.code === 'auth/invalid-email') {
        description = 'El formato del correo electrónico no es válido.';
      } else if (error.code === 'auth/configuration-not-found') {
        description = 'Error de configuración de Firebase. Contacta al administrador.';
      } else if (error.code) {
        description = `Error: ${error.message}`;
      }
      toast({
        variant: 'destructive',
        title: 'Error de Registro',
        description: `${description}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSignup}>
          <CardHeader>
            <CardTitle className="text-2xl">Crear una Cuenta</CardTitle>
            <CardDescription>
              Ingresa tus datos para registrarte.
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
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </CardContent>
          <CardFooter className="text-center text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="underline ml-1">
              Inicia Sesión
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
