import { styles } from "./style";

class FollowBox {
  private followBox: HTMLDivElement | null = null;
  private displayArea: HTMLDivElement | null = null;
  private input: HTMLInputElement | null = null;
  private animationFrameId: number | null = null;
  private followBoxOffset = 15;

  constructor() {
    this.init();
  }

  private init() {
    this.createFollowBox();
    console.log("FollowBox initialized");
  }

  public createFollowBox() {
    this.followBox = document.createElement("div");
    Object.assign(this.followBox.style, styles);
    this.followBox.style.position = "fixed";
    this.followBox.style.bottom = "20px";
    this.followBox.style.right = "20px";
    this.followBox.style.width = "300px";
    this.followBox.style.backgroundColor = "#f0f0f0";
    this.followBox.style.padding = "10px";
    this.followBox.style.borderRadius = "5px";
    this.followBox.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
    this.followBox.className = "tip-comment";

    this.displayArea = document.createElement("div");
    this.displayArea.style.marginBottom = "10px";
    this.displayArea.style.minHeight = "50px";
    this.followBox.appendChild(this.displayArea);

    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.placeholder = "Type your tour step here...";
    this.input.style.width = "100%";
    this.input.style.padding = "5px";
    this.input.style.boxSizing = "border-box";

    this.followBox.appendChild(this.input);
    document.body.appendChild(this.followBox);

    console.log("FollowBox created with display area and input:", this.displayArea, this.input);
  }

  public handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      console.log("Enter key pressed");
      this.handleEnterPress();
      event.preventDefault();
    }
  };

  private handleEnterPress = () => {
    console.log("handleEnterPress called");
    if (!this.input) {
      console.error("Input element is null");
      return;
    }
    const inputText = this.input.value.trim();
    console.log("Input text:", inputText);
    if (inputText) {
      this.sendToOpenAI(inputText);
      this.input.value = '';  // Clear the input after sending
    } else {
      console.log("Input is empty, not sending to OpenAI");
    }
  };

  private sendToOpenAI = async (text: string) => {
    console.log("Sending to OpenAI:", text);
    this.setContent("Sending to OpenAI...");
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: text }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if ('error' in data) {
        throw new Error(data.error);
      }
      console.log("Response from OpenAI:", data.response);
      this.setContent(data.response);
    } catch (error) {
      console.error('Error sending to OpenAI:', error);
      let errorMessage = "Couldn't get a response from OpenAI.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      this.setContent(`Error: ${errorMessage}`);
    }
  };

  public setContent(message: string) {
    if (this.displayArea) {
      this.displayArea.textContent = message;
      console.log("Content set in display area:", message);
    } else {
      console.error("Display area not found when trying to set content");
    }
  }

  public destroyFollowBox() {
    if (this.followBox) {
      document.body.removeChild(this.followBox);
      this.followBox = null;
      this.displayArea = null;
      this.input = null;
      this.animationFrameId = null;
      console.log("FollowBox destroyed");
    }
  }
}

export default FollowBox;