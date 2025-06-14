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
