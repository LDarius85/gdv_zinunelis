const APP_VERSION = "v3.1";

// PRIEŠ VISKĄ: reload kai perima valdymą
navigator.serviceWorker.addEventListener("controllerchange", () => {
  console.log("[App] Naujas SW perėmė kontrolę – reloadinam puslapį");
  window.location.reload();
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("[App] DOM pilnai užkrautas, versija:", APP_VERSION);

  const v = document.querySelector(".version");
  if (v) v.textContent = APP_VERSION;

  const backBtn = document.getElementById("backToTop");
  const content = document.querySelector(".content");

  if (backBtn && content) {
    backBtn.style.display = content.scrollTop > 100 ? "flex" : "none";

    content.addEventListener("scroll", () => {
      backBtn.style.display = content.scrollTop > 100 ? "flex" : "none";
    });

    backBtn.addEventListener("click", () => {
      scrollToTop();
    });
  }
});

function scrollToTop() {
  const content = document.querySelector(".content");
  if (content && content.scrollTop > 0) {
    content.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function toggleMenu() {
  document.getElementById("sidebar").classList.toggle("active");
}
function closeMenu() {
  document.getElementById("sidebar").classList.remove("active");
}
function filterSections() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  document.querySelectorAll("main section").forEach(section => {
    const text = section.innerText.toLowerCase();
    section.style.display = text.includes(query) ? "" : "none";
  });
}

// 🔄 Service Worker – atnaujinimų aptikimas
let newWorker;
let serviceWorkerRegistration;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(reg => {
    console.log("[App] SW užregistruotas");
    serviceWorkerRegistration = reg;

    if (reg.waiting) {
      console.log("[App] Rasta laukianti versija");
      newWorker = reg.waiting;
      showUpdateNotification();
    }

    reg.addEventListener("updatefound", () => {
      console.log("[App] Rasta nauja versija – installuojama");
      newWorker = reg.installing;
      newWorker.addEventListener("statechange", () => {
        console.log("[App] Naujo SW būsena:", newWorker.state);
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          console.log("[App] Naujas SW įdiegtas ir paruoštas perimt valdymą");
          showUpdateNotification();
        }
      });
    });

    // Versijos spaudimas
    const vElement = document.querySelector(".version");
    if (vElement) {
      vElement.style.cursor = "pointer";
      vElement.title = "Patikrinti ar yra nauja versija";
      vElement.addEventListener("click", () => {
        console.log("[App] Versijos numeris paspaustas – tikrinam atnaujinimus...");
        serviceWorkerRegistration.update();

        setTimeout(() => {
          if (!serviceWorkerRegistration.waiting) {
            console.log("[App] Nėra naujo SW – naudotojas turi naujausią versiją");
            showNoUpdateNotification();
          }
        }, 1500);
      });
    }
  });
}

// 🧾 Pranešimas apie atnaujinimą
function showUpdateNotification() {
  console.log("[App] Rodyti pranešimą apie naują versiją");
  const toast = document.createElement("div");
  toast.id = "updateNotification";
  toast.innerHTML = `
    <span>Yra nauja versija</span>
    <button id="reloadBtn">Atnaujinti</button>
  `;
  document.body.appendChild(toast);

  document.getElementById("reloadBtn").onclick = () => {
    if (newWorker) {
      console.log("[App] Spaustas 'Atnaujinti', siunčiam skipWaiting()");
      newWorker.postMessage({ action: "skipWaiting" });
    } else {
      console.warn("[App] newWorker neegzistuoja! Neįmanoma atnaujinti.");
    }
  };
}

// 🧾 Pranešimas kai atnaujinimo nėra
function showNoUpdateNotification() {
  console.log("[App] Rodom pranešimą: Nėra naujo atnaujinimo");
  const toast = document.createElement("div");
  toast.id = "updateNotification";
  toast.innerHTML = `
    <span>Naudojate naujausią versiją 👌</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
