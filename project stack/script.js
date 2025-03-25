document.addEventListener('DOMContentLoaded', function() {
    const appointmentForm = document.getElementById('appointmentForm');
    const appointmentsList = document.getElementById('appointmentsList');
    
    // Load saved appointments from localStorage
    loadAppointments();
    
    // Form submission
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const mobile = document.getElementById('mobile').value;
        const email = document.getElementById('email').value;
        const age = document.getElementById('age').value;
        const gender = document.getElementById('gender').value;
        const appointmentTime = document.getElementById('appointmentTime').value;
        
        // Create appointment object
        const appointment = {
            id: Date.now(), // Unique ID based on timestamp
            name,
            mobile,
            email,
            age,
            gender,
            appointmentTime
        };
        
        // Save appointment
        saveAppointment(appointment);
        
        // Add to UI
        addAppointmentToUI(appointment);
        
        // Reset form
        appointmentForm.reset();
        
        // Show success animation
        showSuccessAnimation();
    });
    
    // Event delegation for edit and delete buttons
    appointmentsList.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-delete')) {
            const appointmentId = parseInt(e.target.getAttribute('data-id'));
            deleteAppointment(appointmentId);
        }
        
        if (e.target.classList.contains('btn-edit')) {
            const appointmentId = parseInt(e.target.getAttribute('data-id'));
            editAppointment(appointmentId);
        }
    });
    
    // Save appointment to localStorage
    function saveAppointment(appointment) {
        let appointments = getAppointmentsFromStorage();
        appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }
    
    // Get appointments from localStorage
    function getAppointmentsFromStorage() {
        let appointments;
        if (localStorage.getItem('appointments') === null) {
            appointments = [];
        } else {
            appointments = JSON.parse(localStorage.getItem('appointments'));
        }
        return appointments;
    }
    
    // Load appointments from localStorage
    function loadAppointments() {
        const appointments = getAppointmentsFromStorage();
        
        appointments.forEach(appointment => {
            addAppointmentToUI(appointment);
        });
    }
    
    // Add appointment to UI
    function addAppointmentToUI(appointment) {
        // Format date for display
        const appointmentDate = new Date(appointment.appointmentTime);
        const formattedDate = appointmentDate.toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Create appointment card
        const appointmentCard = document.createElement('div');
        appointmentCard.classList.add('appointment-card');
        appointmentCard.setAttribute('data-id', appointment.id);
        appointmentCard.style.opacity = '0';
        
        appointmentCard.innerHTML = `
            <div class="appointment-name">${appointment.name}</div>
            <div class="appointment-details">
                <div class="appointment-detail">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    ${appointment.mobile}
                </div>
                <div class="appointment-detail">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    ${appointment.email}
                </div>
                <div class="appointment-detail">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Age: ${appointment.age} | Gender: ${appointment.gender}
                </div>
                <div class="appointment-detail">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ${formattedDate}
                </div>
            </div>
            <div class="appointment-actions">
                <button class="btn-edit" data-id="${appointment.id}">Edit</button>
                <button class="btn-delete" data-id="${appointment.id}">Delete</button>
            </div>
        `;
        
        appointmentsList.appendChild(appointmentCard);
        
        // Animate the card entrance
        setTimeout(() => {
            appointmentCard.style.opacity = '1';
            appointmentCard.style.animation = 'slideIn 0.5s ease-out forwards';
        }, 10);
    }
    
    // Delete appointment
    function deleteAppointment(id) {
        const appointmentCard = document.querySelector(`.appointment-card[data-id="${id}"]`);
        
        // Animate removal
        appointmentCard.style.animation = 'fadeIn 0.5s ease-out reverse forwards';
        
        setTimeout(() => {
            appointmentCard.remove();
        }, 500);
        
        // Remove from localStorage
        removeAppointmentFromStorage(id);
    }
    
    // Remove appointment from localStorage
    function removeAppointmentFromStorage(id) {
        let appointments = getAppointmentsFromStorage();
        
        appointments = appointments.filter(appointment => appointment.id !== id);
        
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }
    
    // Edit appointment
    function editAppointment(id) {
        const appointments = getAppointmentsFromStorage();
        const appointment = appointments.find(app => app.id === id);
        
        if (appointment) {
            // Fill form with appointment data
            document.getElementById('name').value = appointment.name;
            document.getElementById('mobile').value = appointment.mobile;
            document.getElementById('email').value = appointment.email;
            document.getElementById('age').value = appointment.age;
            document.getElementById('gender').value = appointment.gender;
            document.getElementById('appointmentTime').value = appointment.appointmentTime;
            
            // Remove the appointment
            deleteAppointment(id);
            
            // Scroll to form
            document.querySelector('.booking-card').scrollIntoView({ behavior: 'smooth' });
            
            // Highlight the form
            const bookingCard = document.querySelector('.booking-card');
            bookingCard.style.animation = 'pulse 0.8s ease-in-out';
            
            setTimeout(() => {
                bookingCard.style.animation = '';
            }, 800);
        }
    }
    
    // Show success animation
    function showSuccessAnimation() {
        const btn = document.querySelector('.btn-book');
        const originalText = btn.textContent;
        
        btn.textContent = 'Appointment Booked!';
        btn.style.background = 'linear-gradient(to right, #00c853, #64dd17)';
        btn.style.animation = 'pulse 0.8s ease-in-out';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.animation = '';
        }, 2000);
    }
    
    // Add sample appointment if none exist
    if (getAppointmentsFromStorage().length === 0) {
        const sampleAppointment = {
            id: 1,
            name: 'Sourjya Biswas',
            mobile: '8100015496',
            email: 'sourjyabiswas03@gmail.com',
            age: '20',
            gender: 'Male',
            appointmentTime: '2025-03-30T12:00'
        };
        
        saveAppointment(sampleAppointment);
        addAppointmentToUI(sampleAppointment);
    }
    
    // Add input animation
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.querySelector('.input-highlight').style.width = '100%';
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.querySelector('.input-highlight').style.width = '0';
            }
        });
    });
});