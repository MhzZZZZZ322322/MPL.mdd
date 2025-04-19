// Google Tag Manager
export const GTM_ID = 'GTM-WLCK36H7';

export const initGTM = () => {
  const w = window as any;
  const d = document;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });

  const f = d.getElementsByTagName('script')[0];
  const j = d.createElement('script');
  const dl = 'dataLayer' != 'dataLayer' ? '&l=' + 'dataLayer' : '';
  j.async = true;
  j.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}${dl}`;
  f.parentNode?.insertBefore(j, f);
};

// Pentru a adăuga GTM noscript iframe în body
export const GTMNoScript = () => {
  return `
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
  `;
};