// Price Alert - GitHub Pages
// JavaScript functionality for Sign Up, Sign In, and Dashboard pages

document.addEventListener('DOMContentLoaded', function() {
    // Initialize based on current page
    const page = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(page) {
        case 'signup.html':
            initSignupForm();
            break;
        case 'signin.html':
            initSigninForm();
            break;
        case 'dashboard.html':
            initDashboard();
            break;
    }
});

// Sign Up Form
function initSignupForm() {
    const form = document.getElementById('signupForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Basic validation
            if (password !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters!', 'error');
                return;
            }
            
            // Store user data (simulated - in real app, this would be an API call)
            const userData = {
                name: name,
                email: email,
                password: password
            };
            
            localStorage.setItem('priceAlertUser', JSON.stringify(userData));
            showNotification('Account created successfully! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'signin.html';
            }, 1500);
        });
    }
}

// Sign In Form
function initSigninForm() {
    const form = document.getElementById('signinForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Get stored user data
            const storedUser = localStorage.getItem('priceAlertUser');
            
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                
                if (userData.email === email && userData.password === password) {
                    // Store session
                    localStorage.setItem('priceAlertSession', JSON.stringify({
                        name: userData.name,
                        email: userData.email
                    }));
                    
                    showNotification('Login successful! Redirecting...', 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    showNotification('Invalid email or password!', 'error');
                }
            } else {
                // For demo purposes, allow any login
                localStorage.setItem('priceAlertSession', JSON.stringify({
                    name: 'Demo User',
                    email: email
                }));
                
                showNotification('Login successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }
        });
    }
}

// Dashboard
function initDashboard() {
    // Check if user is logged in
    const session = localStorage.getItem('priceAlertSession');
    
    if (!session) {
        window.location.href = 'signin.html';
        return;
    }
    
    const userData = JSON.parse(session);
    
    // Update user name in sidebar
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
        el.textContent = userData.name;
    });
    
    // Update avatar
    const avatarElements = document.querySelectorAll('.avatar');
    avatarElements.forEach(el => {
        const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        el.textContent = initials || 'U';
    });
    
    // Update email
    const userEmailElements = document.querySelectorAll('.user-email');
    userEmailElements.forEach(el => {
        el.textContent = userData.email;
    });
    
    // Add logout functionality
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'logout-btn';
    logoutBtn.innerHTML = '🚪 Logout';
    logoutBtn.style.cssText = `
        margin-top: auto;
        padding: 12px 20px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        cursor: pointer;
        border-radius: 8px;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    `;
    
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('priceAlertSession');
        window.location.href = 'signin.html';
    });
    
    logoutBtn.addEventListener('mouseover', function() {
        this.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    logoutBtn.addEventListener('mouseout', function() {
        this.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.appendChild(logoutBtn);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#667eea'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    closeBtn.addEventListener('click', () => notification.remove());
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Utility Functions
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function setUrlParameter(name, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
}

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('priceAlertSession') !== null;
}

// Logout function (global)
function logout() {
    localStorage.removeItem('priceAlertSession');
    window.location.href = 'signin.html';
}

