
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { reportIssue } from '@/app/actions';
import { ReportIssueInputSchema, type ReportIssueInput } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bug, Loader2 } from 'lucide-react';

export default function ReportIssueDialog() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const { toast } = useToast();

  useState(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  });

  const form = useForm<ReportIssueInput>({
    resolver: zodResolver(ReportIssueInputSchema),
    defaultValues: {
      issueType: 'bug',
      description: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: ReportIssueInput) {
    const submissionData: ReportIssueInput = {
      ...values,
      userEmail: user?.email ?? undefined,
      userId: user?.uid ?? undefined,
      page: pathname,
    };
    
    const result = await reportIssue(submissionData);

    if (result.success) {
      toast({
        title: '¡Gracias por tu ayuda!',
        description: 'Hemos recibido tu reporte. Lo revisaremos pronto.',
      });
      setOpen(false);
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error al enviar el reporte',
        description: result.error || 'Por favor, inténtalo de nuevo más tarde.',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-muted-foreground hover:text-white transition-colors">
            <Bug className="h-4 w-4" />
            Reportar un Problema
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Reportar un Problema</DialogTitle>
              <DialogDescription>
                Ayúdanos a mejorar Flockia. Describe el problema que encontraste.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="issueType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Problema</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bug">Error o Bug</SelectItem>
                        <SelectItem value="suggestion">Sugerencia de Mejora</SelectItem>
                        <SelectItem value="visual">Problema Visual</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Por favor, sé lo más detallado posible. ¿Qué estabas haciendo? ¿Qué esperabas que sucediera?"
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Reporte'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
