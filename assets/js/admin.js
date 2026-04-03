// Admin Panel Logic with Certificate Modal
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const passcodeOverlay = document.getElementById('passcodeOverlay');
    const adminContent = document.getElementById('adminContent');
    const verifyBtn = document.getElementById('verifyPasscodeBtn');
    const passcodeInput = document.getElementById('passcodeInput');
    const passcodeError = document.getElementById('passcodeError');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Tab elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const pendingTab = document.getElementById('pendingTab');
    const approvedTab = document.getElementById('approvedTab');
    const pendingList = document.getElementById('pendingList');
    const approvedList = document.getElementById('approvedList');
    const pendingCountSpan = document.getElementById('pendingCount');
    const approvedCountSpan = document.getElementById('approvedCount');
    
    // Search inputs
    const searchPending = document.getElementById('searchPending');
    const searchApproved = document.getElementById('searchApproved');
    
    let allApplications = [];
    let approvedApps = [];
    let pendingApps = [];
    let dbRef;
    
    // Firebase reference
    if (firebase.database) {
        dbRef = firebase.database().ref('applications');
    } else {
        console.error('Firebase not initialized');
        return;
    }
    
    // ---------- PASSCODE VERIFICATION ----------
    const CORRECT_PASSCODE = 'tlx';
    
    function verifyPasscode() {
        const entered = passcodeInput.value.trim();
        if (entered === CORRECT_PASSCODE) {
            passcodeOverlay.style.display = 'none';
            adminContent.style.display = 'block';
            loadApplications();
        } else {
            passcodeError.textContent = 'Incorrect passcode. Try again.';
            passcodeInput.value = '';
            passcodeInput.focus();
        }
    }
    
    verifyBtn.addEventListener('click', verifyPasscode);
    passcodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifyPasscode();
    });
    
    // Logout
    logoutBtn.addEventListener('click', () => {
        adminContent.style.display = 'none';
        passcodeOverlay.style.display = 'flex';
        passcodeInput.value = '';
        passcodeError.textContent = '';
        pendingList.innerHTML = '';
        approvedList.innerHTML = '';
        allApplications = [];
    });
    
    // ---------- LOAD DATA ----------
    function loadApplications() {
        pendingList.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-pulse"></i> Loading applications...</div>';
        approvedList.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-pulse"></i> Loading approved...</div>';
        
        dbRef.once('value', (snapshot) => {
            const apps = [];
            snapshot.forEach(child => {
                const val = child.val();
                val.id = child.key;
                apps.push(val);
            });
            allApplications = apps;
            filterAndRender();
        }, (error) => {
            console.error(error);
            pendingList.innerHTML = '<div class="no-results">Error loading data. Check console.</div>';
        });
    }
    
    function filterAndRender() {
        pendingApps = allApplications.filter(app => app.status !== 'approved');
        approvedApps = allApplications.filter(app => app.status === 'approved');
        updateCounters();
        renderPendingList();
        renderApprovedList();
    }
    
    function updateCounters() {
        pendingCountSpan.textContent = pendingApps.length;
        approvedCountSpan.textContent = approvedApps.length;
    }
    
    function formatDate(timestamp) {
        if (!timestamp) return 'Unknown date';
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    }
    
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    // Render functions
    function renderPendingList() {
        const searchTerm = searchPending ? searchPending.value.toLowerCase() : '';
        let filtered = pendingApps.filter(app => {
            const name = (app.fullName || '').toLowerCase();
            const phone = (app.phone || '').toLowerCase();
            const email = (app.email || '').toLowerCase();
            return name.includes(searchTerm) || phone.includes(searchTerm) || email.includes(searchTerm);
        });
        
        if (filtered.length === 0) {
            pendingList.innerHTML = '<div class="no-results">No pending applications found.</div>';
            return;
        }
        
        pendingList.innerHTML = filtered.map(app => `
            <div class="volunteer-card" data-id="${app.id}">
                <h3>${escapeHtml(app.fullName)}</h3>
                <div class="volunteer-details">
                    <p><i class="fas fa-phone"></i> ${escapeHtml(app.phone || '—')}</p>
                    <p><i class="fas fa-envelope"></i> ${escapeHtml(app.email || '—')}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${escapeHtml(app.location || '—')}</p>
                    <p><i class="fas fa-calendar"></i> ${formatDate(app.timestamp)}</p>
                </div>
                <div class="help-options">
                    <strong>Interests:</strong> ${escapeHtml((app.helpOptions || []).join(', ') || 'Not specified')}
                </div>
                <div class="card-actions">
                    <button class="btn-approve" data-id="${app.id}"><i class="fas fa-check-circle"></i> Approve</button>
                    <button class="btn-contact" data-id="${app.id}"><i class="fas fa-comment"></i> Contact</button>
                    <button class="btn-remove" data-id="${app.id}"><i class="fas fa-trash-alt"></i> Remove</button>
                </div>
            </div>
        `).join('');
        
        attachCardEvents();
    }
    
    function renderApprovedList() {
        const searchTerm = searchApproved ? searchApproved.value.toLowerCase() : '';
        let filtered = approvedApps.filter(app => {
            const name = (app.fullName || '').toLowerCase();
            const phone = (app.phone || '').toLowerCase();
            const email = (app.email || '').toLowerCase();
            return name.includes(searchTerm) || phone.includes(searchTerm) || email.includes(searchTerm);
        });
        
        if (filtered.length === 0) {
            approvedList.innerHTML = '<div class="no-results">No approved volunteers found.</div>';
            return;
        }
        
        approvedList.innerHTML = filtered.map(app => `
            <div class="volunteer-card approved" data-id="${app.id}">
                <h3>${escapeHtml(app.fullName)}</h3>
                <div class="volunteer-details">
                    <p><i class="fas fa-phone"></i> ${escapeHtml(app.phone || '—')}</p>
                    <p><i class="fas fa-envelope"></i> ${escapeHtml(app.email || '—')}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${escapeHtml(app.location || '—')}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-contact" data-id="${app.id}"><i class="fas fa-comment"></i> Contact</button>
                    <button class="btn-certificate" data-id="${app.id}"><i class="fas fa-certificate"></i> Award Certificate</button>
                    <button class="btn-remove" data-id="${app.id}"><i class="fas fa-trash-alt"></i> Remove</button>
                </div>
            </div>
        `).join('');
        
        attachCardEvents();
    }
    
    // ---------- ACTION HANDLERS ----------
    async function handleApprove(e) {
        const btn = e.currentTarget;
        const appId = btn.getAttribute('data-id');
        const application = allApplications.find(app => app.id === appId);
        if (!application) return;
        
        try {
            await dbRef.child(appId).update({ status: 'approved' });
            application.status = 'approved';
            filterAndRender();
            sendApprovalMessage(application);
        } catch (error) {
            console.error('Approval failed', error);
            alert('Error approving application. Try again.');
        }
    }
    
    function sendApprovalMessage(app) {
        const contactMethod = app.contactMethod || 'whatsapp';
        const phone = app.phone ? app.phone.replace(/\s/g, '') : '';
        const email = app.email || '';
        const name = app.fullName.split(' ')[0];
        const message = `🎉 Hello ${name}, congratulations! Your volunteer application with Tolexars Therapy Services has been APPROVED. We're excited to have you on board. Our team will reach out shortly with orientation details. Welcome to the family! 💙`;
        
        if (contactMethod === 'whatsapp' && phone) {
            let cleanPhone = phone.replace(/^0/, '234');
            if (!cleanPhone.startsWith('234')) cleanPhone = '234' + cleanPhone;
            window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
        } 
        else if (contactMethod === 'email' && email) {
            window.location.href = `mailto:${email}?subject=Volunteer Application Approved&body=${encodeURIComponent(message)}`;
        }
        else if (contactMethod === 'phoneCall') {
            alert(`Preferred contact is phone call. Please call ${app.phone} and read:\n\n${message}`);
        }
        else {
            alert(`No valid contact. Message:\n${message}`);
        }
    }
    
    function handleContact(e) {
        const btn = e.currentTarget;
        const appId = btn.getAttribute('data-id');
        const application = allApplications.find(app => app.id === appId);
        if (!application) return;
        
        const contactMethod = application.contactMethod || 'whatsapp';
        const phone = application.phone ? application.phone.replace(/\s/g, '') : '';
        const email = application.email || '';
        const name = application.fullName.split(' ')[0];
        const statusMsg = application.status === 'approved' ? 'approved volunteer' : 'pending application';
        const message = `Hello ${name}, this is Tolexars Therapy Services. Regarding your ${statusMsg}, we'd like to connect with you. Please respond at your earliest convenience. Thank you!`;
        
        if (contactMethod === 'whatsapp' && phone) {
            let cleanPhone = phone.replace(/^0/, '234');
            if (!cleanPhone.startsWith('234')) cleanPhone = '234' + cleanPhone;
            window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
        } 
        else if (contactMethod === 'email' && email) {
            window.location.href = `mailto:${email}?subject=Regarding your volunteer application&body=${encodeURIComponent(message)}`;
        }
        else if (contactMethod === 'phoneCall') {
            alert(`Please call ${application.phone} and deliver:\n\n${message}`);
        }
        else {
            alert(`No valid contact. Message:\n${message}`);
        }
    }
    
    async function handleRemove(e) {
        const btn = e.currentTarget;
        const appId = btn.getAttribute('data-id');
        if (!confirm('Are you sure you want to permanently remove this volunteer application?')) return;
        try {
            await dbRef.child(appId).remove();
            allApplications = allApplications.filter(app => app.id !== appId);
            filterAndRender();
        } catch (error) {
            console.error('Remove failed', error);
            alert('Error removing application.');
        }
    }
    
    // ========== CERTIFICATE MODAL WITH ORIENTATION ==========
    let currentCertVolunteer = null;
    const certificateModal = document.getElementById('certificateModal');
    const volunteerNameInput = document.getElementById('volunteerNameInput');
    const certificateNumberInput = document.getElementById('certificateNumberInput');
    const certificateNameDisplay = document.getElementById('certificateNameDisplay');
    const certificateNumberSpan = document.getElementById('certificateNumber');
    const previewCertBtn = document.getElementById('previewCertBtn');
    const saveAndSendCertBtn = document.getElementById('saveAndSendCertBtn');
    const closeCertModal = document.querySelector('.certificate-modal__close');
    const certificateFormatSelect = document.getElementById('certificateFormat');
    const portraitBtn = document.getElementById('portraitBtn');
    const landscapeBtn = document.getElementById('landscapeBtn');
    const certTemplate = document.getElementById('certificateTemplate');
    
    let currentOrientation = 'portrait';
    
    // Orientation switching
    function setOrientation(orientation) {
        currentOrientation = orientation;
        certTemplate.classList.remove('portrait', 'landscape');
        certTemplate.classList.add(orientation);
        
        if (orientation === 'portrait') {
            portraitBtn.classList.add('active');
            landscapeBtn.classList.remove('active');
        } else {
            landscapeBtn.classList.add('active');
            portraitBtn.classList.remove('active');
        }
    }
    
    if (portraitBtn) {
        portraitBtn.addEventListener('click', () => setOrientation('portrait'));
    }
    if (landscapeBtn) {
        landscapeBtn.addEventListener('click', () => setOrientation('landscape'));
    }
    
    if (closeCertModal) {
        closeCertModal.addEventListener('click', () => {
            certificateModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === certificateModal) certificateModal.style.display = 'none';
    });
    
    // Generate random certificate number
    function generateCertificateNumber() {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `VOL-${year}-${random}`;
    }
    
    function previewCertificate() {
        let name = volunteerNameInput.value.trim();
        if (name === '') name = 'Volunteer Name';
        if (certificateNameDisplay) certificateNameDisplay.textContent = name;
        
        // Certificate number
        let certNumber = certificateNumberInput.value.trim();
        if (certNumber === '') {
            certNumber = generateCertificateNumber();
            if (certificateNumberInput) certificateNumberInput.value = certNumber;
        }
        if (certificateNumberSpan) certificateNumberSpan.textContent = certNumber;
        
        // Year
        const currentYear = new Date().getFullYear();
        const yearSpan = document.getElementById('certificateYear');
        if (yearSpan) yearSpan.textContent = currentYear;
        
        // Issue date
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = today.toLocaleDateString('en-US', options);
        const issueDateSpan = document.getElementById('certificateIssueDate');
        if (issueDateSpan) issueDateSpan.textContent = formattedDate;
    }
    
    if (volunteerNameInput) {
        volunteerNameInput.addEventListener('input', previewCertificate);
    }
    if (certificateNumberInput) {
        certificateNumberInput.addEventListener('input', previewCertificate);
    }
    if (previewCertBtn) {
        previewCertBtn.addEventListener('click', previewCertificate);
    }
    
    async function generateAndDownload() {
        const template = document.getElementById('certificateTemplate');
        if (!template) return null;
        previewCertificate();
        
        const format = certificateFormatSelect ? certificateFormatSelect.value : 'image';
        
        try {
            // Ensure proper sizing for orientation
            const scale = 3;
            const canvas = await html2canvas(template, {
                scale: scale,
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true,
                windowWidth: template.scrollWidth,
                windowHeight: template.scrollHeight
            });
            
            const imageData = canvas.toDataURL('image/png');
            const fileName = `certificate_${currentCertVolunteer?.fullName?.replace(/\s/g, '_') || 'volunteer'}_${new Date().getFullYear()}`;
            
            if (format === 'image') {
                const link = document.createElement('a');
                link.download = `${fileName}.png`;
                link.href = imageData;
                link.click();
                return imageData;
            } else {
                const { jsPDF } = window.jspdf;
                let pdf;
                if (currentOrientation === 'portrait') {
                    pdf = new jsPDF('portrait', 'mm', 'a4');
                    const imgWidth = 210;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);
                } else {
                    pdf = new jsPDF('landscape', 'mm', 'a4');
                    const imgWidth = 297;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);
                }
                pdf.save(`${fileName}.pdf`);
                return imageData;
            }
        } catch (err) {
            console.error('Certificate generation error', err);
            alert('Failed to generate certificate. Please try again.');
            return null;
        }
    }
    
    async function saveAndSendCertificate() {
        if (!currentCertVolunteer) {
            alert('No volunteer selected.');
            return;
        }
        
        const imageData = await generateAndDownload();
        if (!imageData) return;
        
        const certNumber = certificateNumberInput ? certificateNumberInput.value : generateCertificateNumber();
        const message = `🎓 *CERTIFICATE OF VOLUNTEERING* 🎓\n\nDear ${currentCertVolunteer.fullName},\n\nCongratulations! You have been awarded a Certificate of Volunteering by Tolexars Therapy Services in recognition of your outstanding service and dedication.\n\n📜 *Your certificate has been generated and downloaded.* Please check your device's Downloads folder.\n\nCertificate No: ${certNumber}\nYear: ${new Date().getFullYear()}\n\nThank you for making a difference!\n\n- Tolexars Therapy Services Team`;
        
        const contactMethod = currentCertVolunteer.contactMethod || 'whatsapp';
        const phone = currentCertVolunteer.phone ? currentCertVolunteer.phone.replace(/\s/g, '') : '';
        const email = currentCertVolunteer.email || '';
        
        if (contactMethod === 'whatsapp' && phone) {
            let cleanPhone = phone.replace(/^0/, '234');
            if (!cleanPhone.startsWith('234')) cleanPhone = '234' + cleanPhone;
            window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
        } 
        else if (contactMethod === 'email' && email) {
            window.location.href = `mailto:${email}?subject=Your Volunteer Certificate from Tolexars&body=${encodeURIComponent(message)}`;
        }
        else if (contactMethod === 'phoneCall') {
            alert(`Please call ${currentCertVolunteer.phone} and deliver:\n\n${message}`);
        }
        else {
            alert(`No valid contact. Message to send:\n\n${message}`);
        }
        
        setTimeout(() => {
            if (certificateModal) certificateModal.style.display = 'none';
        }, 1500);
    }
    
    if (saveAndSendCertBtn) {
        saveAndSendCertBtn.addEventListener('click', saveAndSendCertificate);
    }
    
    function handleCertificate(appId) {
        const application = allApplications.find(app => app.id === appId);
        if (!application) {
            alert('Application not found');
            return;
        }
        currentCertVolunteer = application;
        if (volunteerNameInput) volunteerNameInput.value = application.fullName || '';
        if (certificateNumberInput) certificateNumberInput.value = generateCertificateNumber();
        previewCertificate();
        if (certificateModal) certificateModal.style.display = 'flex';
    }
    
    // Attach events to dynamic buttons
    function attachCardEvents() {
        document.querySelectorAll('.btn-approve').forEach(btn => {
            btn.removeEventListener('click', handleApprove);
            btn.addEventListener('click', handleApprove);
        });
        document.querySelectorAll('.btn-contact').forEach(btn => {
            btn.removeEventListener('click', handleContact);
            btn.addEventListener('click', handleContact);
        });
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.removeEventListener('click', handleRemove);
            btn.addEventListener('click', handleRemove);
        });
        document.querySelectorAll('.btn-certificate').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', () => handleCertificate(newBtn.getAttribute('data-id')));
        });
    }
    
    // Search listeners
    if (searchPending) {
        searchPending.addEventListener('input', () => renderPendingList());
    }
    if (searchApproved) {
        searchApproved.addEventListener('input', () => renderApprovedList());
    }
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (tabId === 'pending') {
                pendingTab.classList.add('active');
                approvedTab.classList.remove('active');
                renderPendingList();
            } else {
                approvedTab.classList.add('active');
                pendingTab.classList.remove('active');
                renderApprovedList();
            }
        });
    });
    
    // Initial preview on load (sets default values)
    if (volunteerNameInput && volunteerNameInput.value === '') {
        volunteerNameInput.value = 'Sample Volunteer';
        previewCertificate();
    }
});