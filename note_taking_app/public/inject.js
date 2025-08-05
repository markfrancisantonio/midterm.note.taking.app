// wanted a function that mimic the EJS header/footer.  Chatgpt suggested to create html instead which i did then helped me produce this file to load in my html files
async function loadComponent(id, file) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Failed to load ${file}`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "/partials/header.html");
  loadComponent("footer", "/partials/footer.html");
});
