export const dictionary = {
  metadata: {
    title: "Palomeitor",
    description: "Una aplicación de ciencia ciudadana para contar palomas y contribuir a los datos de vida silvestre urbana.",
  },
  header: {
    title: "Palomeitor",
    home: "Inicio",
    report: "Reportar Avistamiento",
    reports: "Reportes",
    about: "Acerca de",
  },
  pigeonUploader: {
    cardTitle: "Reportar un Avistamiento de Palomas",
    cardDescription: "Usa la cámara de tu dispositivo para reportar un avistamiento. Esto asegura la trazabilidad y ubicación del reporte.",
    idle: {
      acceptTerms: "Aceptar términos y condiciones",
      consent: "Doy mi consentimiento para compartir mi foto y datos de ubicación para esta iniciativa de ciencia ciudadana.",
      uploadButton: "Tomar Foto",
    },
    privacy: {
        title: "¿Cómo se usan mis datos?",
        description: "Tu correo electrónico e información de usuario se mantienen privados y nunca se comparten. La ubicación de tu avistamiento se usa de forma anónima para crear mapas de calor agregados con fines de investigación. Tu contribución es valiosa y confidencial.",
    },
    loading: {
      analyzing: "La IA está analizando tu foto...",
      submitting: "Enviando tu reporte...",
    },
    previewing: {
      imageAlt: "Vista previa del avistamiento de palomas",
      analyzeButton: "Analizar Palomas",
    },
    confirming: {
      imageAlt: "Avistamiento de palomas",
      pigeonsDetected: "Palomas Detectadas",
      location: "Ubicación",
      gettingLocation: "Obteniendo ubicación...",
      enterLocation: "Ingresar ubicación manually",
      aiAnalysis: "Análisis de IA",
      discardButton: "Descartar",
      submitButton: "Confirmar y Enviar",
    },
    success: {
      title: "¡Reporte Enviado!",
      description: "¡Gracias por tu contribución a la ciencia de las palomas!",
      resetButton: "Enviar Otro Reporte",
    },
    error: {
      title: "Ocurrió un Error",
      description: "Algo salió mal. Por favor, inténtalo de nuevo.",
      resetButton: "Intentar de Nuevo",
    },
    toast: {
        analysisFailed: {
            title: "El Análisis de IA Falló"
        },
        submissionFailed: {
            title: "El Envío Falló"
        },
        locationMissing: {
            title: "Falta la ubicación",
            description: "Por favor, proporciona una ubicación para el avistamiento."
        }
    }
  },
  reportsPage: {
    title: "Reportes de Avistamientos",
    description: "Datos agregados de todos los avistamientos de palomas enviados por los ciudadanos.",
    tableView: "Tabla",
    mapView: "Mapa",
    leaderboardView: "Líderes"
  },
  reportTable: {
    exportButton: "Exportar a CSV",
    noReports: "Aún no se han enviado reportes.",
    photoAlt: "Avistamiento de palomas",
    anonymous: "Anónimo",
    headers: {
        photo: "Foto",
        dateTime: "Fecha y Hora",
        reporter: "Reportado por",
        location: "Ubicación",
        count: "Cantidad",
        aiDescription: "Descripción de IA"
    }
  },
  leaderboard: {
      title: "Tabla de Líderes",
      noData: "No hay datos suficientes para mostrar la tabla de líderes.",
      headers: {
          rank: "Puesto",
          spotter: "Avistador",
          totalPigeons: "Palomas Contadas",
          reports: "Reportes"
      }
  }
};
