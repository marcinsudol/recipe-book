class Nav {
  constructor(
    arr,
    displayRecipeCallback,
    openEditorCallback,
    resetRecipesCallback,
    updateTabIndexCallback
  ) {
    // Saving callbacks
    this.displayRecipeCallback = displayRecipeCallback;
    this.openEditorCallback = openEditorCallback;
    this.resetRecipesCallback = resetRecipesCallback;
    this.updateTabIndexCallback = updateTabIndexCallback;

    // Setting DOM elements
    this.navContainer = document.getElementById("nav-container");
    this.nav = document.getElementById("nav");
    this.navList = document.getElementById("nav-list");
    this.hideListButton = document.getElementById("hide-list-button");
    this.showListButton = document.getElementById("show-list-button");
    this.recipeWindow = document.getElementById("recipe-window");

    // Binding methods
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.clickedAddRecipe = this.clickedAddRecipe.bind(this);
    this.clickedDisplayRecipe = this.clickedDisplayRecipe.bind(this);
    this.clickedResetList = this.clickedResetList.bind(this);
    this.keyDownOnNavList = this.keyDownOnNavList.bind(this);
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);

    // Setting additional properties
    this._selectedItem = 0;
    this.itemsCounter = 0;

    // Adding events listeners
    this.hideListButton.onclick = this.hide;
    this.showListButton.onclick = this.show;
    document.getElementById("nav-add-button").onclick = this.clickedAddRecipe;
    document.getElementById("nav-reset-button").onclick = this.clickedResetList;
    this.navList.onkeydown = this.keyDownOnNavList;

    // Initializing item list with array
    this.addList(arr, "fade");
  }

  // ----------------------------------------------------------------
  // Managing nav's visibility
  // ----------------------------------------------------------------

  // Show nav
  show() {
    this.nav.classList.remove("hidden");
    this.recipeWindow.classList.add("narrower");
    this.enableTab();
    this.focus();
  }

  // Hide nav
  hide() {
    this.nav.classList.add("hidden");
    this.recipeWindow.classList.remove("narrower");
    this.enableTab();
    this.focus();
  }

  // Check if nav is visible
  get visible() {
    return !this.nav.classList.contains("hidden");
  }

  // ----------------------------------------------------------------
  // Managing list items
  // ----------------------------------------------------------------

  // Add items from array to nav list (without removing previous items)
  addList(arr, styleIn) {
    arr.forEach((obj) => this.addItem(obj));
    if (styleIn === "fade") {
      this.navList.animate(
        {
          opacity: [0, 1],
        },
        {
          duration: 400,
          easing: "ease-out",
        }
      );
    }
    this.selectedItem = 0;
  }

  // Remove all items from nav list
  clearList() {
    while (this.navList.childElementCount > 0) {
      this.navList.removeChild(this.navList.lastElementChild);
    }
    this.itemsCounter = 0;
  }

  // Fill nav list with items from array (with removing previous items)
  updateList(arr, styleIn) {
    this.clearList();
    this.addList(arr, styleIn);
  }

  // Add single item to nav list
  addItem(obj) {
    const item = document.createElement("li");
    item.className = "nav-item";
    item.id = "nav-item-" + obj.id;
    item.dataset.id = obj.id;
    item.innerHTML = `<button class="nav-item-button" type="button" tabindex="-1">${
      obj.name
    }</button>
    <div class="nav-item-rating"><span class="rating-value">${this.getRating(
      obj
    )}</span><div class="rating-tooltip">${obj.rating.votes} votes</div>
    </div>`;
    this.navList.appendChild(item);

    item.querySelector(".nav-item-button").onclick = this.clickedDisplayRecipe;
    item.querySelector(".nav-item-rating").onmouseenter = this.showTooltip;
    item.querySelector(".nav-item-rating").onmouseleave = this.hideTooltip;

    this.itemsCounter++;
    this.selectedItem = this.itemsCounter - 1;
  }

  // Update item's name and rating on nav list
  updateItem(obj) {
    const item = document.getElementById("nav-item-" + obj.id);
    item.querySelector(".nav-item-button").textContent = obj.name;
    item.querySelector(".rating-value").textContent = this.getRating(obj);
    item.querySelector(".rating-tooltip").textContent =
      obj.rating.votes + " votes";
  }

  // Remove single item from nav list
  removeItem(obj) {
    const item = document.getElementById("nav-item-" + obj.id);
    item
      .animate(
        [
          { opacity: 1 },
          { opacity: 0, maxHeight: "50px", marginBottom: "20px" },
          { opacity: 0, maxHeight: "0px", marginBottom: "0px" },
        ],
        { duration: 400 }
      )
      .finished.then(() => {
        item.remove();
        this.itemsCounter--;
        this.selectedItem = 0;
      });
  }

  // ----------------------------------------------------------------
  // Managing interactions with tab key and focus
  // ----------------------------------------------------------------

  // Update elements' tab key index
  enableTab() {
    if (!wideWindow()) {
      this.setTabIndex("0");
      this.hideListButton.tabIndex = "-1";
      this.showListButton.tabIndex = "-1";
      // Setting selected item to itself will also change item's button's tabindex to 0.
      this.selectedItem = this.selectedItem;
    } else if (this.visible) {
      this.setTabIndex("0");
      this.showListButton.tabIndex = "-1";
      // Setting selected item to itself will also change item's button's tabindex to 0.
      this.selectedItem = this.selectedItem;
    } else {
      this.setTabIndex("-1");
      this.showListButton.tabIndex = "0";
    }
  }

  // Disable interaction with tab key
  disableTab() {
    this.setTabIndex("-1");
  }

  // Getter for selected item (for roving tabindex)
  get selectedItem() {
    return this._selectedItem;
  }

  // Setter for selected item (for roving tabindex)
  set selectedItem(i) {
    const buttons = Array.from(
      this.navList.querySelectorAll(".nav-item-button")
    );

    if (i >= 0 && i < buttons.length) {
      buttons.forEach((b) => {
        b.tabIndex = "-1";
      });
      buttons[i].tabIndex = "0";
      this._selectedItem = i;
    }
  }

  // Set tabindex for all interactive elements on component
  setTabIndex(tabIndex) {
    const buttons = this.nav.querySelectorAll("button");
    buttons.forEach((button) => {
      button.setAttribute("tabindex", tabIndex);
    });
  }

  focus() {
    if (!wideWindow()) {
      this.navList.focus();
    } else if (this.visible) {
      this.hideListButton.focus();
    } else {
      this.showListButton.focus();
    }
  }

  // ----------------------------------------------------------------
  // Event handlers
  // ----------------------------------------------------------------

  // Clicked add new recipe
  clickedAddRecipe() {
    this.openEditorCallback();
  }

  // Clicked recipe on a list
  clickedDisplayRecipe(event) {
    const id = parseInt(event.target.parentElement.dataset.id);
    this.displayRecipeCallback(id);
  }

  // Clicked reset list
  clickedResetList() {
    this.resetRecipesCallback();
  }

  // When mouse enters rating
  showTooltip(event) {
    const tooltip = event.target.querySelector(".rating-tooltip");
    const targetRect = event.target.getBoundingClientRect();
    tooltip.classList.add("visible");
    tooltip.style.left = targetRect.left - tooltip.clientWidth + 10 + "px";
    tooltip.style.top = targetRect.bottom - 25 + "px";
  }

  // When mouse leaves rating
  hideTooltip(event) {
    const tooltip = event.target.querySelector(".rating-tooltip");
    tooltip.classList.remove("visible");
  }

  // When pressed arrow on nav list
  keyDownOnNavList(e) {
    if (this.itemsCounter > 0) {
      if (e.code === KEY_LEFT || e.code === KEY_UP) {
        e.preventDefault();
        if (this.selectedItem <= 0) {
          this.selectedItem = this.itemsCounter - 1;
        } else {
          this.selectedItem--;
        }
        this.focusOnSelectedItem();
      } else if (e.code === KEY_RIGHT || e.code === KEY_DOWN) {
        e.preventDefault();
        if (this.selectedItem >= this.itemsCounter - 1) {
          this.selectedItem = 0;
        } else {
          this.selectedItem++;
        }
        this.focusOnSelectedItem();
      }
    }
  }

  // ----------------------------------------------------------------
  // Helper functions
  // ----------------------------------------------------------------

  // Return recipe's rating in format for displaying
  getRating(obj) {
    let rating;
    if (obj.rating.votes > 0)
      rating = (obj.rating.sum / obj.rating.votes).toFixed(1);
    else rating = "-";
    return rating;
  }

  focusOnSelectedItem() {
    Array.from(this.navList.querySelectorAll(".nav-item-button"))[
      this.selectedItem
    ].focus();
  }
}
