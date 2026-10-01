/* =========================================================
   JOLA GIFTING
   SHARED FRONTEND LOGIC
   HOME + ABOUT + CONTACT
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const CONSULTATION_API_URL =
  "https://api.jolagifting.com/api/consultations";

const CONTACT_API_URL =
  "https://api.jolagifting.com/api/contact";

const CALENDLY_URL =
  "https://calendly.com/jolagifting-jolagifting/30min";

const WHATSAPP_NUMBER =
  "2349039476798";


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));


/* =========================================================
   GENERAL HELPERS
========================================================= */

function getValue(id) {
  const element = document.getElementById(id);

  return element
    ? element.value.trim()
    : "";
}


function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* =========================================================
   PAGE DETECTION
========================================================= */

function isHomePage() {
  return (
    document.body.classList.contains("home-page") ||
    window.location.pathname.endsWith("/") ||
    window.location.pathname.endsWith("index.html")
  );
}


function isAboutPage() {
  return (
    document.body.classList.contains("about-page") ||
    window.location.pathname.endsWith("about.html")
  );
}


function isContactPage() {
  return (
    document.body.classList.contains("contact-page") ||
    window.location.pathname.endsWith("contact.html")
  );
}


/* =========================================================
   HOME — CONSULTATION FORM
========================================================= */

function initConsultation() {
  const form = document.getElementById("consultationForm");

  if (!form) {
    return;
  }

  const formSteps = document.querySelectorAll(".form-step");

  const progressBar =
    document.getElementById("progressBar");

  const stepLabel =
    document.getElementById("stepLabel");

  const stepTitle =
    document.getElementById("stepTitle");

  const successState =
    document.getElementById("successState");

  const submitButton =
    document.getElementById("submitButton");

  const calendlyButton =
    document.getElementById("calendlyButton");

  const whatsappButton =
    document.getElementById("whatsappButton");

  const nextButtons =
    document.querySelectorAll(".next-button");

  const backButtons =
    document.querySelectorAll(".back-button");

  /* =========================================
     STEP 3 ELEMENTS
  ========================================= */

  const giftChoiceInputs =
    document.querySelectorAll(
      'input[name="giftChoice"]'
    );

  const giftTypeInputs =
    document.querySelectorAll(
      'input[name="giftType"]'
    );

  const giftOptionsBox =
    document.getElementById("giftOptionsBox");

  const helpDetailsBox =
    document.getElementById("helpDetailsBox");

  const otherGiftCheckbox =
    document.getElementById("giftTypeOther");

  const otherGiftBox =
    document.getElementById("otherGiftBox");

  const otherGiftIdea =
    document.getElementById("otherGiftIdea");

  const helpDetails =
    document.getElementById("helpDetails");


  let currentStep = 1;
  let hasGiftInMind = null;


  const stepTitles = {
    1: "About You",
    2: "About The Moment",
    3: "Gift Idea",
    4: "Final Details"
  };


  /* =========================================
     ERRORS
  ========================================= */

  function clearErrors() {
    document
      .querySelectorAll(".field-error")
      .forEach((error) => {
        error.textContent = "";
      });

    document
      .querySelectorAll(
        ".field input, .field textarea, .field select"
      )
      .forEach((input) => {
        input.style.borderColor = "";
      });
  }


  function showError(input, message) {
    if (!input) {
      return;
    }

    const field =
      input.closest(".field");

    if (!field) {
      return;
    }

    const error =
      field.querySelector(".field-error");

    if (error) {
      error.textContent = message;
    }

    input.style.borderColor =
      "#a33b3b";
  }


  /* =========================================
     PROGRESS
  ========================================= */

  function updateProgress() {
    const percentage =
      (currentStep / 4) * 100;

    if (progressBar) {
      progressBar.style.width =
        `${percentage}%`;
    }

    if (stepLabel) {
      stepLabel.textContent =
        `Step ${currentStep} of 4`;
    }

    if (stepTitle) {
      stepTitle.textContent =
        stepTitles[currentStep] || "";
    }
  }


  /* =========================================
     SHOW STEP
  ========================================= */

  function showStep(step) {
    currentStep = Math.min(
      Math.max(step, 1),
      4
    );

    formSteps.forEach((stepElement) => {
      const number =
        Number(stepElement.dataset.step);

      stepElement.classList.toggle(
        "active",
        number === currentStep
      );
    });

    updateProgress();
    clearErrors();

    const card =
      document.querySelector(
        ".consultation-card"
      );

    if (card) {
      const top =
        card.getBoundingClientRect().top +
        window.scrollY -
        100;

      window.scrollTo({
        top: Math.max(top, 0),
        behavior: "smooth"
      });
    }
  }


  /* =========================================
     SHOW GIFT OPTIONS
  ========================================= */

  function showGiftOptions() {
    hasGiftInMind = true;


    /*
      Keep the GIFT OPTIONS visible.
      We use both the class and inline styles
      so an old CSS rule cannot accidentally
      leave the box invisible.
    */

    if (giftOptionsBox) {
      giftOptionsBox.classList.add("active");

      giftOptionsBox.style.display = "block";
      giftOptionsBox.style.visibility = "visible";
      giftOptionsBox.style.opacity = "1";
      giftOptionsBox.style.height = "auto";
      giftOptionsBox.style.overflow = "visible";
    }


    if (helpDetailsBox) {
      helpDetailsBox.classList.remove("active");

      helpDetailsBox.style.display = "none";
    }
  }


  /* =========================================
     SHOW HELP BOX
  ========================================= */

  function showHelpBox() {
    hasGiftInMind = false;


    if (giftOptionsBox) {
      giftOptionsBox.classList.remove("active");

      giftOptionsBox.style.display = "none";
    }


    if (helpDetailsBox) {
      helpDetailsBox.classList.add("active");

      helpDetailsBox.style.display = "block";
      helpDetailsBox.style.visibility = "visible";
      helpDetailsBox.style.opacity = "1";
      helpDetailsBox.style.height = "auto";
      helpDetailsBox.style.overflow = "visible";
    }


    /*
      Clear gift selections when user switches
      from "Yes" to "Not yet".
    */

    giftTypeInputs.forEach((checkbox) => {
      checkbox.checked = false;
    });


    if (otherGiftBox) {
      otherGiftBox.classList.remove("active");
      otherGiftBox.style.display = "none";
    }


    if (otherGiftIdea) {
      otherGiftIdea.value = "";
    }
  }


  /* =========================================
     RADIO: YES / NOT YET
  ========================================= */

  giftChoiceInputs.forEach((input) => {
    input.addEventListener("change", () => {

      if (input.value === "yes") {
        showGiftOptions();
      }

      if (input.value === "no") {
        showHelpBox();
      }

    });
  });


  /* =========================================
     MULTI-SELECT GIFT CHECKBOXES

     IMPORTANT:
     We DO NOT uncheck other boxes.

     User can select:
     Perfume
     + Flowers
     + Jewelry
     + Watch

     at the same time.
  ========================================= */

  giftTypeInputs.forEach((checkbox) => {

    checkbox.addEventListener(
      "change",
      () => {

        /*
          Add a selected class to the whole
          option so the UI can style it.
        */

        const option =
          checkbox.closest(
            ".gift-option-item"
          );

        if (option) {
          option.classList.toggle(
            "selected",
            checkbox.checked
          );
        }


        /*
          Only "Other" controls the
          Other text box.
        */

        if (
          checkbox.id === "giftTypeOther"
        ) {

          if (
            checkbox.checked
          ) {

            if (otherGiftBox) {
              otherGiftBox.classList.add(
                "active"
              );

              otherGiftBox.style.display =
                "block";

              otherGiftBox.style.visibility =
                "visible";

              otherGiftBox.style.opacity =
                "1";
            }

          } else {

            if (otherGiftBox) {
              otherGiftBox.classList.remove(
                "active"
              );

              otherGiftBox.style.display =
                "none";
            }

            if (otherGiftIdea) {
              otherGiftIdea.value = "";
            }
          }
        }

      }
    );

  });


  /* =========================================
     VALIDATE STEP
  ========================================= */

  function validateStep(step) {

    clearErrors();

    let valid = true;


    /* STEP 1 */

    if (step === 1) {

      const fullName =
        document.getElementById(
          "fullName"
        );

      const email =
        document.getElementById(
          "email"
        );

      const phone =
        document.getElementById(
          "phone"
        );


      if (
        !fullName ||
        !fullName.value.trim()
      ) {

        showError(
          fullName,
          "Please enter your full name."
        );

        valid = false;
      }


      if (
        !email ||
        !email.value.trim()
      ) {

        showError(
          email,
          "Please enter your email address."
        );

        valid = false;

      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email.value.trim()
        )
      ) {

        showError(
          email,
          "Please enter a valid email address."
        );

        valid = false;
      }


      if (
        !phone ||
        !phone.value.trim()
      ) {

        showError(
          phone,
          "Please enter your WhatsApp number."
        );

        valid = false;
      }
    }


    /* STEP 2 */

    if (step === 2) {

      const recipientName =
        document.getElementById(
          "recipientName"
        );

      const occasion =
        document.getElementById(
          "occasion"
        );


      if (
        !recipientName ||
        !recipientName.value.trim()
      ) {

        showError(
          recipientName,
          "Please tell us who the gift is for."
        );

        valid = false;
      }


      if (
        !occasion ||
        !occasion.value
      ) {

        showError(
          occasion,
          "Please select an occasion."
        );

        valid = false;
      }
    }


    /* STEP 3 */

    if (step === 3) {

      const selectedChoice =
        document.querySelector(
          'input[name="giftChoice"]:checked'
        );


      if (!selectedChoice) {

        alert(
          "Please choose whether you already have a gift in mind."
        );

        return false;
      }


      /* YES */

      if (
        selectedChoice.value === "yes"
      ) {

        const selectedGiftTypes =
          document.querySelectorAll(
            'input[name="giftType"]:checked'
          );


        if (
          selectedGiftTypes.length === 0
        ) {

          alert(
            "Please select at least one gift type."
          );

          return false;
        }


        /*
          If Other was selected, require
          its explanation.
        */

        if (
          otherGiftCheckbox &&
          otherGiftCheckbox.checked
        ) {

          if (
            !otherGiftIdea ||
            !otherGiftIdea.value.trim()
          ) {

            alert(
              "Please tell us what other gift you have in mind."
            );

            otherGiftIdea?.focus();

            return false;
          }
        }
      }


      /* NOT YET */

      if (
        selectedChoice.value === "no"
      ) {

        /*
          No gift type is required here.
          The person can simply describe
          the recipient.
        */

        hasGiftInMind = false;
      }
    }


    return valid;
  }


  /* =========================================
     NEXT BUTTONS
  ========================================= */

  nextButtons.forEach((button) => {

    button.type = "button";

    button.addEventListener(
      "click",
      (event) => {

        event.preventDefault();


        if (
          !validateStep(
            currentStep
          )
        ) {
          return;
        }


        if (
          currentStep < 4
        ) {

          showStep(
            currentStep + 1
          );
        }

      }
    );

  });


  /* =========================================
     BACK BUTTONS
  ========================================= */

  backButtons.forEach((button) => {

    button.type = "button";

    button.addEventListener(
      "click",
      (event) => {

        event.preventDefault();


        if (
          currentStep > 1
        ) {

          showStep(
            currentStep - 1
          );
        }

      }
    );

  });


  /* =========================================
     SUBMIT CONSULTATION
  ========================================= */

  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      if (
        !validateStep(4)
      ) {
        return;
      }


      const selectedChoice =
        document.querySelector(
          'input[name="giftChoice"]:checked'
        );


      if (!selectedChoice) {

        alert(
          "Please select your gift preference."
        );

        showStep(3);

        return;
      }


      hasGiftInMind =
        selectedChoice.value === "yes";


      if (!submitButton) {
        return;
      }


      const originalButton =
        submitButton.innerHTML;


      submitButton.disabled =
        true;

      submitButton.innerHTML =
        "Sending...";


      /* =====================================
         COLLECT BASIC INFORMATION
      ===================================== */

      const fullName =
        getValue("fullName");

      const email =
        getValue("email");

      const phone =
        getValue("phone");

      const recipientName =
        getValue("recipientName");

      const occasion =
        getValue("occasion");

      const budget =
        getValue("budget");

      const notes =
        getValue("notes");

      const helpText =
        getValue("helpDetails");

      const otherText =
        getValue("otherGiftIdea");


      /* =====================================
         COLLECT MULTIPLE GIFT TYPES
      ===================================== */

      const selectedGiftTypes =
        Array.from(
          document.querySelectorAll(
            'input[name="giftType"]:checked'
          )
        ).map(
          (checkbox) =>
            checkbox.value
        );


      /*
        Example result:

        [
          "Perfume",
          "Flowers",
          "Jewelry"
        ]
      */

      let giftIdea =
        selectedGiftTypes.join(
          ", "
        );


      if (
        otherGiftCheckbox &&
        otherGiftCheckbox.checked &&
        otherText
      ) {

        giftIdea =
          giftIdea
            ? `${giftIdea}\nOther: ${otherText}`
            : `Other: ${otherText}`;
      }


      /* =====================================
         FINAL NOTES
      ===================================== */

      let finalNotes =
        notes;


      if (
        !hasGiftInMind &&
        helpText
      ) {

        const recipientPreferences =
          `Recipient details/preferences: ${helpText}`;


        finalNotes =
          finalNotes
            ? `${recipientPreferences}\n\nAdditional notes: ${finalNotes}`
            : recipientPreferences;
      }


      /* =====================================
         PAYLOAD
      ===================================== */

      const consultationData = {

        fullName,

        email,

        phone,

        recipientName,

        occasion,

        hasGiftInMind,

        giftIdea,

        budget,

        notes:
          finalNotes

      };


      console.log(
        "JOLA CONSULTATION DATA:",
        consultationData
      );


      /* =====================================
         SEND TO BACKEND
      ===================================== */

      try {

        const response =
          await fetch(
            "https://api.jolagifting.com/api/consultations",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                "Accept":
                  "application/json"
              },

              body:
                JSON.stringify(
                  consultationData
                )
            }
          );


        let data = {};


        try {
          data =
            await response.json();
        } catch {
          data = {};
        }


        if (
          !response.ok
        ) {

          throw new Error(
            data.message ||
            `Request failed with status ${response.status}`
          );
        }


        /* ===================================
           SUCCESS
        =================================== */

        form.style.display =
          "none";


        const progress =
          document.querySelector(
            ".form-progress"
          );


        if (progress) {
          progress.style.display =
            "none";
        }


        if (successState) {
          successState.classList.add(
            "active"
          );
        }


        if (calendlyButton) {
          calendlyButton.href =
            CALENDLY_URL;
        }


        if (whatsappButton) {

          const whatsappMessage =
            createWhatsAppMessage(
              fullName,
              consultationData
            );


          whatsappButton.href =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              whatsappMessage
            )}`;
        }


      } catch (error) {

        console.error(
          "JOLA CONSULTATION ERROR:",
          error
        );


        alert(
          error.message ||
          "We couldn't submit your request right now."
        );


        submitButton.disabled =
          false;

        submitButton.innerHTML =
          originalButton;
      }

    }
  );


  /* =========================================
     START
  ========================================= */

  showStep(1);
}


/* =========================================================
   CONSULTATION SUCCESS
========================================================= */

function showConsultationSuccess(
  fullName,
  consultationData,
  elements
) {

  const {
    form,
    successState,
    calendlyButton,
    whatsappButton
  } = elements;


  if (form) {
    form.style.display =
      "none";
  }


  const progress =
    $(".form-progress");


  if (progress) {
    progress.style.display =
      "none";
  }


  if (successState) {
    successState.classList.add(
      "active"
    );
  }


  if (calendlyButton) {
    calendlyButton.href =
      CALENDLY_URL;
  }


  if (whatsappButton) {

    const message =
      createWhatsAppMessage(
        fullName,
        consultationData
      );


    whatsappButton.href =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
      )}`;
  }
}


/* =========================================================
   WHATSAPP MESSAGE
========================================================= */

function createWhatsAppMessage(
  fullName,
  data
) {

  const giftStatus =
    data.hasGiftInMind
      ? "I already have a gift idea in mind."
      : "I would love some help choosing the gift.";


  let message =
    `Hi Jola! 👋\n\n` +
    `My name is ${fullName}. ` +
    `I'd love to create a special gift for ` +
    `${data.recipientName} ` +
    `for their ${data.occasion}.\n\n` +
    `${giftStatus}`;


  if (data.giftIdea) {

    message +=
      `\n\nGift idea:\n${data.giftIdea}`;
  }


  if (data.budget) {

    message +=
      `\n\nEstimated budget: ${data.budget}`;
  }


  if (data.notes) {

    message +=
      `\n\nAdditional details:\n${data.notes}`;
  }


  message +=
    "\n\nI'd love to discuss it with you. Thank you! ❤️";


  return message;
}


/* =========================================================
   HERO VIDEO + TYPING MESSAGE
   HOME PAGE
========================================================= */

function initGiftVideo() {

  const video =
    document.getElementById(
      "giftVideo"
    );


  const typingMessage =
    document.getElementById(
      "typingMessage"
    );


  const typingCursor =
    document.getElementById(
      "typingCursor"
    );


  const giftBranding =
    document.getElementById(
      "giftBranding"
    );


  if (
    !video ||
    !typingMessage
  ) {
    return;
  }


  const text =
    "FOR EVERY MOMENT, THERE IS A GIFT FOR IT.";


  let timer = null;

  let started = false;


  function reset() {

    if (timer) {

      clearInterval(
        timer
      );

      timer = null;
    }


    typingMessage.textContent =
      "";


    if (typingCursor) {
      typingCursor.style.display =
        "inline-block";
    }


    if (giftBranding) {
      giftBranding.classList.remove(
        "visible"
      );
    }


    started = false;
  }


  function startTyping() {

    if (started) {
      return;
    }


    started = true;


    let index = 0;


    timer =
      setInterval(
        () => {

          typingMessage.textContent +=
            text.charAt(index);


          index++;


          if (
            index >=
            text.length
          ) {

            clearInterval(
              timer
            );


            timer = null;


            setTimeout(
              () => {

                if (typingCursor) {
                  typingCursor.style.display =
                    "none";
                }


                if (giftBranding) {
                  giftBranding.classList.add(
                    "visible"
                  );
                }

              },
              500
            );
          }

        },
        55
      );
  }


  video.muted = true;

  video.playsInline = true;


  video.addEventListener(
    "play",
    () => {

      if (!started) {

        reset();


        setTimeout(
          startTyping,
          1200
        );
      }
    }
  );


  video.addEventListener(
    "ended",
    () => {

      reset();


      try {
        video.currentTime = 0;
      } catch {
        // Ignore unsupported seek.
      }


      video.play().catch(
        () => {}
      );
    }
  );


  video.play().catch(
    () => {}
  );
}


/* =========================================================
   ABOUT PAGE — STORY SLIDER
========================================================= */

function initAboutStories() {

  const cards =
    $$(".story-card");


  if (!cards.length) {
    return;
  }


  const nextButtons =
    $$("[data-next]");


  const previousButton =
    document.getElementById(
      "storyPrevious"
    );


  const progressBar =
    document.getElementById(
      "storyProgressBar"
    );


  const stepLabel =
    document.getElementById(
      "storyStepLabel"
    );


  const dots =
    $$(".story-dot");


  let current = 0;


  function showStory(index) {

    current =
      (index + cards.length) %
      cards.length;


    cards.forEach(
      (card, cardIndex) => {

        card.classList.toggle(
          "active",
          cardIndex === current
        );
      }
    );


    dots.forEach(
      (dot, dotIndex) => {

        dot.classList.toggle(
          "active",
          dotIndex === current
        );
      }
    );


    if (stepLabel) {

      stepLabel.textContent =
        String(
          current + 1
        ).padStart(
          2,
          "0"
        );
    }


    if (progressBar) {

      progressBar.style.width =
        `${((current + 1) / cards.length) * 100}%`;
    }
  }


  nextButtons.forEach(
    (button) => {

      button.type =
        "button";


      button.addEventListener(
        "click",
        (event) => {

          event.preventDefault();


          showStory(
            current + 1
          );
        }
      );
    }
  );


  if (previousButton) {

    previousButton.type =
      "button";


    previousButton.addEventListener(
      "click",
      (event) => {

        event.preventDefault();


        showStory(
          current - 1
        );
      }
    );
  }


  dots.forEach(
    (dot, index) => {

      dot.style.cursor =
        "pointer";


      dot.addEventListener(
        "click",
        () => {

          showStory(
            index
          );
        }
      );
    }
  );


  showStory(0);
}


/* =========================================================
   ABOUT PAGE ONLY
   "Whatever the season, make them feel seen."
========================================================= */

function initAboutEnding() {

  /*
    This function ONLY runs on About.
    Contact will not use it.
  */

  if (!isAboutPage()) {
    return;
  }


  const endingSection =
    document.querySelector(
      ".about-ending"
    );


  const typewriter =
    document.getElementById(
      "jolaEndingTypewriter"
    );


  if (
    !endingSection ||
    !typewriter
  ) {
    return;
  }


  /*
    THIS IS JOLA is already static HTML
    on the About page.

    JavaScript only types the sentence.
  */

  const message =
    "Whatever the season, make them feel seen.";


  const cursor =
    endingSection.querySelector(
      ".about-cursor"
    );


  let index = 0;


  typewriter.textContent =
    "";


  if (cursor) {
    cursor.style.display =
      "inline-block";
  }


  function typeNextCharacter() {

    if (
      index <
      message.length
    ) {

      typewriter.textContent +=
        message.charAt(index);


      index++;


      setTimeout(
        typeNextCharacter,
        70
      );


      return;
    }


    if (cursor) {

      setTimeout(
        () => {

          cursor.style.display =
            "none";

        },
        1000
      );
    }
  }


  /*
    Start shortly after page load.
  */

  setTimeout(
    typeNextCharacter,
    400
  );
}


/* =========================================================
   CONTACT PAGE
   REMOVE ABOUT ENDING FROM CONTACT
========================================================= */

function removeContactEnding() {

  if (!isContactPage()) {
    return;
  }


  const ending =
    document.querySelector(
      ".about-ending"
    );


  /*
    That section belongs to About.
    Since the Contact HTML currently contains it,
    remove it from the Contact page.
  */

  if (ending) {
    ending.remove();
  }
}


/* =========================================================
   CONTACT FORM
   REAL JOLA BACKEND
========================================================= */

function initContactForm() {

  const form =
    document.getElementById(
      "contactForm"
    );


  const submitButton =
    document.getElementById(
      "contactSubmit"
    );


  if (
    !form ||
    !submitButton
  ) {
    return;
  }


  /*
    Make the intended endpoint explicit.
    This also overrides the old FormSubmit action
    from older versions of contact.html.
  */

  form.action =
    CONTACT_API_URL;


  form.method =
    "POST";


  const nameInput =
    document.getElementById(
      "contactName"
    );


  const emailInput =
    document.getElementById(
      "contactEmail"
    );


  const messageInput =
    document.getElementById(
      "contactMessage"
    );


  const submitText =
    submitButton.querySelector(
      ".submit-text"
    );


  const submitArrow =
    submitButton.querySelector(
      ".submit-arrow"
    );


  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const name =
        nameInput
          ? nameInput.value.trim()
          : "";


      const email =
        emailInput
          ? emailInput.value.trim()
          : "";


      const message =
        messageInput
          ? messageInput.value.trim()
          : "";


      /* VALIDATION */

      if (!name) {

        alert(
          "Please enter your name."
        );

        if (nameInput) {
          nameInput.focus();
        }

        return;
      }


      if (!email) {

        alert(
          "Please enter your email address."
        );

        if (emailInput) {
          emailInput.focus();
        }

        return;
      }


      if (
        !isValidEmail(email)
      ) {

        alert(
          "Please enter a valid email address."
        );

        if (emailInput) {
          emailInput.focus();
        }

        return;
      }


      if (!message) {

        alert(
          "Please enter your message."
        );

        if (messageInput) {
          messageInput.focus();
        }

        return;
      }


      /* LOADING */

      submitButton.disabled =
        true;


      submitButton.classList.remove(
        "is-sent",
        "is-error"
      );


      submitButton.classList.add(
        "is-loading"
      );


      if (submitText) {
        submitText.textContent =
          "Sending...";
      }


      if (submitArrow) {
        submitArrow.textContent =
          "…";
      }


      /*
        VERY IMPORTANT:
        This is the exact endpoint that
        already worked in Postman.
      */

      console.log(
        "JOLA CONTACT API:",
        CONTACT_API_URL
      );


      try {

        const response =
          await fetch(
            CONTACT_API_URL,
            {
              method: "POST",

              mode: "cors",

              cache: "no-store",

              headers: {
                "Content-Type":
                  "application/json",

                "Accept":
                  "application/json"
              },

              body:
                JSON.stringify({
                  name,
                  email,
                  message
                })
            }
          );


        let data = {};


        const contentType =
          response.headers.get(
            "content-type"
          );


        if (
          contentType &&
          contentType.includes(
            "application/json"
          )
        ) {

          data =
            await response.json();

        } else {

          const text =
            await response.text();


          if (text) {
            data = {
              message:
                text
            };
          }
        }


        console.log(
          "JOLA CONTACT RESPONSE:",
          response.status,
          data
        );


        if (
          !response.ok
        ) {

          throw new Error(
            data.message ||
            `Request failed with status ${response.status}`
          );
        }


        /* SUCCESS */

        submitButton.classList.remove(
          "is-loading"
        );


        submitButton.classList.add(
          "is-sent"
        );


        if (submitText) {
          submitText.textContent =
            "Message Sent";
        }


        if (submitArrow) {
          submitArrow.textContent =
            "✓";
        }


        form.reset();


        /* RESET AFTER 4 SECONDS */

        setTimeout(
          () => {

            submitButton.disabled =
              false;


            submitButton.classList.remove(
              "is-sent"
            );


            if (submitText) {
              submitText.textContent =
                "Send Message";
            }


            if (submitArrow) {
              submitArrow.textContent =
                "→";
            }

          },
          4000
        );


      } catch (error) {

        console.error(
          "JOLA CONTACT ERROR:",
          error
        );


        submitButton.disabled =
          false;


        submitButton.classList.remove(
          "is-loading"
        );


        submitButton.classList.add(
          "is-error"
        );


        if (submitText) {
          submitText.textContent =
            "Try Again";
        }


        if (submitArrow) {
          submitArrow.textContent =
            "!";
        }


        alert(
          error.message ||
          "We couldn't send your message right now."
        );
      }
    }
  );
}


/* =========================================================
   FOOTER WHATSAPP
========================================================= */

function initFooterWhatsApp() {

  $$(".footer-whatsapp").forEach(
    (link) => {

      link.href =
        `https://wa.me/${WHATSAPP_NUMBER}`;

      link.target =
        "_blank";

      link.rel =
        "noopener noreferrer";
    }
  );
}


/* =========================================================
   INITIALIZE EVERYTHING
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "JOLA GIFTING JS LOADED"
    );


    /*
      HOME
    */

    initConsultation();
    initGiftVideo();


    /*
      ABOUT
    */

    initAboutStories();
    initAboutEnding();


    /*
      CONTACT
    */

    removeContactEnding();
    initContactForm();


    /*
      ALL PAGES
    */

    initFooterWhatsApp();
  }
);


/* =========================================================
   ABOUT PAGE — CLOSING TYPEWRITER
========================================================= */

function initAboutEnding() {
  const endingText = document.getElementById(
    "jolaEndingTypewriter"
  );

  const endingSection = document.querySelector(
    ".about-page .about-ending"
  );

  if (!endingText || !endingSection) {
    return;
  }

  /*
    Prevent the animation from being initialized twice.
    This fixes duplicated text such as:
    WWhhaatteevveerr...
  */
  if (endingSection.dataset.typewriterStarted === "true") {
    return;
  }

  endingSection.dataset.typewriterStarted = "true";

  const cursor = endingSection.querySelector(
    ".about-cursor"
  );

  const message =
    "Whatever the season, make them feel seen.";

  endingText.textContent = "";

  if (cursor) {
    cursor.style.display = "inline-block";
  }

  let index = 0;

  function typeMessage() {
    if (index >= message.length) {
      if (cursor) {
        setTimeout(() => {
          cursor.style.display = "none";
        }, 1200);
      }

      return;
    }

    endingText.textContent += message.charAt(index);

    index += 1;

    setTimeout(typeMessage, 75);
  }

  typeMessage();
}

document.addEventListener("DOMContentLoaded", () => {
  initConsultation();
  initFooterWhatsApp();
  initGiftVideo();
  initAboutStories();
  initAboutEnding();
  initContactForm();
  initFounderStory();
});


/* =========================================================
   ABOUT PAGE — FOUNDER STORY
========================================================= */

function initFounderStory() {
  const story = document.getElementById("founderStory");
  const photo = document.querySelector(".founder-photo");
  const button = document.getElementById("founderContinue");
  const more = document.getElementById("founderStoryMore");

  if (!story || !photo || !button || !more) {
    return;
  }

  function matchStoryHeight() {
    if (window.innerWidth <= 900 || story.classList.contains("is-expanded")) {
      story.style.height = "";
      return;
    }

    const photoHeight = photo.getBoundingClientRect().height;

    if (photoHeight > 0) {
      story.style.height = `${photoHeight}px`;
    }
  }

  function setExpandedState(expanded) {
    story.classList.toggle("is-expanded", expanded);

    button.setAttribute(
      "aria-expanded",
      expanded ? "true" : "false"
    );

    more.setAttribute(
      "aria-hidden",
      expanded ? "false" : "true"
    );

    const text = button.querySelector(".founder-continue-text");

    if (text) {
      text.textContent = expanded
        ? "Close the story"
        : "Continue the story";
    }

    if (expanded) {
      story.style.height = "";
    } else {
      matchStoryHeight();
    }
  }

  button.addEventListener("click", () => {
    const expanded = story.classList.contains("is-expanded");

    setExpandedState(!expanded);
  });

  if (photo.complete) {
    matchStoryHeight();
  } else {
    photo.addEventListener("load", matchStoryHeight);
  }

  window.addEventListener("resize", matchStoryHeight);
}