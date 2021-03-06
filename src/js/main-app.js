class MainApp {
  constructor(arr) {
    this.deleteRecipe = this.deleteRecipe.bind(this);
    this.saveRecipe = this.saveRecipe.bind(this);
    this.resetRecipes = this.resetRecipes.bind(this);
    this.displayRecipe = this.displayRecipe.bind(this);
    this.openEditor = this.openEditor.bind(this);
    this.openDelete = this.openDelete.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.windowResized = this.windowResized.bind(this);
    this.updateTabIndex = this.updateTabIndex.bind(this);
    this.startingArrayString = JSON.stringify(arr);
    this.storage = window.localStorage;
    const storedArr = this.storage.getItem("recipes");
    if (storedArr === null) {
      // no data in local storate
      this.arr = JSON.parse(this.startingArrayString);
      this.saveRecipesToLocalMemory();
    } else {
      // data in local storage
      this.arr = JSON.parse(storedArr);
    }

    this.nav = new Nav(
      this.arr,
      this.displayRecipe,
      this.openEditor,
      this.resetRecipes,
      this.updateTabIndex
    );

    this.recipeWindow = new RecipeWindow(
      this.openEditor,
      this.openDelete,
      this.saveRecipe,
      this.updateTabIndex
    );

    this.editPopup = new EditPopup(this.saveRecipe, this.updateTabIndex);

    this.deletePopup = new DeletePopup(this.deleteRecipe, this.updateTabIndex);

    this.message = new Message();

    document.addEventListener("keydown", this.keyPressed);

    this.resizeTimeout = undefined;
    window.addEventListener("resize", this.windowResized);
  }

  addRecipe(obj) {
    this.arr.push(obj);
    this.saveRecipesToLocalMemory();
    this.nav.addItem(obj);
    this.recipeWindow.open(obj, "slide", "slide");
    this.message.displayMessage("Recipe added!");
  }

  deleteRecipe(obj) {
    this.arr = this.arr.filter((item) => item !== obj);
    this.saveRecipesToLocalMemory();
    this.recipeWindow.close("fade");
    this.nav.removeItem(obj);
    this.message.displayMessage("Recipe removed!");
  }

  saveRecipe(obj) {
    // recipe doesn't have id so its new
    if (!obj.hasOwnProperty("id")) {
      obj.id = this.arr.length > 0 ? this.arr[this.arr.length - 1].id + 1 : 0;
      this.addRecipe(obj);
    }
    // recipe has id so it exists
    else {
      const index = this.arr.findIndex((item) => item.id === obj.id);
      this.arr[index] = obj;
      this.saveRecipesToLocalMemory();
      this.nav.updateItem(obj);
      this.recipeWindow.open(obj, "no", "fade");
      this.message.displayMessage("Recipe saved!");
    }
  }

  saveRecipesToLocalMemory() {
    this.storage.setItem("recipes", JSON.stringify(this.arr));
  }

  resetRecipes() {
    this.recipeWindow.close("fade");
    this.arr = JSON.parse(this.startingArrayString);
    this.saveRecipesToLocalMemory();
    this.nav.updateList(this.arr, "fade");
  }

  displayRecipe(id) {
    const obj = this.arr.find((item) => item.id === id);
    this.recipeWindow.open(obj, "slide", "slide");
  }

  openEditor(obj) {
    this.editPopup.open(obj);
  }

  openDelete(obj) {
    this.deletePopup.open(obj);
  }

  keyPressed(event) {
    if ((event.code === KEY_ESCAPE) & !this.recipeWindow.changing) {
      if (this.editPopup.visible) {
        event.preventDefault();
        this.editPopup.close();
      } else if (this.deletePopup.visible) {
        event.preventDefault();
        this.deletePopup.close();
      } else if (this.recipeWindow.visible) {
        event.preventDefault();
        this.recipeWindow.close("slide");
      } else if (this.nav.visible && wideWindow()) {
        event.preventDefault();
        this.nav.hide();
      }
    }
  }

  windowResized() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(this.updateTabIndex, 100);
  }

  // manage tabs for entire application here
  // checks what is visible and update tabindex
  updateTabIndex() {
    // we don't control manually tabs for popups
    if (this.editPopup.visible || this.deletePopup.visible) {
      // if popup is visible disable anything else
      this.nav.disableTab();
      this.recipeWindow.disableTab();
      if (this.editPopup.visible) {
        this.editPopup.focus();
      } else {
        this.deletePopup.focus();
      }
    } else if (this.recipeWindow.visible) {
      // otherwise if recipe window is visible, enable it
      this.recipeWindow.enableTab();
      this.recipeWindow.focus();
      // and set nav depending on screen width
      if (wideWindow()) {
        this.nav.enableTab();
      } else {
        this.nav.disableTab();
      }
    } else {
      // otherwise disable recipe window
      this.recipeWindow.disableTab();
      this.nav.enableTab();
      this.nav.focus();
    }
  }
}
