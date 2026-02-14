// Main application initialization
(function() {
    'use strict';
    
    let contentData = null;
    let balloonStates = new Map();
    
    // Initialize application
    async function init() {
        try {
            // Load content data
            contentData = await loadContent();
            
            // Set site title and subtitle
            document.getElementById('siteTitle').textContent = contentData.siteTitle;
            document.getElementById('siteSubtitle').textContent = contentData.siteSubtitle;
            
            // Initialize balloon states
            contentData.balloons.forEach(balloon => {
                balloonStates.set(balloon.id, { popped: false });
            });
            
            // Render balloons
            window.BalloonsModule.renderBalloons(contentData.balloons, handleBalloonClick);
            
            // Setup reset button
            document.getElementById('resetButton').addEventListener('click', handleReset);
            
            // Setup modal
            window.ModalModule.init();
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            showError('Failed to load content. Please refresh the page.');
        }
    }
    
    // Load content from JSON
    async function loadContent() {
        const response = await fetch('./data/content.json');
        if (!response.ok) {
            throw new Error('Failed to load content');
        }
        return response.json();
    }
    
    // Handle balloon click
    async function handleBalloonClick(balloonId) {
        const balloon = contentData.balloons.find(b => b.id === balloonId);
        if (!balloon) return;
        
        // Mark as popped
        balloonStates.set(balloonId, { popped: true });
        
        // Create pop animation
        const balloonElement = document.querySelector(`[data-balloon-id="${balloonId}"]`);
        if (balloonElement) {
            createPopEffect(balloonElement);
            balloonElement.classList.add('popped');
        }
        
        // Wait for pop animation
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Open modal with content
        openBalloonContent(balloon);
    }
    
    // Create pop particle effect
    function createPopEffect(balloonElement) {
        const rect = balloonElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const colors = ['#ff9ebc', '#d4c5f9', '#ffe5d9', '#ffc4d6'];
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 50 + Math.random() * 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            
            document.getElementById('particlesContainer').appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
    }
    
    // Open balloon content in modal
    function openBalloonContent(balloon) {
        let content = '';
        
        switch (balloon.type) {
            case 'photo':
                content = createPhotoContent(balloon);
                break;
            case 'video':
                content = createVideoContent(balloon);
                break;
            case 'game':
                content = '<div id="gameContainer"></div>';
                window.ModalModule.open(content, () => {
                    window.GameModule.init(contentData.gameConfig, contentData.moments);
                });
                return;
            case 'calendar':
                content = '<div id="calendarContainer"></div>';
                window.ModalModule.open(content, () => {
                    window.CalendarModule.init(contentData.moments);
                });
                return;
        }
        
        window.ModalModule.open(content);
    }
    
    // Create photo modal content
    function createPhotoContent(balloon) {
        const moment = balloon.momentId ? 
            contentData.moments.find(m => m.id === balloon.momentId) : null;
        
        return `
            <div class="photo-modal">
                <img src="${balloon.asset}" alt="${balloon.label}" loading="lazy">
                <p class="message">${balloon.message}</p>
                ${moment ? `<p class="date">${formatDate(moment.date)}</p>` : ''}
            </div>
        `;
    }
    
    // Create video modal content
    function createVideoContent(balloon) {
        return `
            <div class="video-modal">
                <video controls preload="metadata">
                    <source src="${balloon.asset}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <p class="caption">${balloon.label}</p>
                <p class="message">${balloon.message}</p>
            </div>
        `;
    }
    
    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Handle reset
    function handleReset() {
        // Reset all balloon states
        balloonStates.forEach((state, id) => {
            state.popped = false;
        });
        
        // Re-render balloons
        window.BalloonsModule.renderBalloons(contentData.balloons, handleBalloonClick);
        
        // Clear particles
        document.getElementById('particlesContainer').innerHTML = '';
    }
    
    // Show error message
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff6b6b;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 9999;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }
    
    // Start the app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
