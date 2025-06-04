// === Theme Toggle ===
document.addEventListener('DOMContentLoaded', function () {
  // Initialize theme
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    // Check for saved theme preference or respect OS preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('mrcoffee-theme');
    
    // Set initial theme state
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDarkMode);
    
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Update the icon to match the current theme
    updateThemeIcon(isDarkMode);
    
    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', function(e) {
      // Prevent this click from closing the mobile menu
      e.stopPropagation();
      
      const isDarkMode = document.body.classList.toggle('dark-mode');
      updateThemeIcon(isDarkMode);
      localStorage.setItem('mrcoffee-theme', isDarkMode ? 'dark' : 'light');
      
      // Force DOM repaint by accessing offsetHeight
      document.body.offsetHeight;
      
      // Update all color-dependent elements
      updateThemeColors(isDarkMode);
    });
  }
  
  function updateThemeIcon(isDarkMode) {
    if (!themeToggleBtn) return;
    
    // Change SVG icon based on theme
    const moonIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    
    const sunIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 20V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 12H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    
    themeToggleBtn.innerHTML = isDarkMode ? sunIcon : moonIcon;
  }
  
  function updateThemeColors(isDarkMode) {
    // Force update on problematic elements that might not respond to the class toggle
    const elementsToUpdate = document.querySelectorAll('.navbar, .logo, .nav-item a, .card, .about-section, .rewards-card, .menu-item, .order-form');
    
    elementsToUpdate.forEach(element => {
      // Trigger a reflow/repaint on the element
      element.style.transition = 'none';
      element.offsetHeight; // Force reflow
      element.style.transition = '';
    });
    
    // Special handling for elements that might have computed styles
    const bgElements = document.querySelectorAll('[style*="background"]');
    bgElements.forEach(element => {
      // Re-apply background styles based on computed values
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.background) {
        element.style.background = '';
        element.offsetHeight;
      }
    });
  }

  // === Mobile Menu Toggle ===
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.querySelector('.nav-list');
  const mobileBackdrop = document.querySelector('.mobile-menu-backdrop');
  const themeToggleInMenu = document.getElementById('theme-toggle');
  
  if (hamburgerBtn && navMenu && mobileBackdrop) {
    hamburgerBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
      mobileBackdrop.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on backdrop
    mobileBackdrop.addEventListener('click', function() {
      hamburgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
      mobileBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    });
    
    // Close menu when clicking on a menu link
    const navLinks = document.querySelectorAll('.nav-item a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
        mobileBackdrop.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    
    // Make sure theme toggle doesn't close the menu
    if (themeToggleInMenu) {
      const themeToggleContainer = themeToggleInMenu.parentNode;
      themeToggleContainer.addEventListener('click', function(e) {
        // Only prevent default if clicking the button itself
        if (e.target === themeToggleInMenu || themeToggleInMenu.contains(e.target)) {
          e.stopPropagation();
        }
      });
    }
  }

  // === Menu Filter ===
  const menuFilters = document.querySelectorAll('.menu-filter');
  const menuItems = document.querySelectorAll('.menu-item');
  if (menuFilters.length) {
    menuFilters.forEach(btn => {
      btn.addEventListener('click', function () {
        // Add micro-interaction effect
        btn.classList.add('pulse');
        setTimeout(() => btn.classList.remove('pulse'), 300);
        
        // Apply filter
        menuFilters.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const type = this.getAttribute('data-type');
        
        menuItems.forEach(item => {
          if (type === 'all' || item.getAttribute('data-type') === type) {
            item.style.display = '';
            // Add fade in animation for appearing items
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transition = 'opacity 0.3s ease';
            }, 10);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // === Rewards Popup ===
  const btnPopups = document.querySelectorAll('.btn-popup');
  const popup = document.getElementById('popup');
  const closePopup = document.querySelector('.close-popup');
  
  if (btnPopups.length && popup) {
    btnPopups.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        popup.style.display = 'flex';
        setTimeout(() => {
          popup.style.opacity = '1';
        }, 10);
      });
    });
    
    if (closePopup) {
      closePopup.addEventListener('click', function () {
        popup.style.opacity = '0';
        setTimeout(() => {
          popup.style.display = 'none';
        }, 300);
      });
    }
    
    popup.addEventListener('click', function (e) {
      if (e.target === popup) {
        popup.style.opacity = '0';
        setTimeout(() => {
          popup.style.display = 'none';
        }, 300);
      }
    });
  }

  // === Order Form Validation ===
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const addressInput = document.getElementById('address');
    const coffeeSelect = document.getElementById('coffee');
    const totalPrice = document.getElementById('totalPrice');
    const addons = document.querySelectorAll('input[name="addons"]');
    
    // Coffee price map
    const coffeePrices = {
      'espresso': 25000,
      'latte': 27000,
      'frappe': 30000,
      'brewed': 28000,
      'americano': 26000
    };
    
    // Addon price map
    const addonPrices = {
      'milk': 5000,
      'sugar': 3000,
      'shot': 8000
    };
    
    // Input field validation with visual feedback
    function addInputListeners(input, errorId, validateFn) {
      input.addEventListener('focus', () => {
        input.classList.remove('error');
        document.getElementById(errorId).textContent = '';
      });
      
      input.addEventListener('blur', () => {
        validateFn();
      });
      
      input.addEventListener('input', () => {
        validateFn();
      });
    }
    
    // Validate name (minimum 3 characters)
    function validateName() {
      const nameError = document.getElementById('nameError');
      if (nameInput.value.trim().length < 3) {
        nameInput.classList.add('error');
        nameError.textContent = 'Name must be at least 3 characters';
        return false;
      }
      nameInput.classList.remove('error');
      nameError.textContent = '';
      return true;
    }
    
    // Validate email (basic format check)
    function validateEmail() {
      const emailError = document.getElementById('emailError');
      if (!emailInput.value.includes('@') || !emailInput.value.includes('.')) {
        emailInput.classList.add('error');
        emailError.textContent = 'Please enter a valid email';
        return false;
      }
      emailInput.classList.remove('error');
      emailError.textContent = '';
      return true;
    }
    
    // Validate address (minimum 10 characters)
    function validateAddress() {
      const addressError = document.getElementById('addressError');
      if (addressInput.value.trim().length < 10) {
        addressInput.classList.add('error');
        addressError.textContent = 'Please enter a complete address (min 10 characters)';
        return false;
      }
      addressInput.classList.remove('error');
      addressError.textContent = '';
      return true;
    }
    
    // Validate coffee selection
    function validateCoffee() {
      const coffeeError = document.getElementById('coffeeError');
      if (!coffeeSelect.value) {
        coffeeSelect.classList.add('error');
        coffeeError.textContent = 'Please select a coffee';
        return false;
      }
      coffeeSelect.classList.remove('error');
      coffeeError.textContent = '';
      return true;
    }
    
    // Calculate total price
    function updateTotal() {
      let total = 0;
      
      // Add coffee price
      if (coffeeSelect.value) {
        total += coffeePrices[coffeeSelect.value];
      }
      
      // Add addon prices
      addons.forEach(addon => {
        if (addon.checked) {
          total += addonPrices[addon.value];
        }
      });
      
      // Format price with thousands separator
      totalPrice.textContent = 'Rp ' + total.toLocaleString('id-ID');
      
      return total;
    }
    
    // Set up event listeners
    if (nameInput) addInputListeners(nameInput, 'nameError', validateName);
    if (emailInput) addInputListeners(emailInput, 'emailError', validateEmail);
    if (addressInput) addInputListeners(addressInput, 'addressError', validateAddress);
    
    if (coffeeSelect) {
      coffeeSelect.addEventListener('change', () => {
        validateCoffee();
        updateTotal();
      });
    }
    
    addons.forEach(addon => {
      addon.addEventListener('change', updateTotal);
    });
    
    // Form submission
    orderForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isAddressValid = validateAddress();
      const isCoffeeValid = validateCoffee();
      
      if (isNameValid && isEmailValid && isAddressValid && isCoffeeValid) {
        // For demo purposes, we'll just show an alert
        alert('Order submitted successfully! Total: ' + totalPrice.textContent);
        orderForm.reset();
        updateTotal();
      } else {
        // Shake the form on error
        orderForm.classList.add('shake');
        setTimeout(() => {
          orderForm.classList.remove('shake');
        }, 500);
      }
    });
    
    // Initial total calculation
    updateTotal();
  }

  // === Micro-interactions ===
  // For cards and buttons - hover effect
  const cards = document.querySelectorAll('.card, .rewards-card, .menu-item');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
      this.style.boxShadow = 'var(--shadow-medium)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
    });
  });
  
  // Make social icons interactive
  const socialIcons = document.querySelectorAll('.social-icon');
  socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.2)';
    });
    
    icon.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
  
  // Button click effect for primary buttons
  const primaryButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-reward, .btn-popup');
  primaryButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
    });
  });
});

// Add CSS class for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  .pulse {
    animation: pulse 0.3s ease-in-out;
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  .shake {
    animation: shake 0.5s ease-in-out;
  }
  .error {
    border-color: #e53935 !important;
    box-shadow: 0 0 0 2px rgba(229, 57, 53, 0.2) !important;
  }
  .form-control {
    transition: all 0.3s ease;
  }
`;
document.head.appendChild(style);
