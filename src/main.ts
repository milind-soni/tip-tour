import { callLMStudio } from './lmstudio';
import { SimpleWorkflowManager } from './simpleWorkflow';

class AITooltip {
    private tooltip: HTMLElement;
    private tooltipMessage: HTMLElement;
    private tooltipInput: HTMLInputElement;
    private arrow: HTMLElement;
    private buttonOne: HTMLElement;
    private buttonTwo: HTMLElement;
    private buttonThree: HTMLElement;
    private buttonFour: HTMLElement;
    private buttonFive: HTMLElement;
    private workflowManager: SimpleWorkflowManager;
    private currentTarget: HTMLElement | null = null;
    private isHoveringTarget = false;
    private isVisible = false;
    private mouseX = 0;
    private mouseY = 0;
    private hideTimeout: ReturnType<typeof setTimeout> | null = null;

    constructor() {
        this.tooltip = document.getElementById('tooltip')!;
        this.tooltipMessage = document.getElementById('tooltip-message')!;
        this.tooltipInput = document.getElementById('tooltip-input') as HTMLInputElement;
        this.arrow = document.getElementById('tooltip-arrow')!;
        this.buttonOne = document.getElementById('button-one')!;
        this.buttonTwo = document.getElementById('button-two')!;
        this.buttonThree = document.getElementById('button-three')!;
        this.buttonFour = document.getElementById('button-four')!;
        this.buttonFive = document.getElementById('button-five')!;
        
        this.workflowManager = new SimpleWorkflowManager();
        this.workflowManager.setTooltipReference(this);
        this.init();
    }

    private init() {
        this.setupMouseTracking();
        this.setupKeyboardHandling();
        this.setupInputHandling();
        this.setupButtons();
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
                    this.updateArrow();
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
        return await this.workflowManager.handleCommand(prompt);
    }

    private showTooltip() {
        if (!this.isVisible) {
            this.isVisible = true;
            this.tooltip.classList.add('visible');
            this.updateArrow(); // Update arrow when tooltip becomes visible
            
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
            this.tooltipMessage.textContent = 'AI Assistant ready - try "bake a cake" or "make pizza"!';
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
    
    private setupButtons() {
        const buttons = [this.buttonOne, this.buttonTwo, this.buttonThree, this.buttonFour, this.buttonFive];
        
        buttons.forEach((button, index) => {
            const buttonNum = index + 1;
            
            button.addEventListener('click', async () => {
                button.textContent = `✓ Button ${buttonNum}`;
                button.style.background = '#e8f5e9';
                
                // If in workflow and this is the target button, auto-advance
                if (this.workflowManager.isWorkflowActive() && this.currentTarget === button) {
                    const result = this.workflowManager.autoAdvance();
                    this.tooltipMessage.textContent = result;
                }
                
                setTimeout(() => {
                    button.textContent = `Button ${buttonNum}`;
                    button.style.background = '#ffffff';
                }, 2000);
            });
            
            // Add hover detection
            button.addEventListener('mouseenter', () => {
                if (this.currentTarget === button) {
                    this.isHoveringTarget = true;
                    this.updateArrow();
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (this.currentTarget === button) {
                    this.isHoveringTarget = false;
                    this.updateArrow();
                }
            });
        });
        
        // Set initial target to button one
        this.currentTarget = this.buttonOne;
    }
    
    private updateArrow() {
        if (!this.isVisible || !this.currentTarget) return;
        
        // Get tooltip center position
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const tooltipCenterX = tooltipRect.left + tooltipRect.width / 2;
        const tooltipCenterY = tooltipRect.top + tooltipRect.height / 2;
        
        // Get current target button center position
        const buttonRect = this.currentTarget.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;
        
        // Calculate angle and distance
        const deltaX = buttonCenterX - tooltipCenterX;
        const deltaY = buttonCenterY - tooltipCenterY;
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Rotate V arrow (arrow points right by default at 0 degrees)
        const vArrow = this.arrow.querySelector('.v-arrow') as HTMLElement;
        const arrowPath = this.arrow.querySelector('.arrow-path') as SVGPathElement;
        
        if (vArrow && arrowPath) {
            // Enhanced scaling - more dramatic as you get closer
            let scale = 1;
            if (this.isHoveringTarget) {
                scale = 1.5; // Big when hovering
                arrowPath.setAttribute('stroke', '#10b981'); // Green when hovering
            } else {
                // Progressive scaling based on distance
                if (distance < 50) {
                    scale = 1.4;
                } else if (distance < 100) {
                    scale = 1.3;
                } else if (distance < 150) {
                    scale = 1.2;
                } else if (distance < 250) {
                    scale = 1.1;
                } else if (distance < 350) {
                    scale = 1.05;
                }
                arrowPath.setAttribute('stroke', '#1a1a1a'); // Black when not hovering
            }
            
            vArrow.style.transform = `rotate(${angle}deg) scale(${scale})`;
        }
    }
    
    // Public method for workflow manager to control arrow pointing
    public setCurrentTarget(target: HTMLElement) {
        this.currentTarget = target;
        this.updateArrow();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AITooltip();
});