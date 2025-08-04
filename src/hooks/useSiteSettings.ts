'use client';

import { useState, useEffect } from 'react';

interface SiteSettings {
  registrationEnabled: boolean;
  maintenanceMode: boolean;
  siteName: string;
  siteDescription: string;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    registrationEnabled: true,
    maintenanceMode: false,
    siteName: 'Muse3D Studio',
    siteDescription: '3D Baskı ve Tasarım Platformu'
  });

  useEffect(() => {
    // localStorage'dan ayarları yükle
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  return settings;
} 