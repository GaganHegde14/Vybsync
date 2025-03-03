import * as React from "react";

// Cached script statuses
const cachedScriptStatuses = {};

function getScriptNode(src) {
  const node = document.querySelector(`script[src="${src}"]`);
  const status = node?.getAttribute("data-status");

  return {
    node,
    status,
  };
}

export default function useScript(src) {
  const [status, setStatus] = React.useState(() => {
    if (typeof window === "undefined") {
      // SSR Handling - always return 'loading'
      return "loading";
    }

    return cachedScriptStatuses[src] ?? "loading";
  });

  React.useEffect(() => {
    // If the script status is already cached as 'ready' or 'error', use it
    const cachedScriptStatus = cachedScriptStatuses[src];
    if (cachedScriptStatus === "ready" || cachedScriptStatus === "error") {
      setStatus(cachedScriptStatus);
      return;
    }

    // Fetch existing script element by src
    const script = getScriptNode(src);
    let scriptNode = script.node;

    if (!scriptNode) {
      // Create script element and add it to document body
      scriptNode = document.createElement("script");
      scriptNode.src = src;
      scriptNode.async = true;
      scriptNode.setAttribute("data-status", "loading");
      document.body.appendChild(scriptNode);

      // Update status attribute based on load/error events
      const setAttributeFromEvent = (event) => {
        const scriptStatus = event.type === "load" ? "ready" : "error";
        scriptNode?.setAttribute("data-status", scriptStatus);
      };

      scriptNode.addEventListener("load", setAttributeFromEvent);
      scriptNode.addEventListener("error", setAttributeFromEvent);
    } else if (script.status) {
      // If script exists and has a status, sync it immediately
      setStatus(script.status);
    }

    // Event handler to update state and cache
    const setStateFromEvent = (event) => {
      const newStatus = event.type === "load" ? "ready" : "error";
      setStatus(newStatus);
      cachedScriptStatuses[src] = newStatus;
    };

    // Add event listeners only if we need to track status changes
    if (!cachedScriptStatus || cachedScriptStatus === "loading") {
      scriptNode.addEventListener("load", setStateFromEvent);
      scriptNode.addEventListener("error", setStateFromEvent);
    }

    // Cleanup: Remove event listeners, but don’t remove script node unless safe
    return () => {
      if (scriptNode) {
        scriptNode.removeEventListener("load", setStateFromEvent);
        scriptNode.removeEventListener("error", setStateFromEvent);
        // Only remove script if it’s not cached as 'ready' or 'error' elsewhere
        if (!cachedScriptStatuses[src]) {
          try {
            scriptNode.remove();
          } catch (error) {
            // Ignore removal errors
          }
        }
      }
    };
  }, [src]);

  return status;
}
