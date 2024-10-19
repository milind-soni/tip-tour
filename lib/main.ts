import FollowBox from "./utils/FollowBox/FollowBox";
import Overlay from "./utils/Overlay/Overlay";

let followBox: FollowBox;

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  followBox = new FollowBox();

  document.addEventListener("mousemove", (event) => {
    Overlay(event);
  });

  document.addEventListener("tipContentUpdate", (event) => {
    console.log("tipContentUpdate event received", event);
    const customEvent = event as CustomEvent;
    const data = customEvent.detail;
    
    if (data) {
      if (data.noTip) {
        console.log("No tip data", data);
        followBox.setContent("Hmmm, nothing here yet.");
      } else {
        console.log("Tip data", data);
        const content = `Hovered: ${data.message}\nElement: ${data.elementInfo.tag}`;
        followBox.setContent(content);
        console.log("Element Info:", data.elementInfo);
      }
    } else {
      console.error("No data received in tipContentUpdate event");
    }
  });

  // Add global keydown event listener
  document.addEventListener("keydown", (event) => {
    followBox.handleKeyPress(event);
  });

  console.log("Event listeners set up");

  // Test function to simulate Enter key press
  (window as any).testEnterPress = () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    document.dispatchEvent(event);
  };

  console.log("Setup complete, you can now use the FollowBox");
});