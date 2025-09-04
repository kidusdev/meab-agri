// MEAB PLC - Enhanced Website Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initNavigation();
  initContactForm();
  initStatsCounter();
  initSmoothScrolling();
  initMobileMenu();
  initFormValidation();
});

// Navigation functionality
function initNavigation() {
  const header = document.querySelector(".header");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const scrollIndicator = document.querySelector(".scroll-indicator");

  // Header scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking on links
  const navLinksItems = document.querySelectorAll(".nav-links a");
  navLinksItems.forEach((link) => {
    link.addEventListener("click", () => {
      if (hamburger.classList.contains("active")) {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
      }
    });
  });

  // Scroll indicator functionality
  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", () => {
      const statsSection = document.querySelector(".stats");
      if (statsSection) {
        statsSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Active navigation highlighting
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active");
      }
    });
  });
}

// Contact form functionality
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Basic validation
    if (!validateForm(data)) {
      return;
    }

    // Show loading state
    const submitBtn = this.querySelector(".submit-btn");
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
    submitBtn.disabled = true;

    // Prepare mailto link with form data
    const email = "Meab.agri@gmail.com";
    const subject = `For MEAB PLC from ${data.name}`;

    // Build email body with all form data
    let body = "";
    if (data.name) body += `Name: ${data.name}\n`;
    if (data.email) body += `Email: ${data.email}\n`;
    if (data.phone) body += `Phone Number: ${data.phone}\n`;
    if (data.service) body += `Service Interest: ${data.service}\n`;
    if (data.message) body += `Message: ${data.message}\n`;

    // Create mailto link
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      body
    )}`;

    // Try to open default email client
    try {
      window.location.href = mailtoLink;

      // Show success message
      showFormMessage("Email client opened! Please review and send your message.", "success");
    } catch (error) {
      // Fallback: show email details for manual copy
      const fallbackMessage = `Email: ${email}\nSubject: ${subject}\n\nBody:\n${body}`;

      showFormMessage("Email client couldn't open. Email details copied to clipboard!", "info");

      // Create a temporary textarea to copy the email details
      const textarea = document.createElement("textarea");
      textarea.value = fallbackMessage;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    // Reset form
    this.reset();

    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  });

  // Real-time form validation
  const formInputs = contactForm.querySelectorAll("input, textarea, select");
  formInputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });

    input.addEventListener("input", function () {
      if (this.classList.contains("error")) {
        validateField(this);
      }
    });
  });
}

// Form validation
function validateForm(data) {
  let isValid = true;

  // Required fields validation
  const requiredFields = ["name", "email", "message"];
  requiredFields.forEach((field) => {
    if (!data[field] || data[field].trim() === "") {
      showFieldError(field, "This field is required");
      isValid = false;
    }
  });

  // Email validation
  if (data.email && !isValidEmail(data.email)) {
    showFieldError("email", "Please enter a valid email address");
    isValid = false;
  }

  return isValid;
}

function validateField(field) {
  const fieldName = field.name;
  const value = field.value.trim();

  // Remove existing error
  removeFieldError(fieldName);

  // Required field validation
  if (field.hasAttribute("required") && !value) {
    showFieldError(fieldName, "This field is required");
    return false;
  }

  // Email validation
  if (fieldName === "email" && value && !isValidEmail(value)) {
    showFieldError(fieldName, "Please enter a valid email address");
    return false;
  }

  return true;
}

function showFieldError(fieldName, message) {
  const field = document.querySelector(`[name="${fieldName}"]`);
  if (!field) return;

  field.classList.add("error");

  // Remove existing error message
  const existingError = field.parentNode.querySelector(".field-error");
  if (existingError) {
    existingError.remove();
  }

  // Add error message
  const errorDiv = document.createElement("div");
  errorDiv.className = "field-error";
  errorDiv.style.color = "#d32f2f";
  errorDiv.style.fontSize = "0.875rem";
  errorDiv.style.marginTop = "0.5rem";
  errorDiv.textContent = message;

  field.parentNode.appendChild(errorDiv);
}

function removeFieldError(fieldName) {
  const field = document.querySelector(`[name="${fieldName}"]`);
  if (!field) return;

  field.classList.remove("error");
  const errorDiv = field.parentNode.querySelector(".field-error");
  if (errorDiv) {
    errorDiv.remove();
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFormMessage(message, type = "success") {
  const messageDiv = document.getElementById("formMessage");
  if (!messageDiv) return;

  messageDiv.textContent = message;
  messageDiv.className = `form-message ${type}`;
  messageDiv.style.display = "block";

  // Auto-hide after 5 seconds
  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 5000);
}

// Stats counter animation
function initStatsCounter() {
  const statNumbers = document.querySelectorAll(".stat-item h3");

  const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString();
    }, 20);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.textContent.replace(/,/g, ""));
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((stat) => {
    observer.observe(stat);
  });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Mobile menu functionality
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (!hamburger || !navLinks) return;

  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    }
  });

  // Close menu on window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    }
  });
}

// Enhanced form validation
function initFormValidation() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  // Add CSS for error states
  const style = document.createElement("style");
  style.textContent = `
        .form-group input.error,
        .form-group textarea.error,
        .form-group select.error {
            border-color: #d32f2f;
            box-shadow: 0 0 0 4px rgba(211, 47, 47, 0.1);
        }
        
        .form-group input:focus.error,
        .form-group textarea:focus.error,
        .form-group select:focus.error {
            border-color: #d32f2f;
            box-shadow: 0 0 0 4px rgba(211, 47, 47, 0.1);
        }
        
        .field-error {
            color: #d32f2f;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            font-weight: 500;
        }
    `;
  document.head.appendChild(style);
}

// Enhanced accessibility
function initAccessibility() {
  // Add skip to content link
  const skipLink = document.createElement("a");
  skipLink.href = "#main-content";
  skipLink.textContent = "Skip to main content";
  skipLink.className = "skip-link";
  skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #2e7d32;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;

  skipLink.addEventListener("focus", function () {
    this.style.top = "6px";
  });

  skipLink.addEventListener("blur", function () {
    this.style.top = "-40px";
  });

  document.body.insertBefore(skipLink, document.body.firstChild);

  // Add main content id
  const mainContent = document.querySelector("main") || document.querySelector(".hero");
  if (mainContent) {
    mainContent.id = "main-content";
  }
}

// Initialize accessibility features
initAccessibility();

// Add keyboard navigation support
document.addEventListener("keydown", function (e) {
  // Escape key closes mobile menu
  if (e.key === "Escape") {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    }
  }

  // Tab key navigation improvements
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-navigation");
  }
});

document.addEventListener("mousedown", function () {
  document.body.classList.remove("keyboard-navigation");
});

// Add CSS for keyboard navigation
const keyboardNavStyle = document.createElement("style");
keyboardNavStyle.textContent = `
    .keyboard-navigation .nav-links a:focus,
    .keyboard-navigation .cta-btn:focus,
    .keyboard-navigation .submit-btn:focus {
        outline: 3px solid #4caf50;
        outline-offset: 2px;
    }
`;
document.head.appendChild(keyboardNavStyle);

// Export functions for potential external use
window.MEABWebsite = {
  initNavigation,
  initContactForm,
  initStatsCounter,
  initSmoothScrolling,
  initMobileMenu,
  initFormValidation,
};
