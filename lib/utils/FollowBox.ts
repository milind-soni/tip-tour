import { styles } from "./FollowBox/style";

class FollowBox {
  private followBox: HTMLDivElement | null = null;
  private animationFrameId: number | null = null;
  private followBoxOffset = 15;

  constructor() {
    this.init();
  }

  /**
   * Checks if the device is a touch device.
   * @returns {boolean} True if the device is a touch device, false otherwise.
   */
  private isTouchDevice(): boolean {
    try {
      // We try to create TouchEvent. It would fail for desktops and throw an error
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  }
  /**
   * Moves the follow box based on the mouse or touch event.
   * @param event - The mouse or touch event.
   */
  private move = (event: MouseEvent | TouchEvent) => {
    try {
      const x = !this.isTouchDevice()
        ? (event as MouseEvent).pageX
        : (event as TouchEvent).touches[0].pageX;
      const y = !this.isTouchDevice()
        ? (event as MouseEvent).pageY
        : (event as TouchEvent).touches[0].pageY;

      // Check if the mouse is near the top of the screen
      const isNearTop =
        y < this.followBoxOffset * 2 + this.followBox!.clientHeight;

      // Check if the mouse is near the right of the screen
      const isNearRight =
        x >
        window.innerWidth -
          this.followBoxOffset * 2 -
          this.followBox!.clientWidth;

      // Calculate the new position of the follow box
      let newX = x + this.followBoxOffset + this.followBox!.clientWidth / 2;
      let newY = y - this.followBoxOffset - this.followBox!.clientHeight / 2;

      // Adjust the position if necessary
      if (isNearTop) {
        newY = y + this.followBoxOffset + this.followBox!.clientHeight / 2;
      }
      if (isNearRight) {
        newX = x - this.followBoxOffset - this.followBox!.clientWidth / 2;
      }

      this.followBox!.style.left = `${newX}px`;
      this.followBox!.style.top = `${newY}px`;
    } catch (e) {
      // Handle any errors
    }
  };

  private init() {
    document.addEventListener("mousemove", this.move);
    document.addEventListener("touchmove", this.move);
  }

  public createFollowBox() {
    this.followBox = document.createElement("div");
    Object.assign(this.followBox.style, styles);
    this.followBox.style.position = "fixed";
    this.followBox.style.pointerEvents = "none"; // Ensure the box doesn't interfere with mouse events
    this.followBox.className = "tip-comment";
    document.body.appendChild(this.followBox);
  }

  public destroyFollowBox() {
    if (this.followBox) {
      cancelAnimationFrame(this.animationFrameId!);
      document.body.removeChild(this.followBox);
      this.followBox = null;
      this.animationFrameId = null;
    }
  }
}

export default FollowBox;
