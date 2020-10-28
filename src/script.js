"use strict";

let recipes = [
  {
    id: 0,
    name: "Cookies",
    ingredients: "powder, sugar, milk, cocoa",
    steps: [
      {
        name: "Prepare dough",
        time: 15,
      },
      {
        name: "Form cookies",
        time: 15,
      },
      {
        name: "Cook",
        time: 45,
      },
    ],
    rating: {
      sum: 28,
      votes: 6,
    },
  },

  {
    id: 1,
    name: "Soup",
    ingredients: "water, wegetables, pasta, potatos, mushrooms",
    steps: [
      {
        name: "Wash wegetables",
        time: 5,
      },
      {
        name: "Cut vegetables",
        time: 20,
      },
      {
        name: "Cook soup",
        time: 60,
      },
    ],
    rating: {
      sum: 45,
      votes: 12,
    },
  },
  {
    id: 2,
    name: "Ice cream",
    ingredients: "milk, sugar, fruits",
    steps: [
      {
        name: "Prepare",
        time: 20,
      },
      {
        name: "Insert into freezer",
        time: 120,
      },
    ],
    rating: {
      sum: 17,
      votes: 5,
    },
  },
];

let displayedRecipeId = undefined;
let changingRecipe = false;

// -------------------------------------------------------
// LOG
// -------------------------------------------------------
const log = (str) => {
  console.log(str);
};

// -------------------------------------------------------
// DELETE RECIPE
// -------------------------------------------------------
const deleteRecipe = (recipeId) => {
  recipes = recipes.filter((recipe) => recipe.id !== recipeId);
};

// -------------------------------------------------------
// ADDS NEW RECIPE TO THE END OF NAV LIST
// -------------------------------------------------------
const addRecipeToList = (recipe, list) => {
  let rating = recipe.rating.sum / recipe.rating.votes;
  let item = document.createElement("li");
  let button = document.createElement("button");
  let divRating = document.createElement("div");
  let divTooltip = document.createElement("div");
  item.className = "nav-item";
  item.id = "nav-item-" + recipe.id;
  button.className = "nav-item-button";
  button.type = "button";
  button.onclick = clickedRecipeButton;
  divRating.className = "nav-item-rating";
  divTooltip.className = "rating-tooltip";
  button.innerText = recipe.name;
  divRating.innerText = rating.toFixed(1);
  divTooltip.innerText = recipe.rating.votes + " votes";
  list.appendChild(item);
  item.appendChild(button);
  item.appendChild(divRating);
  divRating.appendChild(divTooltip);
};

// -------------------------------------------------------
// REMOVE RECIPE FROM LIST
// -------------------------------------------------------
const removeRecipeFromList = (recipeId, animationTime) => {
  const item = document.getElementById("nav-item-" + recipeId);
  const button = item.querySelector(".nav-item-button");

  button.removeAttribute("onclick");
  item
    .animate({ opacity: 0 }, { duration: animationTime * 0.5 })
    .finished.then(() => {
      item.style.opacity = 0;
      item.removeChild(item.querySelector(".nav-item-rating"));
      button.animate(
        { padding: "0px", fontSize: "0px" },
        { duration: animationTime * 0.5, easing: "ease-out" }
      );
      item
        .animate(
          { marginBottom: "0px" },
          { duration: animationTime * 0.5, easing: "ease-out" }
        )
        .finished.then(() => {
          item.remove();
        });
    });
};

// -------------------------------------------------------
// LOADS RECIPES INTO NAV LIST
// -------------------------------------------------------
const loadRecipesList = () => {
  const list = document.getElementById("nav-list");
  recipes.forEach((recipe) => {
    addRecipeToList(recipe, list);
  });
};

// -------------------------------------------------------
// UPDATES RECIPE WINDOW WITH SELECTED RECIPE
// -------------------------------------------------------
const updateDisplayedRecipe = (recipe) => {
  const recipeName = document.getElementById("recipe-name");
  const ingredients = document.getElementById("ingredients-list");
  const steps = document.getElementById("steps-list");
  // UPDATE NAME
  recipeName.innerHTML = recipe.name;
  // UPDATE INGREDIENTS
  ingredients.innerHTML = "";
  recipe.ingredients.split(",").forEach((ingredient) => {
    let itemIngredient = document.createElement("li");
    itemIngredient.className = "ingredients-item";
    itemIngredient.innerText = ingredient;
    ingredients.appendChild(itemIngredient);
  });
  // UPDATE STEPS
  steps.innerHTML = "";
  recipe.steps.forEach((step) => {
    let itemStep = document.createElement("li");
    let spStep = document.createElement("span");
    let spTime = document.createElement("span");
    let icon = document.createElement("i");
    let txTime = document.createTextNode(" " + step.time + " min.");
    itemStep.className = "steps-item";
    spStep.className = "step-name";
    spStep.innerText = step.name;
    spTime.className = "step-time";
    icon.className = "far fa-clock";
    steps.appendChild(itemStep);
    itemStep.appendChild(spStep);
    itemStep.appendChild(spTime);
    spTime.appendChild(icon);
    spTime.appendChild(txTime);
  });
  // UPDATE DISPLAYED RECIPE ID
  displayedRecipeId = recipe.id;
};

// -------------------------------------------------------
// HIDE NAV
// -------------------------------------------------------
const hideNav = () => {
  document.getElementById("nav").classList.add("hidden");
  document.getElementById("nav-bg").classList.add("collapsed");
};

// -------------------------------------------------------
// SHOW NAV
// -------------------------------------------------------
const showNav = () => {
  document.getElementById("nav").classList.remove("hidden");
  document.getElementById("nav-bg").classList.remove("collapsed");
};

// -------------------------------------------------------
// SLIDE IN RECIPE WINDOW
// -------------------------------------------------------
const slideInRecipeWindow = (animationTime, callback) => {
  const recipe = document.getElementById("recipe-window");

  recipe
    .animate(
      { left: "0px", opacity: 1 },
      { duration: animationTime * 0.9, easing: "ease-out" }
    )
    .finished.then(() => {
      recipe.style.left = "0px";
      recipe.style.opacity = 1;
    });

  if (callback !== undefined) {
    setTimeout(callback, animationTime);
  }
};

// -------------------------------------------------------
// SLIDE OUT RECIPE WINDOW
// -------------------------------------------------------
const slideOutRecipeWindow = (animationTime, callback) => {
  const recipe = document.getElementById("recipe-window");

  recipe
    .animate(
      { left: "-100vw", opacity: 0 },
      { duration: animationTime * 0.9, easing: "ease-out" }
    )
    .finished.then(() => {
      recipe.style.left = "-100vw";
      recipe.style.opacity = 0;
    });

  if (callback !== undefined) {
    setTimeout(callback, animationTime);
  }
};

// -------------------------------------------------------
// FADE IN RECIPE WINDOW
// -------------------------------------------------------
const fadeInRecipeWindow = (animationTime, callback) => {
  const recipe = document.getElementById("recipe-window");

  recipe.style.left = "0px";
  recipe
    .animate(
      { opacity: 1 },
      { duration: animationTime * 0.9, easing: "ease-out" }
    )
    .finished.then(() => {
      recipe.style.opacity = 1;
    });

  if (callback !== undefined) {
    setTimeout(callback, animationTime);
  }
};

// -------------------------------------------------------
// FADE OUT RECIPE WINDOW
// -------------------------------------------------------
const fadeOutRecipeWindow = (animationTime, callback) => {
  const recipe = document.getElementById("recipe-window");

  recipe
    .animate(
      { opacity: 0 },
      { duration: animationTime * 0.9, easing: "ease-out" }
    )
    .finished.then(() => {
      recipe.style.left = "-100vw";
      recipe.style.opacity = 0;
    });

  if (callback !== undefined) {
    setTimeout(callback, animationTime);
  }
};

// -------------------------------------------------------
// CHECK IF RECIPE WINDOW VISIBLE
// -------------------------------------------------------
const recipeWindowVisible = () =>
  window.getComputedStyle(document.getElementById("recipe-window")).opacity ==
  1;

// -------------------------------------------------------
// GET ANIMATION TIME
// -------------------------------------------------------
const getAnimationTime = () => {
  return (
    parseFloat(
      window
        .getComputedStyle(document.getElementById("nav"))
        .transitionDuration.split(",")[0]
    ) * 1000
  );
};

// -------------------------------------------------------
// CLICKED RECIPE ON THE LIST
// -------------------------------------------------------
function clickedRecipeButton() {
  const recipeId = parseInt(this.parentNode.id.slice(9));
  if (
    !isNaN(recipeId) &&
    !changingRecipe &&
    (!recipeWindowVisible() || recipeId !== displayedRecipeId)
  ) {
    changingRecipe = true;
    const recipe = recipes.find((recipe) => recipe.id === recipeId);
    const time = getAnimationTime();

    if (!recipeWindowVisible()) {
      updateDisplayedRecipe(recipe);
      slideInRecipeWindow(time, () => {
        changingRecipe = false;
      });
    } else if (recipeId !== displayedRecipeId) {
      slideOutRecipeWindow(time, () => {
        updateDisplayedRecipe(recipe);
        slideInRecipeWindow(time, () => {
          changingRecipe = false;
        });
      });
    }
  }
}

// -------------------------------------------------------
// CLICKED CLOSE BUTTON
// -------------------------------------------------------
const clickedCloseButton = () => {
  if (recipeWindowVisible()) {
    changingRecipe = true;
    const time = getAnimationTime();

    slideOutRecipeWindow(time, () => {
      changingRecipe = false;
    });
  }
};

// -------------------------------------------------------
// CLICKED EDIT BUTTON
// -------------------------------------------------------
const clickedEditButton = () => {
  const time = getAnimationTime();

  showPopup("popup-edit", time);
};

// -------------------------------------------------------
// CLICKED DELETE BUTTON
// -------------------------------------------------------
const clickedDeleteButton = () => {
  const time = getAnimationTime();

  showPopup("popup-delete", time);
};

// -------------------------------------------------------
// SHOW POPUP
// -------------------------------------------------------
const showPopup = (popupId, animationTime, callback) => {
  const popup = document.getElementById(popupId);

  if (popup != null) {
    document.getElementById("popup").classList.add("popup-visible");

    popup.style.opacity = 0;
    popup.style.transform = "translateY(-200px)";
    popup.style.display = "block";

    popup
      .animate(
        {
          opacity: 1,
          transform: "translateY(0px)",
        },
        { duration: animationTime * 0.9, easing: "ease-out" }
      )
      .finished.then(() => {
        popup.style.opacity = 1;
        popup.style.transform = "translateY(0px)";
      });

    if (callback !== undefined) {
      setTimeout(callback, animationTime);
    }
  }
};

// -------------------------------------------------------
// HIDE POPUP
// -------------------------------------------------------
const hidePopup = () => {
  document.getElementById("popup").classList.remove("popup-visible");
  for (let elem of document.getElementsByClassName("popup-window")) {
    elem.style.display = "none";
  }
};

// -------------------------------------------------------
// EDIT -> OK
// -------------------------------------------------------
const editButtonOK = () => {};

// -------------------------------------------------------
// EDIT -> CANCEL
// -------------------------------------------------------
const editButtonCancel = () => {
  hidePopup();
};

// -------------------------------------------------------
// DELETE -> OK
// -------------------------------------------------------
const deleteButtonOK = () => {
  if (recipeWindowVisible() && displayedRecipeId !== undefined) {
    changingRecipe = true;
    const time = getAnimationTime();

    hidePopup();
    removeRecipeFromList(displayedRecipeId, time);
    deleteRecipe(displayedRecipeId);

    fadeOutRecipeWindow(time, () => {
      displayedRecipeId = undefined;
      changingRecipe = false;
    });
  }
};

// -------------------------------------------------------
// DELETE -> CANCEL
// -------------------------------------------------------
const deleteButtonCancel = () => {
  hidePopup();
};

// -------------------------------------------------------
// INITIAL LOADING
// -------------------------------------------------------
const initialLoading = () => {
  loadRecipesList();
  document.getElementById("nav-menu-button").onclick = hideNav;
  document.getElementById("bg-menu-button").onclick = showNav;
  document.getElementById("recipe-close-button").onclick = clickedCloseButton;
  document.getElementById("recipe-edit-button").onclick = clickedEditButton;
  document.getElementById("recipe-delete-button").onclick = clickedDeleteButton;
  document.getElementById("edit-ok-button").onclick = editButtonOK;
  document.getElementById("edit-cancel-button").onclick = editButtonCancel;
  document.getElementById("delete-ok-button").onclick = deleteButtonOK;
  document.getElementById("delete-cancel-button").onclick = deleteButtonCancel;
};

window.addEventListener("load", initialLoading);
