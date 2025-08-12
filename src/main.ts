import { callOpenAI } from './api';

class AITooltip {
    private tooltip: HTMLElement;
    private tooltipMessage: HTMLElement;
    private tooltipInput: HTMLInputElement;
    private compass: HTMLElement;
    private targetButton: HTMLElement;
    private isVisible = false;
    private mouseX = 0;
    private mouseY = 0;
    private hideTimeout: ReturnType<typeof setTimeout> | null = null;

    constructor() {
        this.tooltip = document.getElementById('tooltip')!;
        this.tooltipMessage = document.getElementById('tooltip-message')!;
        this.tooltipInput = document.getElementById('tooltip-input') as HTMLInputElement;
        this.compass = document.getElementById('tooltip-compass')!;
        this.targetButton = document.getElementById('target-button')!;
        
        this.init();
    }

    private init() {
        this.setupMouseTracking();
        this.setupKeyboardHandling();
        this.setupInputHandling();
        this.setupTargetButton();
    }

    private setupMouseTracking() {
        let mouseMoveTimeout: ReturnType<typeof setTimeout>;
        let animationFrameId: number;
        let isUpdating = false;

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Show tooltip immediately on mouse move
            this.showTooltip();
            
            // Use RAF for smooth position updates without throttling
            if (!isUpdating) {
                isUpdating = true;
                animationFrameId = requestAnimationFrame(() => {
                    this.updateTooltipPosition();
                    this.updateCompass();
                    isUpdating = false;
                });
            }

            clearTimeout(mouseMoveTimeout);
            // Don't set hide timer if input is focused or has content
            if (document.activeElement !== this.tooltipInput && !this.tooltipInput.value.trim()) {
                mouseMoveTimeout = setTimeout(() => {
                    this.hideTooltip();
                }, 5000); // 5 seconds timeout
            }
        });
    }

    private setupKeyboardHandling() {
        document.addEventListener('keydown', (e) => {
            if (!this.isVisible) return;
            
            if (e.key === 'Escape') {
                this.hideTooltip();
                return;
            }

            if (e.key.length === 1 || e.key === 'Backspace') {
                if (document.activeElement !== this.tooltipInput) {
                    this.tooltipInput.focus();
                }
            }
        });
    }

    private setupInputHandling() {
        this.tooltipInput.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                const userInput = this.tooltipInput.value.trim();
                if (!userInput) return;

                this.tooltipInput.value = '';
                await this.handleUserInput(userInput);
            }
        });

        this.tooltipInput.addEventListener('input', () => {
            // Clear any hide timeout while typing
            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
                this.hideTimeout = null;
            }
            this.showTooltip();
        });
        
        // Keep tooltip visible when input is focused
        this.tooltipInput.addEventListener('focus', () => {
            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
                this.hideTimeout = null;
            }
            this.showTooltip();
        });
        
        // Only allow hiding when input loses focus AND is empty
        this.tooltipInput.addEventListener('blur', () => {
            if (!this.tooltipInput.value.trim()) {
                this.hideTimeout = setTimeout(() => {
                    this.hideTooltip();
                }, 3000);
            }
        });
    }

    private async handleUserInput(input: string) {
        // Show loading immediately
        this.tooltipMessage.innerHTML = '<div class="loading">Processing your request...</div>';
        
        // Keep tooltip visible during API call
        this.showTooltip();
        
        try {
            const response = await this.callAI(input);
            this.tooltipMessage.textContent = response;
            // Keep tooltip visible after response for at least 10 seconds for reading
            this.showTooltip();
            
            // Extend visibility for reading the response
            setTimeout(() => {
                if (this.isVisible && document.activeElement !== this.tooltipInput) {
                    // Allow natural hide after reading time
                }
            }, 10000);
        } catch (error) {
            this.tooltipMessage.textContent = 'Sorry, I encountered an error. Please try again.';
            console.error('AI API Error:', error);
        }
    }

    private async callAI(prompt: string): Promise<string> {
        return await callOpenAI(prompt);
    }

    private showTooltip() {
        if (!this.isVisible) {
            this.isVisible = true;
            this.tooltip.classList.add('visible');
            this.updateCompass(); // Update compass when tooltip becomes visible
            
            setTimeout(() => {
                if (this.isVisible && document.activeElement !== this.tooltipInput) {
                    this.tooltipInput.focus();
                }
            }, 100);
        }
    }

    private hideTooltip() {
        // Don't hide if input is focused or has content
        if (document.activeElement === this.tooltipInput || this.tooltipInput.value.trim()) {
            return;
        }
        
        if (this.isVisible) {
            this.isVisible = false;
            this.tooltip.classList.remove('visible');
            this.tooltipInput.blur();
            this.tooltipMessage.textContent = 'AI Assistant ready - start typing your question!';
        }
    }

    private updateTooltipPosition() {
        const offset = 20;
        // Cache dimensions to avoid reflow
        const tooltipWidth = this.tooltip.offsetWidth;
        const tooltipHeight = this.tooltip.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        let left = this.mouseX + offset;
        let top = this.mouseY + offset;

        // Smart positioning to avoid edges
        if (left + tooltipWidth > windowWidth) {
            left = this.mouseX - tooltipWidth - offset;
        }
        
        if (top + tooltipHeight > windowHeight) {
            top = this.mouseY - tooltipHeight - offset;
        }

        left = Math.max(10, left);
        top = Math.max(10, top);

        // Use transform for best performance
        this.tooltip.style.transform = `translate(${left}px, ${top}px)`;
    }
    
    private setupTargetButton() {
        this.targetButton.addEventListener('click', () => {
            // Fun interaction when button is clicked
            this.targetButton.textContent = '🎉 You found me! Nice navigation!';
            this.targetButton.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
            
            setTimeout(() => {
                this.targetButton.textContent = '🎯 Find me if you can!';
                this.targetButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }, 3000);
        });
    }
    
    private updateCompass() {
        if (!this.isVisible) return;
        
        // Get tooltip center position
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const tooltipCenterX = tooltipRect.left + tooltipRect.width / 2;
        const tooltipCenterY = tooltipRect.top + tooltipRect.height / 2;
        
        // Get target button center position
        const buttonRect = this.targetButton.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;
        
        // Calculate angle and distance
        const deltaX = buttonCenterX - tooltipCenterX;
        const deltaY = buttonCenterY - tooltipCenterY;
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Rotate compass arrow (subtract 90 degrees since arrow points up by default)
        const compassArrow = this.compass.querySelector('.compass-arrow') as HTMLElement;
        if (compassArrow) {
            compassArrow.style.transform = `rotate(${angle + 90}deg)`;
            
            // Scale based on distance - closer = bigger
            if (distance < 150) {
                // Very close - scale up
                compassArrow.style.transform = `rotate(${angle + 90}deg) scale(1.2)`;
            } else if (distance < 300) {
                // Medium distance
                compassArrow.style.transform = `rotate(${angle + 90}deg) scale(1.1)`;
            } else {
                // Far away - normal size
                compassArrow.style.transform = `rotate(${angle + 90}deg) scale(1)`;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AITooltip();
});