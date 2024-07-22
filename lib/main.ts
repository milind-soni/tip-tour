import FollowBox from "./utils/FollowBox";
import Overlay from "./utils/Overlay";

// All data attributes in current script
// const scriptTag = document.currentScript;
// const dataAttributes = scriptTag?.dataset as {
//   token: string;
// };``

document.addEventListener("mousemove", Overlay);
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  const followBox = new FollowBox();
  followBox.createFollowBox();
});
