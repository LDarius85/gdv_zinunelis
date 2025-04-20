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
