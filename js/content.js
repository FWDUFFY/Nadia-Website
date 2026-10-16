/*
 * Editable site content that is not plain page text.
 * (Plain text lives in js/i18n.js so it can be translated.)
 *
 * You can edit this file on GitHub with the pencil icon. Keep the commas and
 * quotes exactly as they are, save ("Commit changes") and the site rebuilds
 * itself in about two minutes.
 */

/*
 * COUNTRIES — the places shown on the map.
 *   id    ISO 3166-1 numeric code (finds the country shape on the map)
 *   code  two-letter code that links to the text in i18n.js
 *         (country.<code>.name / .partner / .summary / .b1… / .outcome / .cta)
 *   lat, lon   where the map pin sits (roughly the centre of the country)
 *   year  optional, e.g. "2023" — shown in the panel when filled in
 *   home  true marks the United Kingdom as the home of the volunteer faculty
 *
 * To add a country: copy a line, change the values, add its country.xx.*
 * texts in i18n.js, AND add a chip + a panel for it in index.html (copy an
 * existing one). The map only shows pins for countries that have a panel;
 * it re-fits itself at the next build.
 */
window.IFSHHE_COUNTRIES = [
  { id: "729", code: "sd", year: "2023", lat: 15.5, lon: 30.5 },           // Sudan (Khartoum, Feb–Mar 2023)
  { id: "566", code: "ng", year: "", lat: 9.1, lon: 8.7 },                 // Nigeria
  { id: "834", code: "tz", year: "2026", lat: -6.4, lon: 35.0 },           // Tanzania (RDTC, Moshi, February 2026)
  { id: "826", code: "gb", year: "", lat: 54.0, lon: -2.5, home: true },   // United Kingdom
];

/*
 * PARTNERS — the short strip under the hero.
 *   name     the organisation, as it should appear
 *   country  optional two-letter code (shown as the translated country name)
 * Add a logo later only once the partner has given permission.
 */
window.IFSHHE_PARTNERS = [
  { name: "SHAWG", country: "sd" },
  { name: "RDTC", country: "tz" },
  { name: "ILDS", country: "" },
];

/*
 * MEMBERS — the volunteer faculty.
 * While this list is empty the page shows a "profiles coming soon" card.
 * To add someone, copy the commented example line below and remove the
 * leading "//". Photos: save a square JPEG (400×400 px, under 80 KB) as
 * images/members/<firstname-lastname>.jpg; without a photo the card shows
 * initials. `link` is optional (LinkedIn, ORCID, hospital profile).
 */
window.IFSHHE_MEMBERS = [
  // The February 2026 course faculty (from the course faculty slide).
  // DO NOT PUBLISH until each person has agreed to appear on the site.
  // To switch a card on, remove the two slashes at the start of that line.
  // { name: "Nadia Ahmed", role: "Volunteer faculty", photo: "", roleTranslations: { ar: "", sw: "", ha: "" }, link: "" },
  // { name: "Nasra Batchu", role: "Volunteer faculty", photo: "", roleTranslations: { ar: "", sw: "", ha: "" }, link: "" },
  // { name: "Claire Fuller", role: "Volunteer faculty", photo: "", roleTranslations: { ar: "", sw: "", ha: "" }, link: "" },
  // { name: "Katie Humphries", role: "Volunteer faculty", photo: "", roleTranslations: { ar: "", sw: "", ha: "" }, link: "" },
  // { name: "Kim Madundo", role: "Volunteer faculty", photo: "", roleTranslations: { ar: "", sw: "", ha: "" }, link: "" },
  // { name: "Rasha Omer", role: "Volunteer faculty", photo: "", roleTranslations: { ar: "", sw: "", ha: "" }, link: "" },
  // { name: "Victoria Poon", role: "Volunteer faculty", photo: "", roleTranslations: { ar: "", sw: "", ha: "" }, link: "" },
  // { name: "Luciana Rubinstein", role: "Volunteer faculty", photo: "", roleTranslations: { ar: "", sw: "", ha: "" }, link: "" },
];

/*
 * STATS — optional numbers for the "Our impact" band.
 * Leave empty until the numbers are confirmed; nothing is shown while empty.
 * Example: { value: 500, suffix: "+", label: "clinicians trained" }
 *   value   the number (counts up when the band scrolls into view)
 *   suffix  optional text after the number, e.g. "+" or "%"
 *   label   short description; labelTranslations is optional
 */
window.IFSHHE_STATS = [
  // { value: 500, suffix: "+", label: "clinicians trained", labelTranslations: { ar: "", sw: "", ha: "" } },
  // Confirmed by Nadia, October 2026.
  { value: 94, label: "healthcare professionals trained", labelTranslations: { ar: "من المهنيين الصحيين تلقّوا التدريب", sw: "wataalamu wa afya waliopata mafunzo", ha: "ma'aikatan lafiya da aka horar" } },
  { value: 3, label: "courses delivered", labelTranslations: { ar: "دورات تدريبية أُنجزت", sw: "kozi zilizotolewa", ha: "kwasa-kwasan da aka gudanar" } },
];

/*
 * SOCIAL — links shown in the footer.
 * Paste the full Instagram address once the account exists, e.g.
 *   instagram: "https://www.instagram.com/ifshhe/"
 * While it is empty the footer shows "Instagram — coming soon".
 */
window.IFSHHE_SOCIAL = {
  instagram: "https://www.instagram.com/ifshhe.info/",
};
