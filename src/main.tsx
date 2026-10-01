import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Google Translate replaces text nodes, which makes React crash on navigation.
// Make removeChild/insertBefore tolerant to nodes moved by the translator.
if (typeof Node === "function" && Node.prototype) {
  const origRemove = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (child.parentNode) child.parentNode.removeChild(child);
      return child;
    }
    return origRemove.call(this, child) as T;
  };
  const origInsert = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) {
      return origInsert.call(this, newNode, null) as T;
    }
    return origInsert.call(this, newNode, ref) as T;
  };
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
