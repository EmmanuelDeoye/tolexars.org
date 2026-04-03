// Volunteer Form Submission with Modal Support
document.addEventListener('DOMContentLoaded', function() {
    // ==================== MODAL MANAGEMENT ====================
    const modals = document.querySelectorAll('.modal');
    const cards = document.querySelectorAll('.volunteer-card');
    
    // Open modal when card is clicked
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Prevent opening if clicking on button (button has its own handler)
            if (e.target.classList.contains('card-button') || e.target.closest('.card-button')) {
                return;
            }
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Also add click handler for button inside card
        const cardButton = card.querySelector('.card-button');
        if (cardButton) {
            cardButton.addEventListener('click', function(e) {
                e.stopPropagation();
                const modalId = card.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            });
        }
    });
    
    // Close modal functionality
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                resetFormInModal(modal);
            }
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                resetFormInModal(modal);
            }
        });
    });
    
    // Close on success button
    document.querySelectorAll('.close-after-success').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                resetFormInModal(modal);
            }
        });
    });
    
    function resetFormInModal(modal) {
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
        const formSections = modal.querySelector('#formSections, #profFormSections');
        const successMsg = modal.querySelector('#successMessage, #profSuccessMessage');
        if (formSections && successMsg) {
            formSections.style.display = 'block';
            successMsg.style.display = 'none';
        }
        // Clear error messages
        modal.querySelectorAll('.error-message').forEach(el => el.remove());
        modal.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
        // Reset other profession field visibility
        const otherProfessionField = document.getElementById('otherProfession');
        if (otherProfessionField) {
            otherProfessionField.style.display = 'none';
        }
    }
    
    // ==================== GENERAL VOLUNTEER FORM ====================
    const volunteerForm = document.getElementById('volunteerForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSections = document.getElementById('formSections');
    const successMessage = document.getElementById('successMessage');
    
    if (volunteerForm) {
        const database = firebase.database();
        const applicationsRef = database.ref('applications');
        let isSubmitting = false;
        
        volunteerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (isSubmitting) return;
            if (!validateGeneralForm()) return;
            
            try {
                isSubmitting = true;
                submitBtn.disabled = true;
                submitBtn.classList.add('loading');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                
                const formData = getGeneralFormData();
                formData.timestamp = firebase.database.ServerValue.TIMESTAMP;
                formData.type = 'volunteer';
                formData.status = 'pending';
                
                await applicationsRef.push(formData);
                
                formSections.style.display = 'none';
                successMessage.style.display = 'block';
                volunteerForm.reset();
                
                // Scroll to top of success message
                const modal = volunteerForm.closest('.modal');
                if (modal) {
                    modal.querySelector('.modal-body').scrollTop = 0;
                }
                
            } catch (error) {
                console.error('Error:', error);
                alert('There was an error submitting your application. Please try again.');
            } finally {
                isSubmitting = false;
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Volunteer Application';
            }
        });
    }
    
    // ==================== PROFESSIONAL VOLUNTEER FORM ====================
    const professionalForm = document.getElementById('professionalForm');
    const profSubmitBtn = document.getElementById('profSubmitBtn');
    const profFormSections = document.getElementById('profFormSections');
    const profSuccessMessage = document.getElementById('profSuccessMessage');
    
    if (professionalForm) {
        const database = firebase.database();
        const applicationsRef = database.ref('applications');
        let isSubmitting = false;
        
        // Show/hide other profession field
        const professionSelect = document.getElementById('profession');
        const otherProfessionField = document.getElementById('otherProfession');
        if (professionSelect && otherProfessionField) {
            otherProfessionField.style.display = 'none';
            professionSelect.addEventListener('change', function() {
                if (this.value === 'other') {
                    otherProfessionField.style.display = 'block';
                    otherProfessionField.required = true;
                } else {
                    otherProfessionField.style.display = 'none';
                    otherProfessionField.required = false;
                }
            });
        }
        
        professionalForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (isSubmitting) return;
            if (!validateProfessionalForm()) return;
            
            try {
                isSubmitting = true;
                profSubmitBtn.disabled = true;
                profSubmitBtn.classList.add('loading');
                profSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                
                const formData = getProfessionalFormData();
                formData.timestamp = firebase.database.ServerValue.TIMESTAMP;
                formData.type = 'professional_volunteer';
                formData.status = 'pending';
                
                await applicationsRef.push(formData);
                
                profFormSections.style.display = 'none';
                profSuccessMessage.style.display = 'block';
                professionalForm.reset();
                if (otherProfessionField) otherProfessionField.style.display = 'none';
                
                // Scroll to top of success message
                const modal = professionalForm.closest('.modal');
                if (modal) {
                    modal.querySelector('.modal-body').scrollTop = 0;
                }
                
            } catch (error) {
                console.error('Error:', error);
                alert('There was an error submitting your application. Please try again.');
            } finally {
                isSubmitting = false;
                profSubmitBtn.disabled = false;
                profSubmitBtn.classList.remove('loading');
                profSubmitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Professional Application';
            }
        });
    }
    
    // ==================== VALIDATION FUNCTIONS ====================
    function validateGeneralForm() {
        let isValid = true;
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
        // Required text fields
        const requiredFields = [
            { id: 'fullName', msg: 'Full name is required' },
            { id: 'phone', msg: 'Phone number is required' },
            { id: 'location', msg: 'City/State is required' },
            { id: 'motivation', msg: 'Please tell us why you want to volunteer' }
        ];
        
        requiredFields.forEach(field => {
            const el = document.getElementById(field.id);
            if (el && !el.value.trim()) {
                showError(el, field.msg);
                isValid = false;
            }
        });
        
        // Help options checkboxes
        const helpOptions = document.querySelectorAll('input[name="helpOptions[]"]:checked');
        if (helpOptions.length === 0) {
            const firstCheckbox = document.querySelector('input[name="helpOptions[]"]');
            if (firstCheckbox) {
                showError(firstCheckbox.closest('.checkbox-group') || firstCheckbox.parentElement, 'Please select at least one area where you can help');
            }
            isValid = false;
        }
        
        // Radio button validation
        if (!document.querySelector('input[name="daysAvailable"]:checked')) {
            const radioGroup = document.querySelector('input[name="daysAvailable"]').closest('.radio-group');
            if (radioGroup) showError(radioGroup, 'Please select your availability days');
            isValid = false;
        }
        
        if (!document.querySelector('input[name="timeAvailable"]:checked')) {
            const radioGroup = document.querySelector('input[name="timeAvailable"]').closest('.radio-group');
            if (radioGroup) showError(radioGroup, 'Please select your preferred time');
            isValid = false;
        }
        
        if (!document.querySelector('input[name="frequency"]:checked')) {
            const radioGroup = document.querySelector('input[name="frequency"]').closest('.radio-group');
            if (radioGroup) showError(radioGroup, 'Please select how often you can volunteer');
            isValid = false;
        }
        
        const agreement = document.getElementById('agreement');
        if (agreement && !agreement.checked) {
            showError(agreement.closest('.checkbox-label'), 'You must agree to the volunteer agreement');
            isValid = false;
        }
        
        if (!document.querySelector('input[name="contactMethod"]:checked')) {
            const radioGroup = document.querySelector('input[name="contactMethod"]').closest('.radio-group');
            if (radioGroup) showError(radioGroup, 'Please select your preferred contact method');
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateProfessionalForm() {
        let isValid = true;
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
        const requiredFields = [
            { id: 'profFullName', msg: 'Full name is required' },
            { id: 'profPhone', msg: 'Phone number is required' },
            { id: 'profLocation', msg: 'City/State is required' },
            { id: 'profession', msg: 'Please select your profession' },
            { id: 'profMotivation', msg: 'Please tell us why you want to volunteer' }
        ];
        
        requiredFields.forEach(field => {
            const el = document.getElementById(field.id);
            if (el && !el.value.trim()) {
                showError(el, field.msg);
                isValid = false;
            }
        });
        
        const profession = document.getElementById('profession').value;
        const otherProf = document.getElementById('otherProfession');
        if (profession === 'other' && otherProf && !otherProf.value.trim()) {
            showError(otherProf, 'Please specify your profession');
            isValid = false;
        }
        
        if (!document.querySelector('input[name="professionalCategory"]:checked')) {
            const radioGroup = document.querySelector('input[name="professionalCategory"]').closest('.radio-group');
            if (radioGroup) showError(radioGroup, 'Please select your category (Student or Licensed)');
            isValid = false;
        }
        
        const profHelpOptions = document.querySelectorAll('input[name="profHelpOptions[]"]:checked');
        if (profHelpOptions.length === 0) {
            const firstCheckbox = document.querySelector('input[name="profHelpOptions[]"]');
            if (firstCheckbox) {
                showError(firstCheckbox.closest('.checkbox-group') || firstCheckbox.parentElement, 'Please select at least one way you can contribute');
            }
            isValid = false;
        }
        
        if (!document.querySelector('input[name="profDaysAvailable"]:checked')) {
            const radioGroup = document.querySelector('input[name="profDaysAvailable"]').closest('.radio-group');
            if (radioGroup) showError(radioGroup, 'Please select your availability days');
            isValid = false;
        }
        
        if (!document.querySelector('input[name="profTimeAvailable"]:checked')) {
            const radioGroup = document.querySelector('input[name="profTimeAvailable"]').closest('.radio-group');
            if (radioGroup) showError(radioGroup, 'Please select your preferred time');
            isValid = false;
        }
        
        if (!document.querySelector('input[name="profFrequency"]:checked')) {
            const radioGroup = document.querySelector('input[name="profFrequency"]').closest('.radio-group');
            if (radioGroup) showError(radioGroup, 'Please select your availability frequency');
            isValid = false;
        }
        
        const profAgreement = document.getElementById('profAgreement');
        if (profAgreement && !profAgreement.checked) {
            showError(profAgreement.closest('.checkbox-label'), 'You must agree to the volunteer agreement');
            isValid = false;
        }
        
        if (!document.querySelector('input[name="profContactMethod"]:checked')) {
            const radioGroup = document.querySelector('input[name="profContactMethod"]').closest('.radio-group');
            if (radioGroup) showError(radioGroup, 'Please select your preferred contact method');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(element, message) {
        if (!element) return;
        element.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        element.parentElement.appendChild(errorElement);
    }
    
    // ==================== DATA EXTRACTION ====================
    function getGeneralFormData() {
        const helpOptions = Array.from(document.querySelectorAll('input[name="helpOptions[]"]:checked')).map(cb => cb.value);
        return {
            fullName: document.getElementById('fullName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim() || null,
            location: document.getElementById('location').value.trim(),
            helpOptions: helpOptions,
            daysAvailable: document.querySelector('input[name="daysAvailable"]:checked')?.value || '',
            timeAvailable: document.querySelector('input[name="timeAvailable"]:checked')?.value || '',
            frequency: document.querySelector('input[name="frequency"]:checked')?.value || '',
            occupation: document.getElementById('occupation').value.trim() || null,
            skills: document.getElementById('skills').value.trim() || null,
            motivation: document.getElementById('motivation').value.trim(),
            contactMethod: document.querySelector('input[name="contactMethod"]:checked')?.value || ''
        };
    }
    
    function getProfessionalFormData() {
        const helpOptions = Array.from(document.querySelectorAll('input[name="profHelpOptions[]"]:checked')).map(cb => cb.value);
        let professionValue = document.getElementById('profession').value;
        if (professionValue === 'other') {
            professionValue = document.getElementById('otherProfession').value.trim();
        }
        
        return {
            fullName: document.getElementById('profFullName').value.trim(),
            phone: document.getElementById('profPhone').value.trim(),
            email: document.getElementById('profEmail').value.trim() || null,
            location: document.getElementById('profLocation').value.trim(),
            profession: professionValue,
            category: document.querySelector('input[name="professionalCategory"]:checked')?.value || '',
            helpOptions: helpOptions,
            daysAvailable: document.querySelector('input[name="profDaysAvailable"]:checked')?.value || '',
            timeAvailable: document.querySelector('input[name="profTimeAvailable"]:checked')?.value || '',
            frequency: document.querySelector('input[name="profFrequency"]:checked')?.value || '',
            occupation: document.getElementById('profOccupation').value.trim() || null,
            skills: document.getElementById('profSkills').value.trim() || null,
            motivation: document.getElementById('profMotivation').value.trim(),
            contactMethod: document.querySelector('input[name="profContactMethod"]:checked')?.value || ''
        };
    }
    
    // Phone number formatting
    const phoneInputs = ['phone', 'profPhone'];
    phoneInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length === 11 && value.startsWith('0')) {
                    value = value.replace(/^0/, '+234');
                } else if (value.length === 10 && !value.startsWith('234')) {
                    value = '+234' + value;
                }
                e.target.value = value;
            });
        }
    });
});