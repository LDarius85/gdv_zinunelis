const APP_VERSION = "v3.0";

// Reloadinam puslapį kai naujas SW perima kontrolę (turi būti prieš register!)
navigator.serviceWorker.addEventListener("controllerchange", () => {
  console.log("[App] Naujas Service Worker perėmė valdymą – puslapis persikrauna");
  window.location.reload();
});

document.addEventListener("DOMContentLoaded", () => {
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
      console.log("[App] Rasta nauja versija");
      newWorker = reg.installing;
      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          console.log("[App] Nauja versija paruošta, rodome pranešimą");
          showUpdateNotification();
        }
      });
    });

    // 👇 Versijos numerio paspaudimas
    const vElement = document.querySelector(".version");
    if (vElement) {
      vElement.style.cursor = "pointer";
      vElement.title = "Patikrinti ar yra nauja versija";
      vElement.addEventListener("click", () => {
        console.log("[App] Versijos numeris paspaustas – tikrinam atnaujinimus");
        serviceWorkerRegistration.update();

        setTimeout(() => {
          if (!serviceWorkerRegistration.waiting) {
            showNoUpdateNotification();
          }
        }, 1500);
      });
    }
  });
}

// 🧾 Pranešimas apie NAUJĄ versiją
function showUpdateNotification() {
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
    }
  };
}

// 🧾 Pranešimas kai NAUJINIMO NĖRA
function showNoUpdateNotification() {
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
