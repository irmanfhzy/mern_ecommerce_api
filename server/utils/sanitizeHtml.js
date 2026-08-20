import sanitizeHtml from "sanitize-html";

const sanitizeHtmlValue = (html = "") => {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "hr",
      "a",
    ],

    allowedAttributes: {
      a: ["href", "target", "rel"],
    },

    allowedSchemes: ["http", "https", "mailto"],

    allowedSchemesByTag: {
      a: ["http", "https", "mailto"],
    },
  });
};

export default sanitizeHtmlValue;
