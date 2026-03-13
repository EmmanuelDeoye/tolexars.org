// Volunteer Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const volunteerForm = document.getElementById('volunteerForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSections = document.getElementById('formSections');
    const successMessage = document.getElementById('successMessage');

    // Get database reference
    const database = firebase.database();
    const applicationsRef = database.ref('applications');

    // Initialize form state
    let isSubmitting = false;

    // Form submission handler
    volunteerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        // Validate form
        if (!validateForm()) {
            return;
        }

        try {
            // Set submitting state
            isSubmitting = true;
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

            // Get form data
            const formData = getFormData();
            
            // Add timestamp
            formData.timestamp = firebase.database.ServerValue.TIMESTAMP;
            formData.type = 'volunteer';
            formData.status = 'pending';
            
            // Submit to Firebase
            const newApplicationRef = applicationsRef.push();
            await newApplicationRef.set(formData);
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            volunteerForm.reset();
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your application. Please try again.');
        } finally {
            // Reset submitting state
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Volunteer Application';
        }
    });

    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
        // Required fields validation
        const requiredFields = [
            { id: 'fullName', message: 'Full name is required' },
            { id: 'phone', message: 'Phone number is required' },
            { id: 'location', message: 'City/State is required' },
            { id: 'motivation', message: 'Please tell us why you want to volunteer' }
        ];
        
        requiredFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!element.value.trim()) {
                showError(element, field.message);
                isValid = false;
            }
        });
        
        // Check if at least one help option is selected
        const helpOptions = document.querySelectorAll('input[name="helpOptions[]"]:checked');
        if (helpOptions.length === 0) {
            const firstCheckbox = document.querySelector('input[name="helpOptions[]"]');
            showError(firstCheckbox.parentElement, 'Please select at least one area where you can help');
            isValid = false;
        }
        
        // Check days available
        const daysAvailable = document.querySelector('input[name="daysAvailable"]:checked');
        if (!daysAvailable) {
            const firstRadio = document.querySelector('input[name="daysAvailable"]');
            showError(firstRadio.parentElement.parentElement, 'Please select your availability days');
            isValid = false;
        }
        
        // Check time available
        const timeAvailable = document.querySelector('input[name="timeAvailable"]:checked');
        if (!timeAvailable) {
            const firstRadio = document.querySelector('input[name="timeAvailable"]');
            showError(firstRadio.parentElement.parentElement, 'Please select your preferred time');
            isValid = false;
        }
        
        // Check frequency
        const frequency = document.querySelector('input[name="frequency"]:checked');
        if (!frequency) {
            const firstRadio = document.querySelector('input[name="frequency"]');
            showError(firstRadio.parentElement.parentElement, 'Please select how often you can volunteer');
            isValid = false;
        }
        
        // Check agreement
        const agreement = document.getElementById('agreement');
        if (!agreement.checked) {
            showError(agreement.parentElement, 'You must agree to the volunteer agreement');
            isValid = false;
        }
        
        // Check contact method
        const contactMethod = document.querySelector('input[name="contactMethod"]:checked');
        if (!contactMethod) {
            const firstRadio = document.querySelector('input[name="contactMethod"]');
            showError(firstRadio.parentElement.parentElement, 'Please select your preferred contact method');
            isValid = false;
        }
        
        return isValid;
    }

    // Show error message
    function showError(element, message) {
        element.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        element.parentElement.appendChild(errorElement);
    }

    // Get form data
    function getFormData() {
        // Get help options
        const helpOptions = Array.from(document.querySelectorAll('input[name="helpOptions[]"]:checked'))
            .map(checkbox => checkbox.value);
        
        // Get all form values
        return {
            fullName: document.getElementById('fullName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim() || null,
            location: document.getElementById('location').value.trim(),
            helpOptions: helpOptions,
            daysAvailable: document.querySelector('input[name="daysAvailable"]:checked').value,
            timeAvailable: document.querySelector('input[name="timeAvailable"]:checked').value,
            frequency: document.querySelector('input[name="frequency"]:checked').value,
            occupation: document.getElementById('occupation').value.trim() || null,
            skills: document.getElementById('skills').value.trim() || null,
            motivation: document.getElementById('motivation').value.trim(),
            contactMethod: document.querySelector('input[name="contactMethod"]:checked').value
        };
    }

    // Show success message
    function showSuccessMessage() {
        formSections.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Scroll to top of success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Log submission to console (for debugging)
        console.log('Volunteer application submitted successfully');
    }

    // Phone number formatting (optional)
    document.getElementById('phone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Format Nigerian phone numbers
        if (value.length === 11 && value.startsWith('0')) {
            value = value.replace(/^0/, '+234');
        } else if (value.length === 10) {
            value = '+234' + value;
        }
        
        e.target.value = value;
    });

    // Optional: Add character counter for motivation textarea
    const motivationTextarea = document.getElementById('motivation');
    motivationTextarea.addEventListener('input', function() {
        const charCount = this.value.length;
        const maxChars = 500;
        
        if (charCount > maxChars) {
            this.value = this.value.substring(0, maxChars);
        }
    });

    // Add smooth scroll to form sections on error
    window.addEventListener('DOMContentLoaded', function() {
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});

// Initialize mobile menu from main.js (if not already initialized)
if (typeof showMenu !== 'undefined') {
    showMenu('nav-toggle', 'nav-menu');
}