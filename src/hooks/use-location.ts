"use client";

import { useState, useEffect } from "react";

type LocationState = {
  coordinates: { lat: number; lng: number } | null;
  error: string | null;
  loading: boolean;
};

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    coordinates: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;

    if (!navigator.geolocation) {
      if (isMounted) {
        setLocation({
          coordinates: null,
          error: "Geolocation is not supported by your browser.",
          loading: false,
        });
      }
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      if (isMounted) {
        setLocation({
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
          loading: false,
        });
      }
    };

    const onError = (error: GeolocationPositionError) => {
      if (isMounted) {
        setLocation({
          coordinates: null,
          error: error.message,
          loading: false,
        });
      }
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return location;
}
