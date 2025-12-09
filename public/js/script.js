(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

let taxSwitch = document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click", () => {
  console.log("clicked");
  let taxInfo = document.getElementsByClassName("tax-info");
  for (info of taxInfo) {
    if (info.style.display != "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
});

const filters = document.querySelector("#filters");
const arrowButtons = document.querySelectorAll(".filter-arrow");
let isDragging = false;
let startX, startScrollLeft;

// Guard if filters doesn't exist (other pages)
if (filters) {
  filters.style.touchAction = "none";
}

const handleIcons = () => {
  if (!filters || arrowButtons.length < 2) return;

  const maxScrollableWidth = filters.scrollWidth - filters.clientWidth;

  // If nothing to scroll, hide both arrows
  if (maxScrollableWidth <= 0) {
    arrowButtons[0].style.display = "none";
    arrowButtons[1].style.display = "none";
    return;
  }

  const scrollValue = Math.round(filters.scrollLeft);

  // At far left: hide left, show right
  arrowButtons[0].style.display = scrollValue <= 0 ? "none" : "flex";

  // At / past far right: hide right, show left
  arrowButtons[1].style.display =
    scrollValue >= maxScrollableWidth ? "none" : "flex";
};

// arrow click
arrowButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!filters) return;
    const icon = btn.querySelector("i");
    const scrollAmount = filters.clientWidth / 6;
    filters.scrollBy({
      left: icon.id === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(handleIcons, 300);
  });
});

// drag start
const startDrag = (e) => {
  if (!filters) return;
  isDragging = true;
  filters.classList.add("dragging");
  startX = e.pageX || e.touches[0].pageX;
  startScrollLeft = filters.scrollLeft;
};

// drag move
const onDrag = (e) => {
  if (!isDragging || !filters) return;
  e.preventDefault();
  const x = e.pageX || e.touches[0].pageX;
  const walk = (x - startX) * 2.5;
  filters.scrollLeft = startScrollLeft - walk;
  handleIcons();
};

// drag stop
const stopDrag = () => {
  if (!filters) return;
  isDragging = false;
  filters.classList.remove("dragging");
};

if (filters) {
  // mouse drag
  filters.addEventListener("mousedown", startDrag);
  filters.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);

  // touch drag
  filters.addEventListener("touchstart", startDrag, { passive: false });
  filters.addEventListener("touchmove", onDrag, { passive: false });
  filters.addEventListener("touchend", stopDrag);

  // wheel scroll (trackpad)
  filters.addEventListener(
    "wheel",
    (e) => {
      if (!e.deltaX && !e.deltaY) return;
      e.preventDefault();
      filters.scrollLeft += e.deltaX !== 0 ? e.deltaX * 2 : e.deltaY * 3;
      handleIcons();
    },
    { passive: false }
  );
}

// init arrow visibility AFTER layout
window.addEventListener("load", handleIcons);