/* =========================================================
   JOLA GIFTING
   Frontend Logic
========================================================= */


/* =========================
   CONFIGURATION
========================= */

// Your local backend during development
const API_URL =
  "https://api.jolagifting.com/api/consultations";
// Jola's real Calendly link will go here later
const CALENDLY_URL =
  "https://calendly.com/jolagifting-jolagifting/30min";
// Jola's WhatsApp number will go here later
// IMPORTANT: use international format without +
// Example: 2348012345678
const WHATSAPP_NUMBER = "2349039476798";

/* =========================
   DOM ELEMENTS
========================= */

const form = document.getElementById("consultationForm");

const formSteps = document.querySelectorAll(".form-step");

const progressBar = document.getElementById("progressBar");
const stepLabel = document.getElementById("stepLabel");
const stepTitle = document.getElementById("stepTitle");

const successState = document.getElementById("successState");

const calendlyButton = document.getElementById("calendlyButton");
const whatsappButton = document.getElementById("whatsappButton");
const footerWhatsApp = document.getElementById("footerWhatsApp");

const choiceCards = document.querySelectorAll(".choice-card");

const giftIdeaField = document.getElementById("giftIdeaField");
const helpField = document.getElementById("helpField");

const giftIdeaInput = document.getElementById("giftIdea");
const helpDetailsInput = document.getElementById("helpDetails");

const stepThreeNext = document.getElementById("stepThreeNext");

const nextButtons = document.querySelectorAll(".next-button");
const backButtons = document.querySelectorAll(".back-button");


/* =========================
   STATE
========================= */

let currentStep = 1;

let hasGiftInMind = null;


/* =========================
   STEP TITLES
========================= */

const stepTitles = {
  1: "About You",
  2: "About The Moment",
  3: "Gift Idea",
  4: "Final Details",
};


/* =========================
   SHOW STEP
========================= */

function showStep(step) {
  currentStep = step;

  formSteps.forEach((formStep) => {
    formStep.classList.remove("active");
  });

  const activeStep = document.querySelector(
    `.form-step[data-step="${step}"]`
  );

  if (activeStep) {
    activeStep.classList.add("active");
  }

  updateProgress();

  clearErrors();

  // Bring the form back into view
  const card = document.querySelector(".consultation-card");

  if (card) {
    const cardTop =
      card.getBoundingClientRect().top + window.scrollY - 100;

    window.scrollTo({
      top: cardTop,
      behavior: "smooth",
    });
  }
}


/* =========================
   UPDATE PROGRESS
========================= */

function updateProgress() {
  const percentage = (currentStep / 4) * 100;

  progressBar.style.width = `${percentage}%`;

  stepLabel.textContent = `Step ${currentStep} of 4`;
  stepTitle.textContent = stepTitles[currentStep];
}


/* =========================
   CLEAR ERRORS
========================= */

function clearErrors() {
  document.querySelectorAll(".field-error").forEach((error) => {
    error.textContent = "";
  });

  document.querySelectorAll(".field input, .field textarea, .field select").forEach((input) => {
    input.style.borderColor = "";
  });
}


/* =========================
   ERROR MESSAGE
========================= */

function showError(input, message) {
  const field = input.closest(".field");

  if (!field) {
    return;
  }

  const error = field.querySelector(".field-error");

  if (error) {
    error.textContent = message;
  }

  input.style.borderColor = "#a33b3b";
}


/* =========================
   VALIDATE STEP
========================= */

function validateStep(step) {
  clearErrors();

  let valid = true;

  if (step === 1) {
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");

    if (!fullName.value.trim()) {
      showError(fullName, "Please enter your full name.");
      valid = false;
    }

    if (!email.value.trim()) {
      showError(email, "Please enter your email address.");
      valid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(email, "Please enter a valid email address.");
      valid = false;
    }

    if (!phone.value.trim()) {
      showError(phone, "Please enter your WhatsApp number.");
      valid = false;
    }
  }


  if (step === 2) {
    const recipientName = document.getElementById("recipientName");
    const occasion = document.getElementById("occasion");

    if (!recipientName.value.trim()) {
      showError(
        recipientName,
        "Please tell us who the gift is for."
      );

      valid = false;
    }

    if (!occasion.value) {
      showError(
        occasion,
        "Please select an occasion."
      );

      valid = false;
    }
  }


  if (step === 3) {
    if (hasGiftInMind === null) {
      alert("Please choose whether you already have a gift in mind.");
      valid = false;
    }

    if (
      hasGiftInMind === true &&
      !giftIdeaInput.value.trim()
    ) {
      alert("Please tell us what gift you have in mind.");
      valid = false;
    }
  }


  return valid;
}


/* =========================
   EMAIL VALIDATION
========================= */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* =========================
   NEXT BUTTONS
========================= */

nextButtons.forEach((button) => {
  button.addEventListener("click", () => {

    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < 4) {
      showStep(currentStep + 1);
    }

  });
});


/* =========================
   BACK BUTTONS
========================= */

backButtons.forEach((button) => {
  button.addEventListener("click", () => {

    if (currentStep > 1) {
      showStep(currentStep - 1);
    }

  });
});


/* =========================
   GIFT CHOICE
========================= */

choiceCards.forEach((card) => {

  card.addEventListener("click", () => {

    const choice = card.dataset.choice;

    // Remove selected state
    choiceCards.forEach((item) => {
      item.classList.remove("selected");
    });

    // Select current card
    card.classList.add("selected");


    if (choice === "yes") {

      hasGiftInMind = true;

      giftIdeaField.classList.add("active");
      helpField.classList.remove("active");

      helpDetailsInput.value = "";

    }


    if (choice === "no") {

      hasGiftInMind = false;

      helpField.classList.add("active");
      giftIdeaField.classList.remove("active");

      giftIdeaInput.value = "";

    }

  });

});


/* =========================
   SUBMIT FORM
========================= */

form.addEventListener("submit", async (event) => {

  event.preventDefault();


  if (!validateStep(4)) {
    return;
  }


  if (hasGiftInMind === null) {
    alert("Please go back and select a gift preference.");
    return;
  }


  const submitButton = document.getElementById("submitButton");

  const originalButtonText = submitButton.innerHTML;


  // Disable button
  submitButton.disabled = true;

  submitButton.innerHTML = `
    Sending...
    <span>...</span>
  `;


  /* =========================
     COLLECT FORM DATA
  ========================= */

  const fullName =
    document.getElementById("fullName").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const phone =
    document.getElementById("phone").value.trim();

  const recipientName =
    document.getElementById("recipientName").value.trim();

  const occasion =
    document.getElementById("occasion").value;

  const budget =
    document.getElementById("budget").value.trim();

  const notes =
    document.getElementById("notes").value.trim();


  /*
    If the customer already has a gift idea,
    use giftIdea.

    If they don't, combine their description
    into the notes field.
  */

  let finalNotes = notes;

  if (hasGiftInMind === false && helpDetailsInput.value.trim()) {

    const helpText =
      `Recipient details/preferences: ${helpDetailsInput.value.trim()}`;

    finalNotes = finalNotes
      ? `${helpText}\n\nAdditional notes: ${finalNotes}`
      : helpText;

  }


  const consultationData = {

    fullName,

    email,

    phone,

    recipientName,

    occasion,

    hasGiftInMind,

    giftIdea:
      hasGiftInMind
        ? giftIdeaInput.value.trim()
        : "",

    budget,

    notes: finalNotes,

  };


  /* =========================
     SEND TO BACKEND
  ========================= */

  try {

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(consultationData),

    });


    const data = await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Something went wrong while submitting your request."
      );

    }


    /* =========================
       SUCCESS
    ========================= */

    showSuccess(
      fullName,
      consultationData
    );


  } catch (error) {

    console.error(
      "Consultation submission error:",
      error
    );

    alert(
      "We couldn't submit your request right now. Please check your connection and try again."
    );

    submitButton.disabled = false;

    submitButton.innerHTML = originalButtonText;

  }

});


/* =========================
   SHOW SUCCESS
========================= */

function showSuccess(fullName, consultationData) {

  form.style.display = "none";

  document.querySelector(".form-progress").style.display =
    "none";

  successState.classList.add("active");


  /* =========================
     CALENDLY
  ========================= */

  if (
    CALENDLY_URL &&
    CALENDLY_URL !== "YOUR_CALENDLY_LINK"
  ) {

    calendlyButton.href = CALENDLY_URL;

  } else {

    calendlyButton.href = "#";

    calendlyButton.addEventListener("click", (event) => {

      event.preventDefault();

      alert(
        "Jola's Calendly booking link will be connected here."
      );

    }, { once: true });

  }


  /* =========================
     WHATSAPP
  ========================= */

  if (
    WHATSAPP_NUMBER &&
    WHATSAPP_NUMBER !== "YOUR_WHATSAPP_NUMBER"
  ) {

    const message = createWhatsAppMessage(
      fullName,
      consultationData
    );

    whatsappButton.href =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  } else {

    whatsappButton.href = "#";

    whatsappButton.addEventListener("click", (event) => {

      event.preventDefault();

      alert(
        "Jola's WhatsApp number will be connected here."
      );

    }, { once: true });

  }


  // Scroll to success message
  setTimeout(() => {

    const card =
      document.querySelector(".consultation-card");

    const cardTop =
      card.getBoundingClientRect().top +
      window.scrollY -
      80;

    window.scrollTo({
      top: cardTop,
      behavior: "smooth",
    });

  }, 100);

}


/* =========================
   WHATSAPP MESSAGE
========================= */

function createWhatsAppMessage(
  fullName,
  consultationData
) {

  const giftStatus =
    consultationData.hasGiftInMind
      ? "I already have a gift idea in mind."
      : "I would love some help choosing the gift.";


  let message =
    `Hi Jola! 👋\n\n` +
    `My name is ${fullName}. ` +
    `I'd love to create a special gift for ${consultationData.recipientName} ` +
    `for their ${consultationData.occasion}.\n\n` +
    `${giftStatus}`;


  if (
    consultationData.hasGiftInMind &&
    consultationData.giftIdea
  ) {

    message +=
      `\n\nGift idea:\n${consultationData.giftIdea}`;

  }


  if (consultationData.budget) {

    message +=
      `\n\nEstimated budget: ${consultationData.budget}`;

  }


  if (consultationData.notes) {

    message +=
      `\n\nAdditional details:\n${consultationData.notes}`;

  }


  message +=
    `\n\nI'd love to discuss it with you. Thank you! ❤️`;


  return message;

}


/* =========================
   FOOTER WHATSAPP
========================= */

if (
  footerWhatsApp &&
  WHATSAPP_NUMBER !== "YOUR_WHATSAPP_NUMBER"
) {

  footerWhatsApp.href =
    `https://wa.me/${WHATSAPP_NUMBER}`;

  footerWhatsApp.target = "_blank";
  footerWhatsApp.rel = "noopener noreferrer";

}


/* =========================
   INPUT INTERACTIONS
========================= */

document
  .querySelectorAll(
    ".field input, .field textarea, .field select"
  )
  .forEach((input) => {

    input.addEventListener("input", () => {

      input.style.borderColor = "";

      const field =
        input.closest(".field");

      if (!field) {
        return;
      }

      const error =
        field.querySelector(".field-error");

      if (error) {
        error.textContent = "";
      }

    });

  });

/* =========================
   JOLA HERO VIDEO EXPERIENCE
========================= */

const giftVideo = document.getElementById("giftVideo");
const typingMessage = document.getElementById("typingMessage");
const typingCursor = document.getElementById("typingCursor");
const giftBranding = document.getElementById("giftBranding");

let giftTypingTimer = null;
let giftAnimationStarted = false;

const giftMessage =
  "FOR EVERY MOMENT, THERE IS A GIFT FOR IT.";

function resetGiftAnimation() {
  if (giftTypingTimer) {
    clearInterval(giftTypingTimer);
    giftTypingTimer = null;
  }

  if (typingMessage) {
    typingMessage.textContent = "";
  }

  if (typingCursor) {
    typingCursor.style.display = "inline-block";
  }

  if (giftBranding) {
    giftBranding.classList.remove("visible");
  }

  giftAnimationStarted = false;
}

function startGiftTyping() {
  if (!typingMessage || giftAnimationStarted) {
    return;
  }

  giftAnimationStarted = true;

  let index = 0;

  giftTypingTimer = setInterval(() => {
    typingMessage.textContent += giftMessage.charAt(index);
    index++;

    if (index >= giftMessage.length) {
      clearInterval(giftTypingTimer);
      giftTypingTimer = null;

      /* Hide cursor when sentence finishes */
      setTimeout(() => {
        if (typingCursor) {
          typingCursor.style.display = "none";
        }

        /* Reveal Jola branding */
        if (giftBranding) {
          giftBranding.classList.add("visible");
        }
      }, 500);
    }
  }, 55);
}


/* Start the animation */
function startGiftExperience() {
  resetGiftAnimation();

  if (!giftVideo) {
    return;
  }

  /*
    Give the video a little time to establish
    the gifting moment before the text begins.
  */
  setTimeout(() => {
    startGiftTyping();
  }, 1200);
}


/* Video starts */
if (giftVideo) {

  giftVideo.addEventListener("play", () => {
    if (!giftAnimationStarted) {
      startGiftExperience();
    }
  });


  /*
    Restart video + typing animation
    when the video reaches the end.
  */
  giftVideo.addEventListener("ended", () => {

    resetGiftAnimation();

    giftVideo.currentTime = 0;

    const playPromise = giftVideo.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.log("Video autoplay was blocked.");
      });
    }

    setTimeout(() => {
      startGiftTyping();
    }, 1200);
  });


  /*
    Attempt autoplay on page load.
    Muted + playsinline makes this much more reliable.
  */
  giftVideo.muted = true;

  const initialPlay = giftVideo.play();

  if (initialPlay !== undefined) {
    initialPlay.catch(() => {
      console.log("Video autoplay requires user interaction.");
    });
  }
}


/* =========================
   INITIAL STATE
========================= */

showStep(1);
