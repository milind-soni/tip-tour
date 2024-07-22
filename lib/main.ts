import FollowBox from "./utils/FollowBox/FollowBox";
import Overlay from "./utils/Overlay/Overlay";
import type { OverlayEvent } from "./utils/Overlay/OverlayEvent";

// All data attributes in current script
// const scriptTag = document.currentScript;
// const dataAttributes = scriptTag?.dataset as {
//   token: string;
// };``

const followBox = new FollowBox();
document.addEventListener("mousemove", (event: MouseEvent) => {
  Overlay(event);
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  followBox.createFollowBox();
});

document.addEventListener("tipContentUpdate", (event: Event) => {
  const overlayEvent = event as OverlayEvent;
  // console.log(overlayEvent.getData());
  followBox.setContent(overlayEvent.getData().message);
});
