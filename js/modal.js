// Modal module - handles modal open/close and accessibility
window.ModalModule = (function() {
    'use strict';
    
    let modalOverlay, modalContent, modalClose, modalBody;
    let isOpen = false;
    let previousFocus = null;
    
    function init() {
        modalOverlay = document.getElementById('modalOverlay');
        modalContent = document.getElementById('modalContent');
        modalClose = document.getElementById('modalClose');
        modalBody = document.getElementById('modalBody');
        
        // Close button
        modalClose.addEventListener('click', close);
        
        // Click outside to close
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                close();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                close();
            }
        });
        
        // Trap focus in modal
        modalContent.addEventListener('keydown', trapFocus);
    }
    
    function open(content, callback) {
        previousFocus = document.activeElement;
        
        modalBody.innerHTML = content;
        modalOverlay.classList.add('active');
        isOpen = true;
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus close button
        setTimeout(() => {
            modalClose.focus();
            if (callback) callback();
        }, 100);
    }
    
    function close() {
        modalOverlay.classList.remove('active');
        isOpen = false;
        
        // Re-enable body scroll
        document.body.style.overflow = '';
        
        // Clear content after animation
        setTimeout(() => {
            modalBody.innerHTML = '';
        }, 400);
        
        // Restore focus
        if (previousFocus) {
            previousFocus.focus();
        }
    }
    
    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        
        const focusableElements = modalContent.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    return {
        init,
        open,
        close
    };
})();
