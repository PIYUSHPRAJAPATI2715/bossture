// Google Ads & Analytics Conversion Tracking Helper
export const GOOGLE_ADS_CONFIG = {
  // Google Analytics 4 & Google Ads Tag ID
  ADS_CONVERSION_ID: 'G-YR1Z6SDFT8', 
  CONVERSION_LABELS: {
    PHONE_CALL: 'call_click_label',
    WHATSAPP: 'whatsapp_click_label',
    BOOKING_SUBMIT: 'booking_form_submit_label',
    CONTACT_SUBMIT: 'contact_form_submit_label'
  }
};

/**
 * Fires a Google Ads Conversion Event
 * @param {string} conversionLabel - Google Ads conversion label identifier
 * @param {number} [value=0] - Optional transaction or lead value
 */
export const trackGoogleAdsEvent = (conversionLabel, value = 0) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    const eventId = GOOGLE_ADS_CONFIG.ADS_CONVERSION_ID + '/' + conversionLabel;
    window.gtag('event', 'conversion', {
      'send_to': eventId,
      'value': value,
      'currency': 'INR'
    });
    console.log(`[Google Ads] Conversion Event Fired: ${eventId}`);
  } else {
    console.log(`[Google Ads Tracker] Simulated Conversion Event: ${conversionLabel}`);
  }
};

export const trackPhoneCall = () => {
  trackGoogleAdsEvent(GOOGLE_ADS_CONFIG.CONVERSION_LABELS.PHONE_CALL);
};

export const trackWhatsAppClick = () => {
  trackGoogleAdsEvent(GOOGLE_ADS_CONFIG.CONVERSION_LABELS.WHATSAPP);
};

export const trackBookingSubmit = (amount = 0) => {
  trackGoogleAdsEvent(GOOGLE_ADS_CONFIG.CONVERSION_LABELS.BOOKING_SUBMIT, amount);
};

export const trackContactSubmit = () => {
  trackGoogleAdsEvent(GOOGLE_ADS_CONFIG.CONVERSION_LABELS.CONTACT_SUBMIT);
};
