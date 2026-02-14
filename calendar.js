// Calendar module - Journey timeline view
window.CalendarModule = (function() {
    'use strict';
    
    let moments = [];
    let currentFilter = 'all';
    let storyModeActive = false;
    let storyIndex = 0;
    
    function init(momentsData) {
        moments = momentsData.sort((a, b) => new Date(a.date) - new Date(b.date));
        render();
    }
    
    function render() {
        const container = document.getElementById('calendarContainer');
        container.className = 'calendar-container';
        
        container.innerHTML = `
            <h2 class="calendar-title">Our Journey Timeline</h2>
            <div class="calendar-filters">
                <button class="filter-button ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">
                    All Moments
                </button>
                <button class="filter-button ${currentFilter === 'high' ? 'active' : ''}" data-filter="high">
                    Highs ✨
                </button>
                <button class="filter-button ${currentFilter === 'low' ? 'active' : ''}" data-filter="low">
                    Lows & Apologies 💕
                </button>
            </div>
            <div class="timeline" id="timeline"></div>
            <button class="story-mode-button" id="storyModeButton">
                ${storyModeActive ? 'Exit Story Mode' : '▶️ Story Mode'}
            </button>
        `;
        
        // Add filter event listeners
        container.querySelectorAll('.filter-button').forEach(button => {
            button.addEventListener('click', () => {
                currentFilter = button.dataset.filter;
                render();
            });
        });
        
        // Add story mode listener
        document.getElementById('storyModeButton').addEventListener('click', toggleStoryMode);
        
        renderTimeline();
    }
    
    function renderTimeline() {
        const timeline = document.getElementById('timeline');
        const filteredMoments = moments.filter(moment => {
            if (currentFilter === 'all') return true;
            return moment.mood === currentFilter;
        });
        
        timeline.innerHTML = filteredMoments.map((moment, index) => `
            <div class="timeline-item ${moment.mood}" style="--item-index: ${index}">
                <div class="timeline-content" data-moment-id="${moment.id}">
                    <div class="timeline-date">${formatDate(moment.date)}</div>
                    <h3 class="timeline-title">${moment.title}</h3>
                    <p class="timeline-description">${moment.description}</p>
                    ${moment.mood === 'low' && moment.apology ? `
                        <div class="timeline-apology">
                            💕 ${moment.apology}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        // Add click listeners to timeline items
        timeline.querySelectorAll('.timeline-content').forEach(item => {
            item.addEventListener('click', () => {
                const momentId = item.dataset.momentId;
                highlightMoment(momentId);
            });
        });
    }
    
    function highlightMoment(momentId) {
        // Remove existing highlights
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.style.transform = '';
        });
        
        // Highlight clicked item
        const targetItem = document.querySelector(`[data-moment-id="${momentId}"]`).closest('.timeline-item');
        targetItem.style.transform = 'scale(1.02)';
        targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
            targetItem.style.transform = '';
        }, 2000);
    }
    
    function toggleStoryMode() {
        storyModeActive = !storyModeActive;
        
        if (storyModeActive) {
            storyIndex = 0;
            playStory();
        } else {
            storyIndex = 0;
            render();
        }
    }
    
    function playStory() {
        if (storyIndex >= moments.length) {
            storyModeActive = false;
            storyIndex = 0;
            render();
            return;
        }
        
        const moment = moments[storyIndex];
        highlightMoment(moment.id);
        
        storyIndex++;
        
        // Auto-advance after 3 seconds
        setTimeout(() => {
            if (storyModeActive) {
                playStory();
            }
        }, 3000);
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    return {
        init
    };
})();
