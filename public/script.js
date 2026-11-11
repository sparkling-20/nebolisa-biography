
// Wait for the HTML document to load
document.addEventListener("DOMContentLoaded", () => {

    // Select the contact form
    const contactForm = document.querySelector("#contact-form");

    // Select the form status message
    const formStatus = document.querySelector("#form-status");

    // Check if the form exists
    if (!contactForm || !formStatus) return;

    // Select the submit button
    const submitButton = contactForm.querySelector(
        'button[type="submit"]'
    );

    // Listen for form submission
    contactForm.addEventListener("submit", async (event) => {

        // Prevent the page from refreshing
        event.preventDefault();

        // Collect form information
        const formData = new FormData(contactForm);

        const contactData = Object.fromEntries(
            formData.entries()
        );

        // Save original button text
        const originalButtonText = submitButton.innerHTML;

        try {

            // Show sending message
            formStatus.textContent = "Sending your message...";

            submitButton.disabled = true;
            submitButton.textContent = "Sending...";

            // Send information to the backend
            const response = await fetch("/api/contact", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(contactData)
            });

            const result = await response.json().catch(() => ({}));

            // Check for errors
            if (!response.ok) {
                throw new Error(
                    result.message || "Unable to send your message."
                );
            }

            // Display success message
            formStatus.textContent =
                result.message || "Message sent successfully!";

            // Clear the form
            contactForm.reset();

        } catch (error) {

            // Display error message
            formStatus.textContent = error.message;

        } finally {

            // Restore button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;

        }

    });

});
