// VitalCare Wellness - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // ===========================================
    // NAVIGATION & HEADER FUNCTIONALITY
    // ===========================================
    
    // Header scroll effect
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');
    
    function updateHeader() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Initial check
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            
            // Toggle hamburger icon
            const icon = mobileMenuToggle.querySelector('i') || mobileMenuToggle;
            if (mobileMenu.classList.contains('active')) {
                icon.textContent = '×';
            } else {
                icon.textContent = '☰';
            }
        });
        
        // Close mobile menu when clicking on links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.textContent = '☰';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.textContent = '☰';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===========================================
    // APPOINTMENT FORM HANDLING
    // ===========================================

    // Function to handle appointment form submission
    function handleAppointmentForm(formId, messageId) {
        const appointmentForm = document.getElementById(formId);

        if (appointmentForm) {
            appointmentForm.addEventListener('submit', function(e) {
                e.preventDefault();

                // Get form data
                const formData = new FormData(this);
                const name = formData.get('name');
                const phone = formData.get('phone');
                const email = formData.get('email');
                const date = formData.get('date');
                const time = formData.get('time');
                const service = formData.get('service');

                // Validation
                const errors = [];

                if (!name || name.trim().length < 2) {
                    errors.push('Please enter a valid name');
                }

                if (!phone || !/^[+]?[\d\s\-\(\)]{10,}$/.test(phone)) {
                    errors.push('Please enter a valid phone number');
                }

                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    errors.push('Please enter a valid email address');
                }

                if (!date) {
                    errors.push('Please select an appointment date');
                } else {
                    const selectedDate = new Date(date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (selectedDate < today) {
                        errors.push('Please select a future date');
                    }
                }

                if (!service) {
                    errors.push('Please select a service');
                }

                // Display errors or success
                const formMessage = document.getElementById(messageId);

                if (errors.length > 0) {
                    if (formMessage) {
                        formMessage.innerHTML = `
                            <div style="background: #ffebee; color: #c62828; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                                <ul style="margin: 0; padding-left: 1rem;">
                                    ${errors.map(error => `<li>${error}</li>`).join('')}
                                </ul>
                            </div>
                        `;
                        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    // Simulate form submission
                    if (formMessage) {
                        const timeText = time ? ` at ${time}` : '';
                        formMessage.innerHTML = `
                            <div style="background: #e8f5e8; color: #2e7d32; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                                <h4 style="margin: 0 0 0.5rem 0; color: #2e7d32;">Appointment Request Submitted!</h4>
                                <p style="margin: 0; color: #2e7d32;">Thank you ${name}! We'll contact you within 24 hours to confirm your appointment for ${service} on ${date}${timeText}.</p>
                            </div>
                        `;
                        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    // Reset form
                    this.reset();

                    // In a real application, you would send this data to your server
                    console.log('Appointment data:', { name, phone, email, date, time, service });
                }
            });
        }
    }

    // Handle both appointment forms
    handleAppointmentForm('appointmentForm', 'formMessage');
    handleAppointmentForm('appointmentForm2', 'formMessage2');
    
    // ===========================================
    // TESTIMONIALS CAROUSEL
    // ===========================================
    
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    
    if (testimonialTrack && testimonialSlides.length > 0) {
        let currentSlide = 0;
        const totalSlides = testimonialSlides.length;
        
        // Auto-rotate testimonials
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }
        
        function updateCarousel() {
            const translateX = -currentSlide * 100;
            testimonialTrack.style.transform = `translateX(${translateX}%)`;
            
            // Update dots
            carouselDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        // Dot navigation
        carouselDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
                resetAutoRotation();
            });
        });
        
        // Auto-rotation
        let autoRotation = setInterval(nextSlide, 5000);
        
        function resetAutoRotation() {
            clearInterval(autoRotation);
            autoRotation = setInterval(nextSlide, 5000);
        }
        
        // Pause on hover
        if (testimonialTrack) {
            testimonialTrack.addEventListener('mouseenter', () => {
                clearInterval(autoRotation);
            });
            
            testimonialTrack.addEventListener('mouseleave', () => {
                autoRotation = setInterval(nextSlide, 5000);
            });
        }
        
        // Initialize
        updateCarousel();
    }
    
    // ===========================================
    // BMI CALCULATOR
    // ===========================================
    
    const bmiForm = document.getElementById('bmiForm');
    
    if (bmiForm) {
        bmiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const height = parseFloat(document.getElementById('bmiHeight').value);
            const weight = parseFloat(document.getElementById('bmiWeight').value);
            const bmiResult = document.getElementById('bmiResult');
            
            if (height > 0 && weight > 0) {
                const bmi = weight / ((height / 100) ** 2);
                let category, color;
                
                if (bmi < 18.5) {
                    category = 'Underweight';
                    color = '#ff9800';
                } else if (bmi < 25) {
                    category = 'Normal weight';
                    color = '#4caf50';
                } else if (bmi < 30) {
                    category = 'Overweight';
                    color = '#ff9800';
                } else {
                    category = 'Obese';
                    color = '#f44336';
                }
                
                bmiResult.innerHTML = `
                    <div style="background: #f5f5f5; padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="margin: 0 0 0.5rem 0; color: ${color};">Your BMI: ${bmi.toFixed(1)}</h4>
                        <p style="margin: 0; color: ${color}; font-weight: 600;">${category}</p>
                    </div>
                `;
            }
        });
        
        // Real-time BMI calculation
        const heightInput = document.getElementById('bmiHeight');
        const weightInput = document.getElementById('bmiWeight');
        
        if (heightInput && weightInput) {
            function calculateBMI() {
                const height = parseFloat(heightInput.value);
                const weight = parseFloat(weightInput.value);
                
                if (height > 0 && weight > 0) {
                    const bmi = weight / ((height / 100) ** 2);
                    document.getElementById('bmiValue').textContent = bmi.toFixed(1);
                } else {
                    document.getElementById('bmiValue').textContent = '--';
                }
            }
            
            heightInput.addEventListener('input', calculateBMI);
            weightInput.addEventListener('input', calculateBMI);
        }
    }
    
    // ===========================================
    // CALORIE CALCULATOR
    // ===========================================
    
    const calorieForm = document.getElementById('calorieForm');
    
    if (calorieForm) {
        calorieForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const age = parseInt(document.getElementById('calorieAge').value);
            const weight = parseFloat(document.getElementById('calorieWeight').value);
            const height = parseFloat(document.getElementById('calorieHeight').value);
            const gender = document.getElementById('calorieGender').value;
            const activity = document.getElementById('calorieActivity').value;
            const calorieResult = document.getElementById('calorieResult');
            
            if (age > 0 && weight > 0 && height > 0 && gender && activity) {
                // Harris-Benedict Equation
                let bmr;
                if (gender === 'male') {
                    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
                } else {
                    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
                }
                
                const activityFactors = {
                    'sedentary': 1.2,
                    'light': 1.375,
                    'moderate': 1.55,
                    'active': 1.725,
                    'very_active': 1.9
                };
                
                const calories = bmr * activityFactors[activity];
                
                calorieResult.innerHTML = `
                    <div style="background: #f5f5f5; padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #2ecc71;">Daily Calorie Needs</h4>
                        <p style="margin: 0; font-size: 1.5rem; font-weight: 600; color: #2ecc71;">${Math.round(calories)} calories/day</p>
                        <p style="margin: 0.5rem 0 0 0; color: #6c757d; font-size: 0.9rem;">
                            Based on ${activity} activity level
                        </p>
                    </div>
                `;
            }
        });
    }
    
    // ===========================================
    // FAQ ACCORDION
    // ===========================================
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('.faq-icon');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    if (otherAnswer) otherAnswer.style.display = 'none';
                    if (otherIcon) otherIcon.textContent = '▼';
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                if (answer) answer.style.display = 'none';
                if (icon) icon.textContent = '▼';
            } else {
                item.classList.add('active');
                if (answer) answer.style.display = 'block';
                if (icon) icon.textContent = '▲';
            }
        });
    });
    
    // ===========================================
    // CONTACT FORM HANDLING
    // ===========================================
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const phone = this.querySelector('input[name="phone"]').value;
            const message = this.querySelector('textarea[name="message"]').value;
            
            const errors = [];
            
            if (!name || name.trim().length < 2) {
                errors.push('Please enter a valid name');
            }
            
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errors.push('Please enter a valid email address');
            }
            
            if (!message || message.trim().length < 10) {
                errors.push('Please enter a message (at least 10 characters)');
            }
            
            const formMessage = this.querySelector('.form-message');
            
            if (errors.length > 0) {
                if (formMessage) {
                    formMessage.innerHTML = `
                        <div style="background: #ffebee; color: #c62828; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                            <ul style="margin: 0; padding-left: 1rem;">
                                ${errors.map(error => `<li>${error}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                }
            } else {
                if (formMessage) {
                    formMessage.innerHTML = `
                        <div style="background: #e8f5e8; color: #2e7d32; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                            <h4 style="margin: 0 0 0.5rem 0; color: #2e7d32;">Message Sent Successfully!</h4>
                            <p style="margin: 0; color: #2e7d32;">Thank you ${name}! We'll get back to you within 24 hours.</p>
                        </div>
                    `;
                }
                
                this.reset();
            }
        });
    }
    
    // ===========================================
    // CAREER FORM HANDLING
    // ===========================================
    
    const careerForm = document.getElementById('careerForm');
    
    if (careerForm) {
        careerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const position = this.querySelector('select[name="position"]').value;
            const experience = this.querySelector('input[name="experience"]').value;
            const file = this.querySelector('input[type="file"]').files[0];
            
            const errors = [];
            
            if (!name || name.trim().length < 2) {
                errors.push('Please enter your full name');
            }
            
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errors.push('Please enter a valid email address');
            }
            
            if (!position) {
                errors.push('Please select a position');
            }
            
            if (!experience || experience < 0) {
                errors.push('Please enter your years of experience');
            }
            
            if (!file) {
                errors.push('Please upload your resume');
            } else {
                const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                if (!allowedTypes.includes(file.type)) {
                    errors.push('Please upload a PDF or Word document');
                }
            }
            
            const formMessage = this.querySelector('.form-message');
            
            if (errors.length > 0) {
                if (formMessage) {
                    formMessage.innerHTML = `
                        <div style="background: #ffebee; color: #c62828; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                            <ul style="margin: 0; padding-left: 1rem;">
                                ${errors.map(error => `<li>${error}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                }
            } else {
                if (formMessage) {
                    formMessage.innerHTML = `
                        <div style="background: #e8f5e8; color: #2e7d32; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                            <h4 style="margin: 0 0 0.5rem 0; color: #2e7d32;">Application Submitted Successfully!</h4>
                            <p style="margin: 0; color: #2e7d32;">Thank you ${name}! We'll review your application for the ${position} position and get back to you soon.</p>
                        </div>
                    `;
                }
                
                this.reset();
            }
        });
    }
    
    // ===========================================
    // WHATSAPP BUTTON
    // ===========================================
    
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const phone = '+1234567890'; // Replace with actual WhatsApp number
            const message = encodeURIComponent('Hello! I would like to book an appointment at VitalCare Wellness.');
            const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }
    
    // ===========================================
    // SCROLL ANIMATIONS
    // ===========================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .feature-card, .team-card, .blog-card, .calculator-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // ===========================================
    // LAZY LOADING FOR IMAGES
    // ===========================================
    
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
    
    // ===========================================
    // PRICING TOGGLE (if needed)
    // ===========================================
    
    const pricingToggle = document.querySelector('.pricing-toggle');
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    if (pricingToggle && pricingCards.length > 0) {
        pricingToggle.addEventListener('click', function() {
            const isMonthly = this.textContent.includes('Monthly');
            
            pricingCards.forEach(card => {
                const price = card.querySelector('.price');
                const period = card.querySelector('.period');
                
                if (isMonthly) {
                    // Switch to yearly (example pricing)
                    price.textContent = '$' + (parseInt(price.textContent.replace('$', '')) * 12 - 120);
                    period.textContent = '/year';
                    this.textContent = 'Switch to Monthly';
                } else {
                    // Switch to monthly
                    price.textContent = '$' + Math.round(parseInt(price.textContent.replace('$', '')) / 12);
                    period.textContent = '/month';
                    this.textContent = 'Switch to Yearly';
                }
            });
        });
    }
    
    // ===========================================
    // INITIALIZATION COMPLETE
    // ===========================================
    
    console.log('VitalCare Wellness website initialized successfully!');
});

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="background: ${type === 'success' ? '#e8f5e8' : '#ffebee'}; 
                    color: ${type === 'success' ? '#2e7d32' : '#c62828'}; 
                    padding: 1rem; 
                    border-radius: 0.5rem; 
                    margin: 1rem; 
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}