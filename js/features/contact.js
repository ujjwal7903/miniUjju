"use strict";

(() => {
  function initContact() {
    const copyButton = document.querySelector("#copy-email");
    if (navigator.clipboard?.writeText) {
      copyButton.hidden = false;
      copyButton.addEventListener("click", async () => {
        const status = document.querySelector("#copy-status");
        try {
          await navigator.clipboard.writeText("ujjwal7903@gmail.com");
          status.textContent = "Email copied. Say hello when you're ready.";
        } catch (error) {
          console.error("Could not copy the email address.", error);
          status.textContent = "Couldn't copy. Use the email link to get in touch.";
        }
      });
    }
  }

  window.MiniU.initContact = initContact;
})();
