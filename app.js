if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then(
      () => console.log("SW registered"),
      err => console.log("SW registration failed", err)
    );
  });
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

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// SW atnaujinimo žinutė
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    reg.onupdatefound = () => {
      const newWorker = reg.installing;
      newWorker.onstatechange = () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          const toast = document.createElement('div');
          toast.innerHTML = '<div style="position:fixed;bottom:60px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:1em;border-radius:6px;z-index:1001;">Yra atnaujinimas – <button onclick="location.reload()">Atnaujinti dabar</button></div>';
          document.body.appendChild(toast);
        }
      };
    };
  });
}
