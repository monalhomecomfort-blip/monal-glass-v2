(function () {
  const CONSENT_KEY = "monal_cookie_consent";

  function updateConsent(status) {
    if (typeof gtag !== "function") return;

    if (status === "accepted") {
      gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted"
      });
    }

    if (status === "rejected") {
      gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
      });
    }
  }

  function createCookieBanner() {
    if (localStorage.getItem(CONSENT_KEY)) {
      updateConsent(localStorage.getItem(CONSENT_KEY));
      return;
    }

    const banner = document.createElement("div");
    banner.id = "cookie-consent-banner";

    banner.innerHTML = `
      <div class="cookie-consent-box">
        <div class="cookie-consent-text">
          <strong>Ми використовуємо cookie</strong>
          <p>
            Mōnal використовує cookie для аналітики, покращення роботи сайту
            та персоналізації реклами. Ви можете прийняти або відхилити
            використання таких даних.
          </p>
          <a href="privacy.html">Політика конфіденційності</a>
        </div>

        <div class="cookie-consent-actions">
          <button type="button" id="cookie-reject">Відхилити</button>
          <button type="button" id="cookie-accept">Прийняти</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById("cookie-accept").addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, "accepted");
      updateConsent("accepted");
      banner.remove();
    });

    document.getElementById("cookie-reject").addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, "rejected");
      updateConsent("rejected");
      banner.remove();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createCookieBanner);
  } else {
    createCookieBanner();
  }
})();
