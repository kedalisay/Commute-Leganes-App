export const translations = {
  English: {
    appName: 'Commute Leganes',
    betaFeedback: 'For feedback or issues, go to Settings.',
    loading: 'Loading Commute Leganes...',
    findingRoutes: 'Finding the best routes.',
    preparingMap: 'Preparing the map and routes.',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    information: 'Information',
    support: 'Support',
    about: 'About',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    reportIssue: 'Report Issue',
    giveFeedback: 'Give Feedback',
    contactUs: 'Contact Us',
    closeSettings: 'Close settings',
    save: 'Save',
    cancel: 'Cancel',
    confirmLocation: 'Confirm location',
    goBackToLocations: 'Go back to list of locations',
    whereFrom: 'Where from?',
    whereTo: 'Where to?',
    chooseStartingLocation: 'Choose a starting location on the map',
    chooseDestinationLocation: 'Choose a destination location on the map',
    chooseLocation: 'Choose a location',
    chooseOnMap: 'Choose on map',
    useCurrentLocation: 'Use your current location',
    chooseRoute: 'Choose a route',
    publicRoutes: 'Public Routes',
    chooseLocationTitle: 'Choose a Location',
    chooseRouteTitle: 'Choose a Route',
    openSettings: 'Open settings',
    showPublicRoutes: 'Show public routes',
    swapLocations: 'Swap from and to',
  },
  Hiligaynon: {
    betaFeedback: 'Para sa feedback ukon isyu, magdiretso sa Settings.',
    loading: 'Gina-preparar ang Commute Leganes...',
    findingRoutes: 'Ginapangita ang pinakamaayo nga ruta.',
    preparingMap: 'Ginaandam ang mapa kag mga ruta.',
    language: 'Lenggwahe',
    information: 'Impormasyon',
    support: 'Support',
    about: 'About',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    reportIssue: 'Report Issue',
    giveFeedback: 'Give Feedback',
    contactUs: 'Contact Us',
    closeSettings: 'Close settings',
    confirmLocation: 'Kumpirmahin ang lokasyon',
    goBackToLocations: 'Balik sa listahan ng mga lokasyon',
    whereFrom: 'Diin halin?',
    whereTo: 'Diin pakadto?',
    chooseStartingLocation: 'Magpili kung diin ikaw halin sa mapa',
    chooseDestinationLocation: 'Magpili kung diin ikaw pakadto sa mapa',
    chooseLocation: 'Magpili sang lokasyon',
    chooseOnMap: 'Magpili sa mapa',
    useCurrentLocation: 'Gamita ang imo lokasyon',
    chooseRoute: 'Magpili sang ruta',
    publicRoutes: 'Public Routes',
    chooseLocationTitle: 'Choose a Location',
    chooseRouteTitle: 'Choose a Route',
    openSettings: 'Open settings',
    showPublicRoutes: 'Show public routes'
  },
  Tagalog: {
    betaFeedback: 'Para sa feedback o isyu, pumunta sa Settings.',
    loading: 'Inihahanda ang Commute Leganes...',
    preparingMap: 'Ginahanda ang mapa at mga ruta.',
    findingRoutes: 'Hinahanap ang pinakamainam na ruta.',
    language: 'Lenggwahe',
    information: 'Impormasyon',
    support: 'Support',
    about: 'About',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    reportIssue: 'Report Issue',
    giveFeedback: 'Give Feedback',
    contactUs: 'Contact Us',
    closeSettings: 'Close settings',
    confirmLocation: 'Kumpirmahin ang lokasyon',
    goBackToLocations: 'Balik sa listahan ng mga lokasyon',
    whereFrom: 'Saan galing?',
    whereTo: 'Saan pupunta?',
    chooseStartingLocation: 'Pumili ng panimulang lokasyon sa mapa',
    chooseDestinationLocation: 'Pumili ng destinasyon sa mapa',
    chooseLocation: 'Pumili ng lokasyon',
    chooseOnMap: 'Pumili sa mapa',
    useCurrentLocation: 'Gamitin ang iyong lokasyon',
    chooseRoute: 'Pumili ng ruta',
    publicRoutes: 'Public Routes',
    chooseLocationTitle: 'Choose a Location',
    chooseRouteTitle: 'Choose a Route',
    openSettings: 'Open settings',
    showPublicRoutes: 'Show public routes'
  },
}

const normalizeLanguage = (language) => (
  Object.prototype.hasOwnProperty.call(translations, language)
    ? language
    : 'English'
)

export const getTranslation = (language, key) => {
  const normalizedLanguage = normalizeLanguage(language)
  return translations[normalizedLanguage][key]
    || translations.English[key]
    || key
}

export const getLanguageCode = (language) => {
  if (language === 'Hiligaynon') return 'hil'
  if (language === 'Tagalog') return 'tl'
  return 'en'
}
