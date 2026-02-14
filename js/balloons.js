// Balloons module - handles balloon rendering and positioning
window.BalloonsModule = (function() {
    'use strict';
    
    const BALLOON_VARIANTS = ['pink', 'lavender', 'peach'];
    const BALLOON_ICONS = {
        photo: '📷',
        video: '🎬',
        game: '🎲',
        calendar: '📅'
    };
    
    // Predefined positions for balloons (percentage-based for responsiveness)
    const BALLOON_POSITIONS = [
        { left: 10, top: 15 },
        { left: 25, top: 35 },
        { left: 15, top: 60 },
        { left: 75, top: 20 },
        { left: 85, top: 50 },
        { left: 65, top: 65 },
        { left: 45, top: 25 },
        { left: 55, top: 55 },
        { left: 35, top: 75 },
        { left: 50, top: 10 }
    ];
    
    function renderBalloons(balloons, onClickCallback) {
        const container = document.getElementById('balloonsContainer');
        container.innerHTML = '';
        
        balloons.forEach((balloon, index) => {
            const balloonElement = createBalloonElement(balloon, index, onClickCallback);
            container.appendChild(balloonElement);
        });
    }
    
    function createBalloonElement(balloon, index, onClickCallback) {
        const balloonDiv = document.createElement('div');
        balloonDiv.className = 'balloon';
        balloonDiv.setAttribute('data-balloon-id', balloon.id);
        balloonDiv.setAttribute('data-variant', BALLOON_VARIANTS[index % BALLOON_VARIANTS.length]);
        balloonDiv.setAttribute('role', 'button');
        balloonDiv.setAttribute('tabindex', '0');
        balloonDiv.setAttribute('aria-label', `${balloon.label} balloon`);
        
        // Position balloon
        const position = BALLOON_POSITIONS[index % BALLOON_POSITIONS.length];
        balloonDiv.style.left = position.left + '%';
        balloonDiv.style.top = position.top + '%';
        
        // Create balloon structure
        balloonDiv.innerHTML = `
            <div class="balloon-shape"></div>
            <div class="balloon-string"></div>
            <div class="balloon-icon" aria-hidden="true">${BALLOON_ICONS[balloon.type] || '💝'}</div>
        `;
        
        // Add click event
        balloonDiv.addEventListener('click', () => {
            if (!balloonDiv.classList.contains('popped')) {
                onClickCallback(balloon.id);
            }
        });
        
        // Add keyboard support
        balloonDiv.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !balloonDiv.classList.contains('popped')) {
                e.preventDefault();
                onClickCallback(balloon.id);
            }
        });
        
        return balloonDiv;
    }
    
    return {
        renderBalloons
    };
})();
