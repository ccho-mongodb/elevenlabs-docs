(function () {
  // Client tool call handler
  const navigateToDoc = (path) => {
    const router = window?.next?.router;
    router.push(path);
  };

  // Intercept WebSocket messages before creating the widget
  const OriginalWebSocket = window.WebSocket;
  window.WebSocket = function (url, protocols) {
    const ws = new OriginalWebSocket(url, protocols);

    // Intercept incoming messages
    const originalOnMessage = ws.onmessage;
    ws.onmessage = function (event) {
      // Parse the message and check for redirect tool calls
      try {
        const message = JSON.parse(event.data);
        if (
          message.type === "client_tool_call" &&
          message.client_tool_call.tool_name === "redirect"
        ) {
          const path = message.client_tool_call.parameters.path;
          navigateToDoc(path);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }

      if (originalOnMessage) {
        originalOnMessage.call(this, event);
      }
    };

    return ws;
  };
  window.WebSocket.prototype = OriginalWebSocket.prototype;

  // Create and append the script element
  var script = document.createElement("script");
  script.src = "https://elevenlabs.io/convai-widget/index.js";
  script.async = true;
  script.type = "text/javascript";
  document.head.appendChild(script);

  // hide convai on mobile
  var wrapper = document.createElement("div");
  wrapper.className = "hidden lg:block";

  // Create and append the widget element
  var widget = document.createElement("elevenlabs-convai");
  widget.setAttribute("agent-id", "SYyxtUm2ZybUW6WE2pWx");
  widget.setAttribute("avatar-orb-color-1", "#4D9CFF");
  widget.setAttribute("avatar-orb-color-2", "#9CE6E6");

  // Append widget to wrapper, then wrapper to body
  wrapper.appendChild(widget);
  document.body.appendChild(wrapper);
})();
