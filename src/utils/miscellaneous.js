import DOMPurify from "dompurify";

export function convertUrlToBreadcrumbs(url) {
  return (
    url
      ?.slice(1, url?.length - 1)
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
      ?.replace(/\//g, " > ") ?? ""
  );
}

export const sanitize = (content) => {
  return process.browser
    ? DOMPurify.sanitize(content, { ADD_ATTR: ["target"] })
    : content;
};


export function formatPhoneNumber(phoneNumberString) {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})(\d{3})*$/);
  if (match) {
    var intlCode = match[1] ? "+1 " : "";
    var extCode = match[5] ? "x" + match[5] : "";
    if (!extCode) {
      return ["(", match[2], ") ", match[3], "-", match[4]].join("");
    }
    return ["(", match[2], ") ", match[3], "-", match[4], extCode].join("");
  }
  return null;
}
