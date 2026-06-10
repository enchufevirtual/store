let cachedDefaultLocale: string | null = null

export async function getDefaultLocaleCode(): Promise<string> {
  if (cachedDefaultLocale) {
    return cachedDefaultLocale
  }

  // Always use Spanish
  cachedDefaultLocale = 'es'
  return cachedDefaultLocale
}
