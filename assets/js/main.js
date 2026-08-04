(() => {
  "use strict";
  const config = window.LP_CONFIG || {};
  const validUrl = (value) => value && !String(value).startsWith("YOUR_");

  document.querySelectorAll("[data-event='date']").forEach((el) => { el.textContent = config.eventDate || "日程調整中"; });
  document.querySelectorAll("[data-event='capacity']").forEach((el) => { el.textContent = config.capacity || "少人数制"; });
  document.querySelectorAll("[data-contact-link]").forEach((el) => { if (validUrl(config.contactUrl)) el.href = config.contactUrl; });
  document.querySelectorAll("[data-website-link]").forEach((el) => { if (validUrl(config.websiteUrl)) el.href = config.websiteUrl; });

  const track = (eventName, params = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...params });
    if (typeof window.gtag === "function") window.gtag("event", eventName, params);
  };

  const loadTracking = () => {
    if (config.gtmContainerId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.gtmContainerId)}`;
      document.head.appendChild(script);
    } else if (config.ga4MeasurementId) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.ga4MeasurementId)}`;
      document.head.appendChild(script);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){ window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", config.ga4MeasurementId);
    }
  };
  loadTracking();

  document.querySelectorAll(".js-apply").forEach((link) => {
    if (validUrl(config.applicationUrl)) {
      link.href = config.applicationUrl;
      link.target = "_blank";
      link.rel = "noopener";
    }
    link.addEventListener("click", () => track("application_click", { cta_location: link.dataset.ctaLocation || "unknown", link_url: link.href }));
  });

  // 埋め込みフォームを追加した場合は、このイベントを送るだけでGA4/GTMへ連携できます。
  document.addEventListener("supushi:form-submit", (event) => track("form_submit", event.detail || {}));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealElements = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealElements.forEach((el) => observer.observe(el));
  } else revealElements.forEach((el) => el.classList.add("is-visible"));

  const heroButton = document.querySelector("[data-cta-location='hero']");
  const mobileBar = document.querySelector("[data-mobile-cta]");
  if (heroButton && mobileBar && "IntersectionObserver" in window) {
    const ctaObserver = new IntersectionObserver(([entry]) => mobileBar.classList.toggle("is-active", !entry.isIntersecting), { threshold: 0 });
    ctaObserver.observe(heroButton);
  }
})();
