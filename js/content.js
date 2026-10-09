/*
 * Editable site content that isn't plain page text.
 *
 * COUNTRIES: `id` is the ISO 3166-1 numeric code the map uses to find the
 * country shape; `code` links to the translated text in i18n.js
 * (country.<code>.name / .meta / .summary). To add a country, add
 * an entry here and its text in i18n.js.
 */
window.IFSHHE_COUNTRIES = [
  { id: "729", code: "sd" }, // Sudan
  { id: "566", code: "ng" }, // Nigeria
  { id: "834", code: "tz" }, // Tanzania
  { id: "826", code: "gb" }, // United Kingdom
];

/*
 * MEMBERS: placeholders until we have real names, roles and photos.
 * `photo` is optional, e.g. "images/members/jane.jpg"; without one the card
 * shows initials.
 */
window.IFSHHE_MEMBERS = [
  { name: "Member name", role: "Programme Lead", photo: "" },
  { name: "Member name", role: "Clinical Educator", photo: "" },
  { name: "Member name", role: "Clinical Educator", photo: "" },
  { name: "Member name", role: "Partnerships Coordinator", photo: "" },
];
