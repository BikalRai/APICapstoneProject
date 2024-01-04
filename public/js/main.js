const btns = document.querySelectorAll(".btn");
const content = document.querySelector(".content");
const allContent = document.querySelectorAll(".content__item");

content.addEventListener("click", function (e) {
  const selection = e.target;

  if (selection.classList.contains("btn")) {
    // remove all active class from all btns
    btns.forEach((btn) => {
      btn.classList.remove("active");
    });

    // remove the show class from all content
    allContent.forEach((content) => content.classList.remove("show"));

    //finding index of selection
    const i = Array.from(btns).indexOf(selection) - 1;
    allContent[i].classList.add("show");

    // add active class to selected button
    selection.classList.add("active");
  }
});
