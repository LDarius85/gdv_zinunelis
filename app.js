const APP_VERSION = "v2.6";

document.addEventListener("DOMContentLoaded", () => {
  const v = document.querySelector(".version");
  if (v) v.textContent = APP_VERSION;

  const backBtn = document.getElementById("backToTop");
  const content = document.querySelector(".content");

  if (backBtn && content) {
    // Tikrinam scroll poziciją iškart po užkrovimo
    backBtn.style.display = content.scrollTop > 100 ? "flex" : "none";

    // Scroll listeneris
    content.addEventListener("scroll", () => {
      backBtn.style.display = content.scrollTop > 100 ? "flex" : "none";
    });

    // Scroll to top veiksmas
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

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(reg => {
    // Jeigu jau yra laukiantis SW
    if (reg.waiting) {
      newWorker = reg.waiting;
      showUpdateNotification();
    }

    // Jei atsirado naujas
    reg.addEventListener("updatefound", () => {
      newWorker = reg.installing;
      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          showUpdateNotification();
        }
      });
    });
  });

  // Kai naujas SW perima kontrolę – perkraunam puslapį
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}

// 🧾 Parodyti pranešimą apie atnaujinimą
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
      newWorker.postMessage({ action: "skipWaiting" });
    }
  };
}
