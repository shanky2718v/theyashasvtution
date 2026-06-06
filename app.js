document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navToggleSpans = toggleBtn.querySelectorAll('span');

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger menu lines
    if (navMenu.classList.contains('active')) {
      navToggleSpans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
      navToggleSpans[1].style.opacity = '0';
      navToggleSpans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
      navToggleSpans[0].style.transform = 'none';
      navToggleSpans[1].style.opacity = '1';
      navToggleSpans[2].style.transform = 'none';
    }
  });

  // Close mobile nav when clicking a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggleSpans[0].style.transform = 'none';
        navToggleSpans[1].style.opacity = '1';
        navToggleSpans[2].style.transform = 'none';
      }
    });
  });

  // Sticky header class updates on scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.padding = '0.5rem 0';
      header.style.boxShadow = '0 10px 15px -3px rgba(15, 23, 42, 0.08)';
    } else {
      header.style.padding = '1.25rem 0';
      header.style.boxShadow = 'none';
    }
  });

  // Scroll Entrance Reveal Animation (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed to keep layout light
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // Ticker Auto-duplicate for smooth infinite loop (fallback for small text lengths)
  const ticker = document.querySelector('.ticker');
  if (ticker) {
    const originalContent = ticker.innerHTML;
    // Duplicate 3 times to ensure no gaps are visible at large screen sizes
    ticker.innerHTML = originalContent + originalContent + originalContent + originalContent;
  }

  // ----------------------------------------------------
  // Dynamic Database Form Submission (Google Apps Script Integration)
  // ----------------------------------------------------
  const inquiryForm = document.getElementById('inquiry-form');
  const submitBtn = document.getElementById('inquiry-submit-btn');
  const successModal = document.getElementById('success-modal');

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyMUfRJMAXlq26XbATkzfRoR0WTWFuVuxHKE6k4ErX_grBA7VyCD0yq6JL2kqpqjpIL7w/exec';

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Stop standard page refresh

      // Gather form inputs
      const studentNameVal = document.getElementById('student-name').value;
      const parentNameVal = document.getElementById('parent-name').value;
      const phoneVal = document.getElementById('contact-phone').value;
      const programVal = document.getElementById('interested-program').value;
      const messageVal = document.getElementById('query-msg').value || '';

      // Validate inputs are not empty
      if (!studentNameVal.trim()) {
        alert("Student Name cannot be empty.");
        return;
      }
      if (!parentNameVal.trim()) {
        alert("Parent/Guardian Name cannot be empty.");
        return;
      }
      if (!phoneVal.trim()) {
        alert("Phone Number cannot be empty.");
        return;
      }

      // Validate phone number format (only valid mobile numbers)
      // Accepts optional leading '+', country codes, digits, and standard separators
      // Cleans non-digits/optional leading + and ensures it forms a valid length (10 to 15 digits)
      const cleanedPhone = phoneVal.trim().replace(/[\s\-()]/g, '');
      const isPhoneValid = /^\+?[0-9]{10,15}$/.test(cleanedPhone);
      if (!isPhoneValid) {
        alert("Please enter a valid mobile number.");
        return;
      }

      // Activate submitting status (loading visual states)
      if (submitBtn) {
        submitBtn.classList.add('submitting');
        submitBtn.innerText = 'Submitting...';
      }

      // Construct JSON payload matching the expected format
      const payload = {
        studentName: studentNameVal.trim(),
        parentName: parentNameVal.trim(),
        phoneNumber: phoneVal.trim(),
        program: programVal,
        message: messageVal.trim()
      };

      // Send to Google Apps Script via fetch() POST request
      // Using 'text/plain' and 'no-cors' mode is required because Google Apps Script Web Apps 
      // do not natively support CORS preflight OPTIONS requests triggered by 'application/json'.
      // By sending as 'text/plain' with 'no-cors', the preflight check is bypassed, 
      // allowing the Google Apps Script doPost(e) function to run successfully and parse the payload.
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      })
      .then(response => {
        // Some Google Web App script configurations might reject cors preflight but complete successfully, 
        // while others return standard redirect. If response.ok or response.status is 200, it succeeded.
        if (!response.ok && response.status !== 0) {
          throw new Error('Google Script submission returned an error: ' + response.statusText);
        }
        
        // Deactivate loading state
        if (submitBtn) {
          submitBtn.classList.remove('submitting');
          submitBtn.innerText = 'Submit Inquiry';
        }

        // Show successful submission popup
        alert("Inquiry Submitted Successfully");

        // Keep the successModal active as an elegant supplementary custom UX popup
        if (successModal) {
          successModal.classList.add('active');
        }

        // Reset the form fields
        inquiryForm.reset();
      })
      .catch((error) => {
        console.error('Error submitting to Google Apps Script:', error);
        
        // Deactivate loading state
        if (submitBtn) {
          submitBtn.classList.remove('submitting');
          submitBtn.innerText = 'Submit Inquiry';
        }

        // Show failure popup
        alert("Submission Failed. Please try again.");
      });
    });
  }
});
