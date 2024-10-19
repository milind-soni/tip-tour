import { OverlayEvent } from "./OverlayEvent";

const overlayEvent = new OverlayEvent("tipContentUpdate");

export default function (event: MouseEvent) {
  let element = event.target as HTMLElement;

  const findDataTipElement = (el: HTMLElement | null) => {
    while (el && el !== document.body) {
      if (el.hasAttribute("data-tip")) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  };

  const dataTipElement = findDataTipElement(element);

  if (!dataTipElement) {
    console.log("Dispatching event with no tip");
    overlayEvent.dispatch({
      noTip: true,
      message: "Hmmm, nothing yet",
      elementInfo: null
    });
    return;
  }

  const elementInfo = {
    tag: dataTipElement.tagName,
    id: dataTipElement.id,
    classes: Array.from(dataTipElement.classList),
    attributes: Array.from(dataTipElement.attributes).map(attr => ({
      name: attr.name,
      value: attr.value
    }))
  };

  console.log("Dispatching event with tip", {
    noTip: false,
    message: dataTipElement.getAttribute("data-tip") as string,
    elementInfo: elementInfo
  });

  overlayEvent.dispatch({
    noTip: false,
    message: dataTipElement.getAttribute("data-tip") as string,
    elementInfo: elementInfo
  });
  // $TipStore.message = dataTipElement.getAttribute("data-tip") as string;
  const existingOverlay = document.getElementById("data-tip-overlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }

  const overlay = document.createElement("div");
  overlay.id = "data-tip-overlay";
  overlay.style.position = "absolute";
  overlay.style.border = "2px solid red";
  overlay.style.pointerEvents = "none";
  overlay.style.boxSizing = "border-box"; // Ensure the border doesn't affect the layout
  overlay.style.zIndex = "999";

  document.body.appendChild(overlay);

  const updateOverlay = () => {
    const rect = dataTipElement.getBoundingClientRect();
    overlay.style.width = rect.width + "px";
    overlay.style.height = rect.height + "px";
    overlay.style.top = rect.top + "px";
    overlay.style.left = rect.left + "px";
  };

  updateOverlay();

  dataTipElement.addEventListener("mousemove", updateOverlay);
  dataTipElement.addEventListener(
    "mouseout",
    () => {
      try {
        document.body.removeChild(overlay);
      } catch (e) {}
    },
    { once: true }
  );
}
