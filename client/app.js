// Declaring and selecting html elements

const personCardsContainer = document.querySelector(".side-content");
const firstName = document.querySelector("#fname");
const firstNameEdited = document.querySelector("#fname-edit");
const lastNameEdited = document.querySelector("#lname-edit");
const addressEdited = document.querySelector("#address-edit");
const zipEdited = document.querySelector("#zip-edit");
const cityEdited = document.querySelector("#city-edit");
const countryEdited = document.querySelector("#country-edit");
const genderEdited = document.querySelector("#gender-edit");
const ageEdited = document.querySelector("#age-edit");
const lastName = document.querySelector("#lname");
const address = document.querySelector("#address");
const zipCode = document.querySelector("#zip");
const zipCodeEdited = document.querySelector("#zip-edit");
const city = document.querySelector("#city");
const country = document.querySelector("#country");
const gender = document.querySelector("#gender");
const age = document.querySelector("#age");
const radioButtons = document.querySelectorAll(".form-to-add input[type=radio");
const editRadioButtons = document.querySelectorAll(
  ".form-to-edit input[type=radio"
);
const practicedSports = document.querySelectorAll(
  ".form-to-add input[type=checkbox]"
);
const editedPracticedSports = document.querySelectorAll(
  ".form-to-edit input[type=checkbox]"
);
const errorText = document.querySelector(".error-text");
const addFormElement = document.querySelector(".form-to-add");
const editFormElement = document.querySelector(".form-to-edit");
const deleteItem = document.querySelector(".delete");
const updateButton = document.querySelector(".update");
const saveButton = document.querySelector(".save");
const addItem = document.querySelector(".add-member");
const editItem = document.querySelector(".edit-member");

let persons = [];
let idToBeEdited;
let isLoading = false;

// Show users data after DOMContent is loaded
window.addEventListener("DOMContentLoaded", () => {
  getUsersData();
});
// Getting data from server and use this for creating cards
const getUsersData = () => {
  isLoading = true;
  showLoading(personCardsContainer);
  axios
    .get("http://localhost:3000/users")
    .then(function (response) {
      // handle success
      persons = response.data;
      createPersonCards(persons);
      isLoading = false;
    })
    .catch(function (error) {
      // handle error
      isLoading = false;
      showToast(
        "error",
        "Cannot get data from the server",
        "top-start",
        "#DD482D"
      );
      console.log(error);
    });
};

// Create person cards on the UI
const createPersonCards = (persons) => {
  personCardsContainer.innerHTML = "";

  persons.map((person) => {
    const personCard = document.createElement("div");
    personCard.setAttribute("class", "person");
    personCardsContainer.append(personCard);

    personCard.innerHTML = `
        <div class="initial">
        <div class="avatar">${person.firstName.charAt(0)}</div>
          <h1></h1>
        </div>
        <div class="details">
          <h3 class="details-name">${person.firstName} ${person.lastName}</h3>
          <p class="details-id">ID: <span>${person.id}</span></p>
          <p class="details-email">${person.firstName}.${
      person.lastName
    }@gmail.com</p>
          <div class="person-card-buttons">
            <button class="edit">Edit</button>
            <button class="delete">DELETE</button>
          </div>
        </div>
        `;
  });

  addEditPersonEventListener();
  addDeletePersonEventListener();
};
// Show loading while waiting data
const showLoading = (parent) => {
  const loadingParentElement = document.createElement("div");
  loadingParentElement.classList.add("lds-dual-ring");
  loadingParentElement.style.minWidth = "400px";
  const loadingEl = document.createElement("p");
  loadingEl.innerText = "Loading data...";
  if (isLoading) {
    loadingParentElement.append(loadingEl);
    parent.append(loadingParentElement);
  }
};
// Event listener for deleting information
const addDeletePersonEventListener = () => {
  const deleteBtn = document.querySelectorAll(".delete");
  deleteBtn.forEach((button, i) => {
    button.addEventListener("click", () => {
      const cardParent = button.parentElement.parentElement.parentElement;
      const personFullName = cardParent.querySelector(".details-name");
      const personId = cardParent.querySelector(".details-id span").innerText;

      Swal.fire({
        title: `Are you sure you want to delete member ${personFullName.innerText}`,
        confirmButtonText: "Yes",
        confirmButtonColor: "#3b95d7",
        showDenyButton: true,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Saved!", "", "success");
          deletePersonData(personId);
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    });
  });
};
// Event listener for edit the information
const addEditPersonEventListener = () => {
  const edit = document.querySelectorAll(".edit");
  edit.forEach((button, i) =>
    button.addEventListener("click", () => {
      editMemberOnSmallScreen();
      const cardParent = button.parentElement.parentElement;
      const personId = cardParent.querySelector(".details-id span").innerText;
      const editedPerson = persons.find((user) => user.id === personId);
      updateEditedFields(editedPerson);
      idToBeEdited = personId;
    })
  );
};

//Toggle disable form button while data is sent
const toggleDisableFormButton = (button, isDisabled, text) => {
  button.disabled = isDisabled;
  button.innerText = text;
};

const updateEditedFields = (personData) => {
  firstNameEdited.value = personData.firstName;
  lastNameEdited.value = personData.lastName;
  addressEdited.value = personData.address.city;
  zipEdited.value = personData.address.postalCode;
  cityEdited.value = personData.address.city;
  countryEdited.value = personData.address.country;
  updateGenderDropdown(personData.gender);
  updateActivityClassRadio(personData.activity_class);
  updateSportsClassCheckboxes(personData.sports);
  ageEdited.value = personData.age.toString();
};

const updateActivityClassRadio = (checkedValue) => {
  editRadioButtons.forEach((button) => {
    if (button.value === checkedValue) {
      button.checked = true;
    }
  });
};

const updateSportsClassCheckboxes = (checkedValueArr) => {
  editedPracticedSports.forEach((item) => {
    item.checked = false;
    if (checkedValueArr.includes(item.value)) {
      item.checked = true;
    }
  });
};

const updateGenderDropdown = (gender) => {
  const options = Array.from(genderEdited.options);
  options.forEach((option) => {
    if (option.value === gender) {
      option.selected = true;
    }
  });
};

const getCheckedActivityClass = () => {
  let arr = Array.from(radioButtons);
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].checked === true) {
      return arr[i].value;
    }
  }
};

const getEditedActivityClass = () => {
  for (let i = 0; i < editRadioButtons.length; i++) {
    if (editRadioButtons[i].checked) {
      return editRadioButtons[i].value;
    }
  }
};

const getCheckedSports = () => {
  let sportsChecked = [];
  for (let i = 0; i < practicedSports.length; i++) {
    if (practicedSports[i].checked) {
      sportsChecked.push(practicedSports[i].value);
    }
  }
  return sportsChecked;
};

const getEditedCheckedSports = () => {
  let sportsChecked = [];
  for (let i = 0; i < editedPracticedSports.length; i++) {
    if (editedPracticedSports[i].checked) {
      sportsChecked.push(editedPracticedSports[i].value);
    }
  }
  return sportsChecked;
};

const showError = (input, errorMessage) => {
  const formField = input.parentElement;
  input.classList.add("error");
  const small = formField.querySelector("small");
  small.textContent = errorMessage;
};

const showSucces = (input) => {
  const formField = input.parentElement;
  input.classList.remove("error");
  const small = formField.querySelector("small");
  small.textContent = "";
};
// Toggle error class and text on form fields
const validateForm = () => {
  if (!firstName.value.trim()) {
    showError(firstName, "First name is required");
  } else {
    showSucces(firstName);
  }

  if (!lastName.value.trim()) {
    showError(lastName, "Last name is required");
  } else {
    showSucces(lastName);
  }

  if (!address.value.trim()) {
    showError(address, "Address is required");
  } else {
    showSucces(address);
  }
  if (!city.value.trim()) {
    showError(city, "City is required");
  } else {
    showSucces(city);
  }
  if (!country.value.trim()) {
    showError(country, "Country is required");
  } else {
    showSucces(country);
  }
  if (!age.value.trim()) {
    showError(age, "Age is required");
  } else {
    showSucces(age);
  }
  if (!gender.value.trim()) {
    showError(gender, "Gender is required");
  } else {
    showSucces(gender);
  }

  return true;
};
// Toggle error class and text on form fields
const validateFormEdited = () => {
  if (!firstNameEdited.value.trim()) {
    showError(firstNameEdited, "First name is required");
  } else {
    showSucces(firstNameEdited);
  }

  if (!lastNameEdited.value.trim()) {
    showError(lastNameEdited, "Last name is required");
  } else {
    showSucces(lastNameEdited);
  }

  if (!addressEdited.value.trim()) {
    showError(addressEdited, "Address is required");
  } else {
    showSucces(addressEdited);
  }
  if (!cityEdited.value.trim()) {
    showError(cityEdited, "City is required");
  } else {
    showSucces(cityEdited);
  }
  if (!countryEdited.value.trim()) {
    showError(countryEdited, "Country is required");
  } else {
    showSucces(countryEdited);
  }
  if (!ageEdited.value.trim()) {
    showError(ageEdited, "Age is required");
  } else {
    showSucces(ageEdited);
  }
  if (!genderEdited.value.trim()) {
    showError(genderEdited, "Gender is required");
  } else {
    showSucces(genderEdited);
  }

  return true;
};
// Post data to server
const createPerson = () => {
  toggleDisableFormButton(saveButton, true, "Saving...");
  axios
    .post("http://localhost:3000/users", {
      firstName: firstName.value,
      lastName: lastName.value,
      address: {
        streetAndNumber: address.value,
        postalCode: zipCode.value,
        city: city.value,
        country: country.value,
      },
      sports: getCheckedSports(),
      gender: gender.value,
      age: Number(age.value),
      activity_class: getCheckedActivityClass(),
    })
    .then(function (response) {
      toggleDisableFormButton(saveButton, false, "Save");
      resetAddFormFields();
      showToast("success", "User saved succesfully.", "top-end", "#48B791");
      getUsersData();
    })
    .catch(function (error) {
      toggleDisableFormButton(saveButton, false, "Save");
      resetAddFormFields();
      showToast("error", "Error while saving member", "top-end", "#DD482D");
    });
};

const resetFormField = (inputType) => {
  for (let i = 0; i < inputType.length; i++) {
    inputType[i].checked = false;
  }
};

const showToast = (icon, title, position, bgColor) => {
  const Toast = Swal.mixin({
    toast: true,
    position: position,
    showConfirmButton: false,
    timer: 5000,
    background: bgColor,
    color: "white",
    iconColor: "white",
  });

  Toast.fire({
    icon: icon,
    title: title,
  });
};

const resetAddFormFields = () => {
  firstName.value = "";
  lastName.value = "";
  address.value = "";
  country.value = "";
  age.value = "";
  city.value = "";
  gender.value = "";
  zipCode.value = "";
  resetFormField(radioButtons);
  resetFormField(practicedSports);
  practicedSports.value = "";
};

addFormElement.addEventListener("submit", (e) => {
  e.preventDefault();

  let isFormValid =
    !!firstName.value &&
    !!lastName.value &&
    !!address.value &&
    !!country.value &&
    !!age.value &&
    !!city.value &&
    !!gender.value;

  validateForm();
  if (isFormValid) {
    createPerson();
  }
});

const editMemberOnSmallScreen = () => {
  const mediaQuery = window.matchMedia("(max-width: 1024px)");
  // Check if the media query is true
  if (mediaQuery.matches) {
    addItem.style.display = "none";
    editItem.style.display = "block";
  }
};

const updatePersonData = (id) => {
  if (!id) {
    showToast(
      "error",
      "This person does not exist in our database!",
      "top-end",
      "#DD482D"
    );
    return;
  }

  toggleDisableFormButton(updateButton, true, "Updating...");
  axios
    .put(`http://localhost:3000/users/${id}`, {
      id: id,
      firstName: firstNameEdited.value,
      lastName: lastNameEdited.value,
      address: {
        streetAndNumber: addressEdited.value,
        postalCode: zipEdited.value,
        city: cityEdited.value,
        country: countryEdited.value,
      },
      sports: getEditedCheckedSports(),
      gender: genderEdited.value,
      age: ageEdited.value,
      activity_class: getEditedActivityClass(),
    })
    .then(function (response) {
      toggleDisableFormButton(updateButton, false, "Update");
      resetEditedFormFields();
      showToast("success", "User updated succesfully.", "top-end", "#48B791");
      const smallMediaQuery = window.matchMedia("(max-width:1024px");
      if (smallMediaQuery.matches) {
        addItem.style.display = "block";
        editItem.style.display = "none";
      }
      // handle success
      getUsersData();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      toggleDisableFormButton(updateButton, false, "Update");
      resetEditedFormFields();
      showToast("error", "Error while updating member", "top-end", "#DD482D");
    });
};

const deletePersonData = (id) => {
  axios
    .delete(`http://localhost:3000/users/${id}`)
    .then(function (response) {
      // handle success
      showToast("success", "User deleted succesfully.", "top-end", "#48B791");
      getUsersData();
    })
    .catch(function (error) {
      // handle error
      showToast("error", "Error while deleting member", "top-end", "#DD482D");
      console.log(error);
    });
};

const resetEditedFormFields = () => {
  firstNameEdited.value = "";
  lastNameEdited.value = "";
  addressEdited.value = "";
  countryEdited.value = "";
  ageEdited.value = "";
  cityEdited.value = "";
  genderEdited.value = "";
  zipCodeEdited.value = "";
  resetFormField(editRadioButtons);
  resetFormField(editedPracticedSports);
};

updateButton.addEventListener("click", (e) => {
  e.preventDefault();
  const mediaQuery = window.matchMedia("(min-width: 1026px)");
  if (mediaQuery.matches) {
    addItem.style.display = "block";
    editItem.style.display = "block";
  }

  let isFormValid =
    !!firstNameEdited.value &&
    !!lastNameEdited.value &&
    !!addressEdited.value &&
    !!countryEdited.value &&
    !!ageEdited.value &&
    !!cityEdited.value &&
    !!genderEdited.value;

  validateFormEdited();

  if (isFormValid) {
    updatePersonData(idToBeEdited);
  }
});

// Chek if the screen is less than 1024px
const mediaQuery = "(max-width: 1024px)";
const mediaQueryList = window.matchMedia(mediaQuery);

mediaQueryList.addEventListener("change", (event) => {
  if (event.matches) {
    addItem.style.display = "block";
    editItem.style.display = "none";
  } else {
    editItem.style.display = "block";
    addItem.style.display = "block";
  }
});
