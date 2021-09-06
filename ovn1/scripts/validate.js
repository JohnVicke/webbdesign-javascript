const validateEmail = (field, email) => {
  if (!email)
    return {
      field,
      error: !email ? "Kan inte vara tom" : undefined,
    };

  const pattern =
    /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;

  return {
    field,
    error: !pattern.test(email) ? "Felaktig email-address" : undefined,
  };
};

const validateMessage = (message) => {
  return {
    field: "message",
    error: message.length > 200 ? "Message is too long" : undefined,
  };
};

const validatePresentationType = (type, title) => {
  const field = "pres_title";

  console.log(type, title);
  if (["lecture", "seminar"].includes(type) && !title) {
    return {
      field,
      error: "You must provide a title for 'föreläsning' or 'seminarium'",
      succes: false,
    };
  }
  return {
    field,
    success: true,
  };
};

const validateField = (field, value) => {
  return {
    field,
    error: !value ? "Kan inte vara tom" : undefined,
  };
};

const validateFormData = (formData) => {
  return [
    ({ pres_type, field_pres_title }) =>
      validatePresentationType(pres_type, field_pres_title),
    ({ field_message }) => validateMessage(field_message),
    ({ field_email }) => validateEmail("email", field_email),
    ({ field_firstname }) => validateField("firstname", field_firstname),
    ({ field_lastname }) => validateField("lastname", field_lastname),
    ({ field_organisation }) =>
      validateField("organisation", field_organisation),
  ].reduce((errorArr, validateFn) => {
    errorArr.push(validateFn(formData));
    return errorArr;
  }, []);
};

const getFormData = (form) => {
  const formData = new FormData(form);
  const parsedData = {};
  for (let pair of formData.entries()) {
    parsedData[pair[0]] = pair[1];
  }
  return parsedData;
};

const getIdFromFieldName = (field) => `#field_${field}`;

const createErrorElem = (field, textContent) => {
  const errorMessageElem = document.createElement("p");
  errorMessageElem.textContent = textContent;
  errorMessageElem.id = `error-message-${field}`;
  errorMessageElem.style.fontSize = "12px";
  errorMessageElem.style.fontWeight = "400";
  return errorMessageElem;
};

const displayUserFeedback = (errors) => {
  resetUserErrorFeedback();
  errors.forEach(({ field, error }) => {
    const id = getIdFromFieldName(field);
    const inputElem = document.querySelector(id);
    const labelElem = inputElem.parentNode;
    labelElem.style.color = "red";
    inputElem.style.color = "#000";
    labelElem.appendChild(createErrorElem(field, error));
  });
};

const getErrorElement = () => document.querySelector("[id^=error-message-]");

const resetUserErrorFeedback = () => {
  let elem = getErrorElement();
  while (elem) {
    const labelElem = document.querySelector(
      getIdFromFieldName(elem.id.replace("error-message-", ""))
    ).parentElement;
    labelElem.style.color = "#000";
    elem.remove();
    elem = getErrorElement();
  }
};

const form = document.getElementById("registration_form");

const handleSubmit = (event) => {
  const formData = getFormData(form);
  const validationResults = validateFormData(formData);
  const errors = validationResults.filter((result) => !!result.error);
  if (errors) {
    event.preventDefault();
    displayUserFeedback(errors);
  }
};

form.addEventListener("submit", handleSubmit);
