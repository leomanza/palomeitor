
export const dictionary = {
  metadata: {
    title: "Flockia",
    description: "A citizen science app for counting pigeons and contributing to urban wildlife data.",
  },
  header: {
    title: "Flockia",
    home: "Home",
    report: "Report Sighting",
    reports: "Reports",
    about: "About",
  },
  pigeonUploader: {
    cardTitle: "Report a Pigeon Sighting",
    cardDescription: "Use your device's camera to report a sighting. This ensures the traceability and location of the report.",
    idle: {
      acceptTerms: "Accept terms and conditions",
      consent: "I consent to sharing my photo and location data for this citizen science initiative.",
      uploadButton: "Take Photo",
    },
    privacy: {
      title: "How is my data used?",
      description: "Your email and user information are kept private and never shared. The location of your sighting is used anonymously to create aggregated heatmaps for research purposes. Your contribution is valuable and confidential.",
    },
    loading: {
      analyzing: "AI is analyzing your photo...",
      submitting: "Submitting...",
    },
    previewing: {
      imageAlt: "Pigeon sighting preview",
      analyzeButton: "Analyze Pigeons",
    },
    confirming: {
      imageAlt: "Pigeon sighting",
      pigeonsDetected: "Pigeons Detected",
      location: "Location",
      gettingLocation: "Getting location...",
      locationUnavailable: "Unavailable",
      aiAnalysis: "AI Analysis",
      discardButton: "Discard",
      submitButton: "Confirm & Submit",
      noPigeonsFound: {
        title: "No Pigeons Detected",
        description: "The AI did not find any pigeons in this photo. Reports can only be submitted if at least one pigeon is detected."
      },
      locationError: {
        title: "Location Access Required",
        description: "GPS access is mandatory. Please enable location permissions in your browser and phone settings to submit a report."
      }
    },
    success: {
      title: "Report Submitted!",
      description: "Thank you for your contribution to pigeon science!",
      resetButton: "Submit Another Report",
    },
    error: {
      title: "An Error Occurred",
      description: "Something went wrong. Please try again.",
      resetButton: "Try Again",
    },
    toast: {
        analysisFailed: {
            title: "AI Analysis Failed"
        },
        submissionFailed: {
            title: "Submission Failed"
        },
        locationMissing: {
            title: "Location missing",
            description: "Please provide a location for the sighting."
        }
    }
  },
  reportsPage: {
    title: "Sighting Reports",
    description: "Aggregated data from all citizen-submitted pigeon sightings.",
    tableView: "Table",
    mapView: "Map",
    leaderboardView: "Leaders"
  },
  reportTable: {
    exportButton: "Export to CSV",
    noReports: "No reports submitted yet.",
    photoAlt: "Pigeon sighting",
    anonymous: "Anonymous",
    headers: {
        photo: "Photo",
        dateTime: "Date & Time",
        reporter: "Reporter",
        location: "Location",
        count: "Count",
        aiDescription: "AI Description"
    }
  },
  leaderboard: {
      title: "Leaderboard",
      noData: "Not enough data to display the leaderboard.",
      headers: {
          rank: "Rank",
          spotter: "Spotter",
          totalPigeons: "Pigeons Counted",
          reports: "Reports"
      }
  }
};
