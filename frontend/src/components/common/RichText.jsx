import React, { useMemo } from "react";

// Chỉ giữ các thẻ định dạng cơ bản; mọi thẻ khác (script, img, a, style…) bị bỏ, chỉ lấy chữ bên trong.
// Dựng lại bằng React element nên không có thuộc tính hay HTML thô nào lọt vào trang.
const ALLOWED = { P: "p", H3: "h3", H4: "h4", UL: "ul", OL: "ol", LI: "li", STRONG: "strong", B: "strong", EM: "em", I: "em", BR: "br" };
const DROPPED = new Set(["SCRIPT", "STYLE", "TEMPLATE", "IFRAME", "OBJECT"]);

function toReact(node, key) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeType !== Node.ELEMENT_NODE || DROPPED.has(node.nodeName)) return null;
  const children = Array.from(node.childNodes, toReact);
  const tag = ALLOWED[node.nodeName];
  if (!tag) return <React.Fragment key={key}>{children}</React.Fragment>;
  return tag === "br" ? <br key={key} /> : React.createElement(tag, { key }, children);
}

export default function RichText({ html, className }) {
  const content = useMemo(() => {
    if (!html) return null;
    const body = new DOMParser().parseFromString(html, "text/html").body;
    return Array.from(body.childNodes, toReact);
  }, [html]);
  return content ? <div className={className}>{content}</div> : null;
}
