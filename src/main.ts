class AITooltip {
    private tooltip: HTMLElement;
    private tooltipMessage: HTMLElement;
    private tooltipInput: HTMLInputElement;
    private isVisible = false;
    private mouseX = 0;
    private mouseY = 0;

    constructor() {
        this.tooltip = document.getElementById('tooltip')!;
        this.tooltipMessage = document.getElementById('tooltip-message')!;
        this.tooltipInput = document.getElementById('tooltip-input') as HTMLInputElement;
        
        this.init();
    }

    private init() {
        this.setupMouseTracking();
        this.setupKeyboardHandling();
        this.setupInputHandling();
    }

    private setupMouseTracking() {
        let mouseMoveTimeout: number;
        let animationFrameId: number;

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            this.showTooltip();
            
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                this.updateTooltipPosition();
            });

            clearTimeout(mouseMoveTimeout);
            mouseMoveTimeout = setTimeout(() => {
                this.hideTooltip();
            }, 2000);
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
            if (this.tooltipInput.value.trim()) {
                this.showTooltip();
            }
        });
    }

    private async handleUserInput(input: string) {
        this.tooltipMessage.innerHTML = '<div class="loading">Processing your request...</div>';
        
        try {
            const response = await this.callAI(input);
            this.tooltipMessage.textContent = response;
        } catch (error) {
            this.tooltipMessage.textContent = 'Sorry, I encountered an error. Please try again.';
            console.error('AI API Error:', error);
        }
    }

    private async callAI(prompt: string): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const responses = [
            `I understand you asked about "${prompt}". This is a demo response from the AI assistant.`,
            `Great question about "${prompt}"! In a real implementation, this would connect to an actual AI API.`,
            `Regarding "${prompt}" - this tooltip demonstrates how AI can provide contextual assistance while following your mouse.`,
            `You mentioned "${prompt}". This AI tooltip can be integrated with any language model API for real responses.`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    private showTooltip() {
        if (!this.isVisible) {
            this.isVisible = true;
            this.tooltip.classList.add('visible');
            
            setTimeout(() => {
                if (this.isVisible && document.activeElement !== this.tooltipInput) {
                    this.tooltipInput.focus();
                }
            }, 100);
        }
    }

    private hideTooltip() {
        if (this.isVisible) {
            this.isVisible = false;
            this.tooltip.classList.remove('visible');
            this.tooltipInput.blur();
            this.tooltipMessage.textContent = 'AI Assistant ready - start typing your question!';
        }
    }

    private updateTooltipPosition() {
        const offset = 20;
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        let left = this.mouseX + offset;
        let top = this.mouseY + offset;

        if (left + tooltipRect.width > window.innerWidth) {
            left = this.mouseX - tooltipRect.width - offset;
        }
        
        if (top + tooltipRect.height > window.innerHeight) {
            top = this.mouseY - tooltipRect.height - offset;
        }

        left = Math.max(10, left);
        top = Math.max(10, top);

        this.tooltip.style.transform = `translate(${left}px, ${top}px)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AITooltip();
});