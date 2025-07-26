function hamburgerf() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("active");
}
const headers = document.querySelectorAll(".acc-header");
headers.forEach((header) => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;

    document.querySelectorAll(".acc-content").forEach((c) => {
      if (c !== content) {
        c.style.maxHeight = null;
      }
    });

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

function changeTheme() {
  const html = document.documentElement; //<html lang="en" data-theme="dark">
  const currentTheme = html.getAttribute("data-theme"); //data-theme="dark"
  const img = document.getElementById("theme-image");
  let newTheme;
  switch (currentTheme) {
    case "light":
      newTheme = "dark";
      if (newTheme === "dark") {
        img.src = "img/darkthemelogo1.PNG";
      }
      break;

    case "dark":
      newTheme = "light";
      if (newTheme === "light") {
        img.src = "img/Computer-logo.PNG";
      }
      break;

    default:
      newTheme = "light";
  }
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}
