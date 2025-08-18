import { callLMStudio } from './lmstudio';

interface WorkflowStep {
    button: number;
    action: string;
    description: string;
    tips?: string[];
}

interface Workflow {
    id: string;
    name: string;
    description: string;
    context: string;
    steps: WorkflowStep[];
}

// Fun workflows!
const workflows: Workflow[] = [
    {
        id: "cake",
        name: "Bake a Cake",
        description: "Create a Cake",
        context: "You are a quirky, enthusiastic baking assistant with a sense of humor. You can bake.",
        steps: [
            { 
                button: 3, 
                action: "Mix flour", 
                description: "Mix the flour"
            },
            { 
                button: 1, 
                action: "Add colors", 
                description: "Add food coloring"
            },
            { 
                button: 5, 
                action: "Pour into pans", 
                description: "Pour batter into pans"
            },
            { 
                button: 2, 
                action: "Bake", 
                description: "Put in oven"
            }
        ]
    },
    {
        id: "superhero",
        name: "Become a Superhero (Office Edition)",
        description: "Transform from boring office human into CAPTAIN PRODUCTIVITY!",
        context: "You are a superhero mentor with a great sense of humor. Everything should sound epic and over-the-top, but about mundane office tasks.",
        steps: [
            { 
                button: 2, 
                action: "Get ready", 
                description: "Prepare workspace"
            },
            { 
                button: 4, 
                action: "Get coffee", 
                description: "Make some coffee"
            },
            { 
                button: 1, 
                action: "Clean desk", 
                description: "Organize your desk"
            },
            { 
                button: 3, 
                action: "Do tasks", 
                description: "Work on your tasks"
            }
        ]
    },
    {
        id: "pizza",
        name: "Create the Ultimate Pizza Masterpiece",
        description: "Build a pizza so amazing that even the Italians will cry tears of joy!",
        context: "You are a passionate pizza chef who takes pizza VERY seriously but is also completely ridiculous. Everything about pizza is life or death dramatic.",
        steps: [
            { 
                button: 1, 
                action: "Make dough", 
                description: "Knead the dough"
            },
            { 
                button: 4, 
                action: "Add sauce", 
                description: "Spread tomato sauce"
            },
            { 
                button: 5, 
                action: "Add cheese", 
                description: "Put cheese on top"
            },
            { 
                button: 3, 
                action: "Bake pizza", 
                description: "Put in oven"
            }
        ]
    }
];

export class SimpleWorkflowManager {
    private currentWorkflow: Workflow | null = null;
    private currentStepIndex: number = 0;
    private buttons: HTMLElement[] = [];
    private tooltip: any = null; // Reference to main tooltip class
    
    constructor() {
        // Get all buttons
        for (let i = 1; i <= 5; i++) {
            const button = document.getElementById(`button-${this.numberToWord(i)}`);
            if (button) {
                this.buttons[i-1] = button;
            }
        }
    }
    
    private numberToWord(num: number): string {
        const words = ['one', 'two', 'three', 'four', 'five'];
        return words[num - 1] || 'one';
    }
    
    async handleCommand(input: string): Promise<string> {
        const lowerInput = input.toLowerCase();
        
        // Check for workflow start commands
        if (lowerInput.includes('cake') || lowerInput.includes('bake') || lowerInput.includes('rainbow')) {
            return this.startWorkflow('cake');
        }
        
        if (lowerInput.includes('superhero') || lowerInput.includes('productivity') || lowerInput.includes('office')) {
            return this.startWorkflow('superhero');
        }
        
        if (lowerInput.includes('pizza') || lowerInput.includes('italian') || lowerInput.includes('cheese')) {
            return this.startWorkflow('pizza');
        }
        
        // If in a workflow, answer questions with workflow context
        if (this.currentWorkflow) {
            const context = this.getCurrentContext();
            const enhancedPrompt = `${context}

Current workflow context above. Answer the user's question about the current step, workflow, or any general topic.

User question: ${input}`;
            return await callLMStudio(enhancedPrompt);
        }
        
        // General questions when not in a workflow
        const generalPrompt = `You are a helpful AI assistant. Answer the user's question naturally.

Available workflows you can start:
- "bake a cake" - fun baking workflow
- "become a superhero" - office productivity workflow  
- "make pizza" - pizza making workflow

User question: ${input}`;
        
        return await callLMStudio(generalPrompt);
    }
    
    private startWorkflow(workflowId: string): string {
        const workflow = workflows.find(w => w.id === workflowId);
        if (!workflow) return "Workflow not found.";
        
        this.currentWorkflow = workflow;
        this.currentStepIndex = 0;
        this.resetButtons();
        
        const currentStep = workflow.steps[0];
        this.pointToButton(currentStep.button);
        
        return `${currentStep.description}. Click Button ${currentStep.button}.`;
    }
    
    
    private pointToButton(buttonNumber: number) {
        // Reset all buttons first
        this.resetButtons();
        
        // Highlight the target button
        const targetButton = this.buttons[buttonNumber - 1];
        if (targetButton) {
            targetButton.style.background = '#fff3cd';
            targetButton.style.borderColor = '#ffc107';
            targetButton.style.boxShadow = '0 0 0 3px rgba(255, 193, 7, 0.3)';
            targetButton.style.animation = 'pulse 2s infinite';
            
            // Add pulsing animation if not already added
            if (!document.getElementById('pulse-animation')) {
                const style = document.createElement('style');
                style.id = 'pulse-animation';
                style.textContent = `
                    @keyframes pulse {
                        0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7); }
                        70% { box-shadow: 0 0 0 10px rgba(255, 193, 7, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Point tooltip arrow to this button
            if (this.tooltip) {
                this.tooltip.setCurrentTarget(targetButton);
            }
        }
    }
    
    private resetButtons() {
        this.buttons.forEach(button => {
            if (button) {
                button.style.background = '#ffffff';
                button.style.borderColor = '#1a1a1a';
                button.style.boxShadow = '2px 2px 0px rgba(0, 0, 0, 0.1)';
                button.style.animation = '';
            }
        });
    }
    
    private resetWorkflow() {
        this.currentWorkflow = null;
        this.currentStepIndex = 0;
        this.resetButtons();
    }
    

    private getCurrentContext(): string {
        if (!this.currentWorkflow) return '';
        
        const step = this.currentWorkflow.steps[this.currentStepIndex];
        let context = `${this.currentWorkflow.context}

Current workflow: ${this.currentWorkflow.name}
Current step: ${this.currentStepIndex + 1}/${this.currentWorkflow.steps.length}
Action: ${step.action}
Description: ${step.description}
Target button: Button ${step.button}`;

        if (step.tips && step.tips.length > 0) {
            context += `\nTips: ${step.tips.join(', ')}`;
        }
        
        return context;
    }
    
    isWorkflowActive(): boolean {
        return this.currentWorkflow !== null;
    }
    
    setTooltipReference(tooltip: any) {
        this.tooltip = tooltip;
    }
    
    autoAdvance(): string {
        if (!this.currentWorkflow) return "No workflow active.";
        
        this.currentStepIndex++;
        
        // Check if workflow is complete
        if (this.currentStepIndex >= this.currentWorkflow.steps.length) {
            this.resetWorkflow();
            return `Done! Try "make pizza" or "bake cake".`;
        }
        
        const currentStep = this.currentWorkflow.steps[this.currentStepIndex];
        this.pointToButton(currentStep.button);
        
        return `${currentStep.description}. Click Button ${currentStep.button}.`;
    }
}