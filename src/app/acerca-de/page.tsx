import { Bird, Info } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Info className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold font-headline">Acerca de Flockia</h1>
      </div>

      <div className="prose prose-lg max-w-none text-foreground">
        <p>
          <strong>Flockia</strong> es una aplicación de ciencia ciudadana diseñada para hacer que el reporte de avistamientos de palomas urbanas sea rápido, fácil y accesible para todos.
        </p>

        <h2 className="text-2xl font-semibold mt-8 border-b pb-2">Nuestra Inspiración</h2>
        <p>
          Esta herramienta fue creada como un proyecto independiente, inspirado por la iniciativa de ciencia ciudadana sobre palomas urbanas lanzada por el <a href="https://inbiosur.conicet.gov.ar/proyectopalomas/" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-primary">Instituto de Investigaciones Biológicas y Biomédicas del Sur (INBIOSUR, CONICET-UNS)</a>.
        </p>
        <p>
          El objetivo es facilitar la recolección de datos valiosos que pueden ayudar a entender mejor la ecología y el comportamiento de estas aves en nuestros entornos urbanos.
        </p>
        
        <blockquote className="border-l-4 border-primary pl-4 py-2 my-6 bg-muted">
          <p className="text-base font-medium text-foreground">
            <strong>Nota Importante:</strong> Flockia es una aplicación no oficial y no tiene afiliación directa con INBIOSUR o CONICET. Es una contribución independiente a la ciencia ciudadana.
          </p>
        </blockquote>

        <h2 className="text-2xl font-semibold mt-8 border-b pb-2">¿Cómo Funciona?</h2>
        <ol className="list-decimal pl-5 space-y-2 mt-4">
          <li><strong>Toma una Foto:</strong> Usa la cámara de tu dispositivo a través de la app. No se permite subir fotos de la galería para asegurar la trazabilidad y la ubicación precisa del reporte.</li>
          <li><strong>Análisis con IA:</strong> La aplicación utiliza inteligencia artificial para contar el número de palomas y analizar la escena.</li>
          <li><strong>Confirma y Envía:</strong> Revisa los datos, confirma tu ubicación (detectada automáticamente) y envía el reporte. ¡Tus datos se agregan al mapa global al instante!</li>
        </ol>

        <p className="mt-8">
          Gracias por tu interés y ¡feliz avistamiento!
        </p>
      </div>
    </div>
  );
}
