/*
 * Translations for the IFSHHE website.
 *
 * HOW TO EDIT (no coding knowledge needed):
 *   - Every piece of text on the site has a short "key" (left) and the text
 *     itself (right, in quotes). Change the text between the quotes only.
 *   - English (the `en` block) is the source. If a key is missing from another
 *     language, the English text is shown instead, so nothing ever goes blank.
 *   - Keep the comma at the end of each line. If your text contains a double
 *     quote, write it as \" (backslash + quote).
 *   - Curly braces such as {name} or {n} are filled in automatically; keep them.
 *
 * The page HTML marks text with data-i18n="key". The build step pre-renders one
 * page per language from this file; the browser only uses t() for text that
 * JavaScript creates (form messages, the visitor counter, member cards).
 */
window.IFSHHE_I18N = {
  en: {
    /* Page metadata */
    "meta.title": "IFSHHE · Sexual health and HIV education, built with local clinicians",
    "meta.description": "IFSHHE is a volunteer-led foundation of UK clinicians who work with health professionals in Sudan, Nigeria and Tanzania to build sexual health, HIV and hepatitis education that lasts.",

    /* Global chrome */
    "skip": "Skip to main content",
    "brand.home": "IFSHHE — home",
    "brand.sub": "Sexual health · HIV · Hepatitis education",
    "lang.label": "Language",
    "lang.menu": "Choose language",
    "nav.label": "Main navigation",
    "nav.menu": "Menu",
    "nav.close": "Close menu",
    "nav.about": "About",
    "nav.work": "What we do",
    "nav.where": "Where we work",
    "nav.people": "Our people",
    "nav.involved": "Get involved",
    "nav.contact": "Contact us",
    "cta.float": "Get in touch",
    "cta.floatLabel": "Go to the contact form",

    /* Hero */
    "hero.kicker": "Independent · Volunteer-led · UK-based",
    "hero.title": "Sexual health education that lasts.",
    "hero.lede": "We are a volunteer-led foundation of UK clinicians. We work alongside doctors, nurses and educators in Sudan, Nigeria and Tanzania to build sexual health, HIV and hepatitis education that keeps going long after we go home — designed with local clinicians, not for them.",
    "hero.cta1": "Partner with us",
    "hero.cta2": "See where we work",
    "hero.photoAlt": "Clinicians in white coats listening to an IFSHHE faculty member during a training session in Moshi, Tanzania",
    "hero.caption": "Sexual health training with the Regional Dermatology Training Centre, Moshi, Tanzania",

    /* Partners strip */
    "partners.label": "Working alongside",
    "partners.note": "Partner names shown with their permission.",

    /* About */
    "about.kicker": "Who we are",
    "about.title": "Clinicians teaching clinicians",
    "about.p1": "The International Foundation for Sexual Health and HIV Education (IFSHHE) is an independent, volunteer-led organisation. Our faculty are practising UK clinicians who give their time to strengthen sexual health, HIV and hepatitis education where it is needed most.",
    "about.p2": "We work in partnership with local health professionals and organisations. Together we deliver education that fits the local health system, respects local culture and improves care for patients. We also help local educators take the teaching on, so it continues without us.",
    "about.quote": "Designed with local clinicians, not for them.",
    "about.photoAlt": "Health workers sit in a circle around an anatomy diagram on the floor during a small-group workshop",
    "about.fact": "Volunteer-led · UK clinical faculty",
    "about.chip1": "Independent",
    "about.chip2": "Volunteer-led",
    "about.chip3": "Co-designed locally",

    /* What we do */
    "work.kicker": "What we do",
    "work.title": "Three things, done well",
    "work.lede": "Everything we do comes back to one aim: more clinicians, more confident, in more places.",
    "work.p1.t": "Education and training",
    "work.p1.d": "Evidence-based teaching in sexually transmitted infections, HIV, hepatitis and sexual and reproductive health, shaped to the local workforce and the cases they see.",
    "work.p2.t": "Building local capacity",
    "work.p2.d": "We develop local clinical educators, support service improvement and leave behind materials that teams can keep using.",
    "work.p3.t": "Lasting partnerships",
    "work.p3.d": "Long-term relationships with hospitals, universities, professional societies and NGOs, so each visit builds on the last.",

    /* How we work */
    "how.kicker": "How we work",
    "how.title": "With partners, from the first conversation",
    "how.s1.t": "Co-design",
    "how.s1.d": "We start by listening. Local partners tell us what their clinicians need; we build the programme together.",
    "how.s2.t": "Deliver",
    "how.s2.d": "Volunteer faculty teach in person: lectures, case discussions and hands-on workshops, in small groups wherever we can.",
    "how.s3.t": "Train the trainers",
    "how.s3.d": "Local educators co-teach from day one, so the course belongs to them, not to us.",
    "how.s4.t": "Sustain",
    "how.s4.d": "We stay in touch, share materials, mentor and return when invited.",

    /* Where we work (map) */
    "where.kicker": "Where we work",
    "where.title": "Four countries, one approach",
    "where.hint": "Choose a highlighted country on the map, or use the list, to see what we have done there.",
    "where.mapTitle": "Map of the countries where IFSHHE works",
    "where.mapDesc": "Highlighted countries: United Kingdom, Sudan, Nigeria and Tanzania. Use the country list to read about each one.",
    "where.fallback": "The map could not load. The country list below still works.",
    "where.listLabel": "Countries where we work",
    "where.panelLabel": "Country details",
    "where.partnerLabel": "Partner",
    "where.yearLabel": "Year",
    "where.didLabel": "What we did",
    "where.ledLabel": "What it led to",
    "where.selected": "selected",
    "where.homeLabel": "Home",

    "country.sd.name": "Sudan",
    "country.sd.partner": "SHAWG",
    "country.sd.summary": "A foundation programme in sexually transmitted infections, built and taught with SHAWG for clinicians across Sudan.",
    "country.sd.b1": "Foundation STI training programme co-designed with SHAWG",
    "country.sd.b2": "Case-based teaching on diagnosis and management of common STIs",
    "country.sd.outcome": "Local clinicians now have a shared foundation course to build on.",
    "country.sd.cta": "Ask about working with us in Sudan",

    "country.ng.name": "Nigeria",
    "country.ng.partner": "International partners",
    "country.ng.summary": "An adolescent sexual and reproductive health workshop, delivered with international partners.",
    "country.ng.b1": "Workshop on adolescent sexual and reproductive health",
    "country.ng.b2": "Delivered with international partners",
    "country.ng.outcome": "A starting point for further work with young people's health services in Nigeria.",
    "country.ng.cta": "Ask about working with us in Nigeria",

    "country.tz.name": "Tanzania",
    "country.tz.partner": "Regional Dermatology Training Centre (RDTC), Moshi · ILDS",
    "country.tz.summary": "Sexual health and STI education with the Regional Dermatology Training Centre in Moshi, supported by the International League of Dermatological Societies.",
    "country.tz.b1": "Sexual health and STI teaching for RDTC students and staff",
    "country.tz.b2": "Lectures, small-group workshops and reflective sessions on topics including STIs in pregnancy",
    "country.tz.b3": "In partnership with RDTC, a centre founded in 1990 by the ILDS, Tanzania's Ministry of Health and KCMC",
    "country.tz.outcome": "Teaching that sits inside an established regional training centre, reaching clinicians from across East Africa.",
    "country.tz.cta": "Ask about working with us in Tanzania",

    "country.gb.name": "United Kingdom",
    "country.gb.partner": "Volunteer faculty",
    "country.gb.summary": "Home of our volunteer faculty, where programmes are designed, materials are written and partnerships are coordinated.",
    "country.gb.b1": "Volunteer clinical faculty from across the UK",
    "country.gb.b2": "Curriculum design and teaching materials",
    "country.gb.b3": "Partnership and visit coordination",

    /* Impact */
    "impact.kicker": "Our impact",
    "impact.title": "Measured by what lasts",
    "impact.lede": "We ask every participant what they learned and what they will change. We check knowledge before and after each course. And we judge ourselves by one thing above all: whether the teaching carries on without us.",
    "impact.s1.t": "Co-designed, every time",
    "impact.s1.d": "Each programme is planned with the partner, not sent from the UK.",
    "impact.s2.t": "Taught by local educators",
    "impact.s2.d": "Local clinicians co-teach from the start and take the course forward.",
    "impact.s3.t": "Checked, not assumed",
    "impact.s3.d": "Participant feedback and knowledge checks shape the next visit.",
    "impact.s4.t": "Partnerships that continue",
    "impact.s4.d": "We keep in touch between visits and return when invited.",

    /* Gallery */
    "gallery.kicker": "In the room",
    "gallery.title": "Moments from the work",
    "gallery.label": "Photo gallery",
    "gallery.open": "View larger",
    "gallery.close": "Close",
    "gallery.cap1": "Reflections at the end of a teaching day, Regional Dermatology Training Centre, Moshi, Tanzania",
    "gallery.cap2": "A volunteer faculty member works through a case at the flipchart",
    "gallery.cap3": "Small-group case work during a workshop",
    "gallery.cap4": "A local faculty member teaches a session on syphilis at the Regional Dermatology Training Centre, Moshi, Tanzania",
    "gallery.cap5": "\u201cThanks for today\u201d \u2014 a note left for the faculty at the end of a teaching day",
    "gallery.alt1": "A full lecture room of clinicians in white coats facing a presenter and a slide titled Reflections",
    "gallery.alt2": "A faculty member speaking beside a flipchart listing causes of pelvic pain",
    "gallery.alt3": "Four clinicians in white coats and scrubs work through a worksheet together",
    "gallery.alt4": "A lecturer stands in front of a slide titled Syphilis: the great imitator, facing students in white coats",
    "gallery.alt5": "A handwritten sticky note reading: Have a beautiful evening! Thanks for today. Improved me a lot",

    /* Our people */
    "people.kicker": "Our people",
    "people.title": "Meet the volunteer faculty",
    "people.lede": "Our faculty are practising clinicians — doctors, nurses and educators in sexual health, HIV, infectious diseases and dermatology — who teach in their own time.",
    "people.placeholder.t": "Faculty profiles coming soon",
    "people.placeholder.d": "We are adding our volunteer faculty here. In the meantime, email us to find out who is behind the work.",
    "people.join.t": "Could you teach with us?",
    "people.join.d": "We welcome clinicians with experience in sexual health, HIV or hepatitis.",
    "people.join.cta": "Volunteer as faculty",

    /* Get involved */
    "involved.kicker": "Get involved",
    "involved.title": "Three ways to help",
    "involved.lede": "We are small, independent and run by volunteers. Partners, faculty and supporters make the work possible.",
    "involved.p1.t": "Partner with us",
    "involved.p1.d": "Hospitals, universities, professional societies and NGOs: tell us what your clinicians need and we will design a programme with you.",
    "involved.p1.cta": "Start a conversation",
    "involved.p1.label": "Start a conversation about partnering",
    "involved.p2.t": "Volunteer as faculty",
    "involved.p2.d": "UK clinicians in sexual health, HIV, hepatitis or related fields: teach with us in person or help write materials.",
    "involved.p2.cta": "Offer your time",
    "involved.p2.label": "Offer your time as volunteer faculty",
    "involved.p3.t": "Support our work",
    "involved.p3.d": "We have no paid staff. Help with travel, teaching materials or expertise goes a long way. There is no online donation yet — get in touch and we will explain how to help.",
    "involved.p3.cta": "Ask how to support",
    "involved.p3.label": "Ask how to support our work",

    /* Contact + form */
    "contact.kicker": "Contact",
    "contact.title": "Get in touch",
    "contact.lede": "Every message is read by a member of the volunteer faculty. We usually reply within a few days.",
    "contact.direct": "Or email us directly",
    "contact.formTitle": "Contact form",
    "form.name": "Name",
    "form.name.ph": "Your full name",
    "form.email": "Email",
    "form.email.ph": "you@example.org",
    "form.email.help": "We only use this to reply.",
    "form.org": "Organisation",
    "form.org.ph": "Hospital, university, NGO…",
    "form.optional": "optional",
    "form.interest": "I'm interested in",
    "form.interest.ph": "Choose one",
    "form.interest.partner": "Partnering with IFSHHE",
    "form.interest.volunteer": "Volunteering as faculty",
    "form.interest.support": "Supporting our work",
    "form.interest.other": "Something else",
    "form.message": "Message",
    "form.message.ph": "Tell us a little about you and what you have in mind.",
    "form.honeypot": "Leave this field empty",
    "form.send": "Send message",
    "form.sending": "Sending…",
    "form.err.name": "Please tell us your name.",
    "form.err.email": "Please enter your email address.",
    "form.err.emailFormat": "That email address doesn't look right. Check for typos.",
    "form.err.interest": "Please choose what you are interested in.",
    "form.err.message": "Please write a short message.",
    "form.err.messageShort": "Please add a little more detail so we can help.",
    "form.err.summaryOne": "Please check 1 field below.",
    "form.err.summaryMany": "Please check {n} fields below.",
    "form.ok.t": "Thank you, {name}.",
    "form.ok.d": "Your message is on its way to the volunteer faculty. We will reply to {email} as soon as we can.",
    "form.ok.again": "Send another message",
    "form.fail.t": "We couldn't send that.",
    "form.fail.d": "Please try again, or email us at infoifshhe@gmail.com.",
    "form.fail.retry": "Try again",
    "form.privacy": "We keep your details only to reply to you. We never share them.",

    /* Footer */
    "footer.tagline": "Sexual health, HIV and hepatitis education — designed with local clinicians, not for them.",
    "footer.navLabel": "Footer navigation",
    "footer.explore": "Explore",
    "footer.contact": "Contact",
    "footer.insta": "Instagram",
    "footer.instaSoon": "Instagram — coming soon",
    "footer.based": "Based in the United Kingdom",
    "footer.visits": "Visits since launch",
    "footer.visitsLabel": "Visitor counter",
    "footer.copyright": "International Foundation for Sexual Health and HIV Education. All rights reserved.",

    /* thank-you.html */
    "ty.metaTitle": "Thank you · IFSHHE",
    "ty.title": "Thank you",
    "ty.body": "We have your message. A member of the volunteer faculty will reply as soon as they can.",
    "ty.cta": "Back to the website",
    "ty.email": "Email us at",

    /* 404.html */
    "nf.metaTitle": "Page not found · IFSHHE",
    "nf.title": "We can't find that page",
    "nf.body": "The link may be old or mistyped. Everything we do is on one page, so you are never far away.",
    "nf.cta1": "Go to the homepage",
    "nf.cta2": "See where we work",

    /* Accessibility helpers */
    "a11y.newTab": "(opens in a new tab)",
  },

  ar: {
    "skip": "انتقل إلى المحتوى",
    "brand.sub": "الصحة الجنسية · التوعية بفيروس نقص المناعة",
    "lang.label": "اللغة",
    "nav.menu": "القائمة",
    "nav.about": "من نحن",
    "nav.work": "ماذا نفعل",
    "nav.where": "أين نعمل",
    "nav.impact": "تأثيرنا",
    "nav.gallery": "معرض الصور",
    "nav.members": "الأعضاء",
    "nav.contact": "اتصل بنا",

    "hero.kicker": "مستقلة · بقيادة متطوعين · عبر العالم",
    "hero.title": "بناء تعليم مستدام في الصحة الجنسية وفيروس نقص المناعة في جميع أنحاء العالم",
    "hero.lede": "تعزيز أنظمة الرعاية الصحية من خلال التعليم المستدام والشراكة وبناء القدرات — المصممة مع الأطباء المحليين.",
    "hero.cta1": "شارك معنا",
    "hero.cta2": "أين نعمل",
    "hero.photoAlt": "أطباء في دورة تدريبية لمؤسسة IFSHHE",

    "about.title": "من نحن",
    "about.p1": "المؤسسة الدولية للتثقيف في الصحة الجنسية وفيروس نقص المناعة البشرية (IFSHHE) منظمة مستقلة يقودها متطوعون، مكرسة لتعزيز التعليم في مجالات الصحة الجنسية وفيروس نقص المناعة البشرية والتهاب الكبد حول العالم.",
    "about.p2": "نعمل بالشراكة مع المهنيين الصحيين والمنظمات المحلية لتقديم تعليم مستدام وملائم ثقافيًا يبني القدرات ويدعم تطوير الخدمات ويحسّن رعاية المرضى.",
    "about.photoAlt": "مشاركون في ورشة عمل يعملون معًا",

    "work.title": "ماذا نفعل",
    "work.p1.t": "التعليم والتدريب",
    "work.p1.d": "تقديم تعليم وتدريب قائمين على الأدلة في العدوى المنقولة جنسيًا وفيروس نقص المناعة البشرية والتهاب الكبد والمجالات ذات الصلة، بما يتناسب مع الأنظمة الصحية المحلية واحتياجات القوى العاملة.",
    "work.p2.t": "بناء القدرات",
    "work.p2.d": "العمل مع المهنيين الصحيين والمنظمات المحلية لتعزيز المعرفة وإعداد معلمين محليين ودعم التحسينات المستدامة في رعاية الصحة الجنسية وفيروس نقص المناعة البشرية والتهاب الكبد.",
    "work.p3.t": "الشراكات العالمية",
    "work.p3.d": "بناء شراكات طويلة الأمد مع المنظمات المحلية والجامعات والمؤسسات الصحية للتصميم المشترك وتقديم برامج تعليمية مستدامة.",

    "where.title": "أين نعمل",
    "where.hint": "اختر دولة مظللة لترى ما قمنا به هناك.",
    "where.fallback": "تعذر تحميل الخريطة. استخدم قائمة الدول بدلًا من ذلك.",

    "country.sd.name": "السودان",
    "country.sd.meta": "شراكة SHAWG",
    "country.sd.summary": "برنامج تدريب تأسيسي في العدوى المنقولة جنسيًا يُقدَّم بالشراكة مع SHAWG.",
    "country.ng.name": "نيجيريا",
    "country.ng.meta": "شركاء دوليون",
    "country.ng.summary": "ورشة عمل في الصحة الجنسية والإنجابية للمراهقين تُقدَّم مع شركاء دوليين.",
    "country.tz.name": "تنزانيا",
    "country.tz.meta": "RDTC · ILDS",
    "country.tz.summary": "برنامج تعليمي في الصحة الجنسية والعدوى المنقولة جنسيًا بالشراكة مع RDTC وILDS.",
    "country.gb.name": "المملكة المتحدة",
    "country.gb.meta": "هيئة تدريس متطوعة",
    "country.gb.summary": "مقر هيئة التدريس المتطوعة والتطوير التعليمي والتعاون الدولي.",

    "impact.title": "تأثيرنا",
    "impact.lede": "تقيس IFSHHE أثرها من خلال آراء المشاركين وتقييمات المعرفة والشراكات طويلة الأمد. هدفنا بناء قدرات محلية مستدامة تستمر إلى ما بعد البرامج التدريبية الفردية.",
    "impact.s1.t": "الدول التي ندعمها",
    "impact.s1.d": "السودان، نيجيريا، تنزانيا",
    "impact.s2.t": "المهنيون الصحيون",
    "impact.s2.d": "بناء المعرفة والمهارات من خلال التعليم والتدريب.",
    "impact.s3.t": "الشراكات",
    "impact.s3.d": "العمل مع المنظمات المحلية والمتعاونين الدوليين.",
    "impact.s4.t": "التعليم المستدام",
    "impact.s4.d": "دعم القدرات طويلة الأمد من خلال نماذج تدريب المدربين.",

    "gallery.title": "لحظات من عملنا",

    "members.title": "تعرّف على هيئة التدريس المتطوعة",

    "contact.title": "شارك معنا",
    "contact.lede": "نرحب بالتعاون مع المنظمات الصحية والجامعات والجمعيات المهنية والمنظمات غير الحكومية التي تشاركنا الالتزام بتحسين رعاية الصحة الجنسية وفيروس نقص المناعة البشرية من خلال التعليم والشراكة وبناء القدرات المستدامة.",
    "contact.direct": "البريد الإلكتروني المباشر",
    "form.name": "الاسم الكامل",
    "form.email": "عنوان البريد الإلكتروني",
    "form.message": "الرسالة / الاستفسار",
    "form.send": "استفسر الآن",

    "footer.tagline": "تمكين التثقيف في الصحة الجنسية حول العالم من خلال الشراكات العالمية وبرامج التدريب القائمة على الأدلة.",
    "footer.visits": "زيارة حتى الآن",
    "footer.copyright": "المؤسسة الدولية للتثقيف في الصحة الجنسية وفيروس نقص المناعة البشرية. جميع الحقوق محفوظة.",
  },

  sw: {
    "skip": "Ruka hadi maudhui",
    "brand.sub": "Afya ya uzazi · Elimu ya UKIMWI",
    "lang.label": "Lugha",
    "nav.menu": "Menyu",
    "nav.about": "Sisi ni nani",
    "nav.work": "Tunachofanya",
    "nav.where": "Mahali tunapofanya kazi",
    "nav.impact": "Matokeo",
    "nav.gallery": "Matunzio",
    "nav.members": "Wanachama",
    "nav.contact": "Wasiliana nasi",

    "hero.kicker": "Huru · Inayoongozwa na Wajitolea · Ulimwenguni kote",
    "hero.title": "Kujenga elimu endelevu ya afya ya uzazi na UKIMWI ulimwenguni kote",
    "hero.lede": "Kaimarisha mifumo ya huduma za afya kupitia elimu endelevu, ushirikiano na ujenga uwezo — iliyoundwa na madaktari wa eneo husika.",
    "hero.cta1": "Shirikiana nasi",
    "hero.cta2": "Mahali tunapofanya kazi",
    "hero.photoAlt": "Matabibu katika mafunzo ya IFSHHE",

    "about.title": "Sisi ni nani",
    "about.p1": "Taasisi ya Kimataifa ya Elimu ya Afya ya Ngono na VVU (IFSHHE) ni shirika huru linaloongozwa na wajitolea, linalojitolea kuimarisha elimu ya afya ya ngono, VVU na homa ya ini duniani kote.",
    "about.p2": "Tunashirikiana na wataalamu wa afya na mashirika ya ndani kutoa elimu endelevu inayozingatia utamaduni, inayojenga uwezo, kusaidia uendelezaji wa huduma na kuboresha huduma kwa wagonjwa.",
    "about.photoAlt": "Washiriki wa warsha wakifanya kazi pamoja",

    "work.title": "Tunachofanya",
    "work.p1.t": "Elimu na Mafunzo",
    "work.p1.d": "Kutoa elimu na mafunzo yanayotegemea ushahidi kuhusu magonjwa ya zinaa, VVU, homa ya ini na maeneo yanayohusiana, yanayoendana na mifumo ya afya ya ndani na mahitaji ya wafanyakazi.",
    "work.p2.t": "Kujenga Uwezo",
    "work.p2.d": "Kufanya kazi na wataalamu wa afya na mashirika ya ndani kuimarisha maarifa, kuwaandaa waelimishaji wa ndani na kusaidia maboresho endelevu katika huduma za afya ya ngono, VVU na homa ya ini.",
    "work.p3.t": "Ushirikiano wa Kimataifa",
    "work.p3.d": "Kujenga ushirikiano wa muda mrefu na mashirika ya ndani, vyuo vikuu na taasisi za afya ili kubuni pamoja na kutoa programu endelevu za elimu.",

    "where.title": "Mahali tunapofanya kazi",
    "where.hint": "Chagua nchi iliyoangaziwa kuona tulichofanya huko.",
    "where.fallback": "Ramani haikupakia. Tumia orodha ya nchi badala yake.",

    "country.sd.name": "Sudan",
    "country.sd.meta": "Ushirikiano wa SHAWG",
    "country.sd.summary": "Programu ya mafunzo ya msingi ya magonjwa ya zinaa inayotolewa kwa ushirikiano na SHAWG.",
    "country.ng.name": "Nigeria",
    "country.ng.meta": "Washirika wa Kimataifa",
    "country.ng.summary": "Warsha ya afya ya ngono na uzazi kwa vijana balehe iliyotolewa pamoja na washirika wa kimataifa.",
    "country.tz.name": "Tanzania",
    "country.tz.meta": "RDTC · ILDS",
    "country.tz.summary": "Programu ya elimu ya afya ya ngono na magonjwa ya zinaa kwa ushirikiano na RDTC na ILDS.",
    "country.gb.name": "Uingereza",
    "country.gb.meta": "Wafanyakazi Wajitolea",
    "country.gb.summary": "Makao ya walimu wa kujitolea, uendelezaji wa elimu na ushirikiano wa kimataifa.",

    "impact.title": "Matokeo Yetu",
    "impact.lede": "IFSHHE hupima matokeo yake kupitia maoni ya washiriki, tathmini za maarifa na ushirikiano wa muda mrefu. Lengo letu ni kujenga uwezo endelevu wa ndani unaoendelea zaidi ya programu za mafunzo binafsi.",
    "impact.s1.t": "Nchi tunazosaidia",
    "impact.s1.d": "Sudan, Nigeria, Tanzania",
    "impact.s2.t": "Wataalamu wa afya",
    "impact.s2.d": "Kujenga maarifa na ujuzi kupitia elimu na mafunzo.",
    "impact.s3.t": "Ushirikiano",
    "impact.s3.d": "Kufanya kazi na mashirika ya ndani na washirika wa kimataifa.",
    "impact.s4.t": "Elimu endelevu",
    "impact.s4.d": "Kusaidia uwezo wa muda mrefu kupitia mifumo ya kuwafundisha walimu.",

    "gallery.title": "Matukio ya kazi yetu",

    "members.title": "Kutana na walimu wa kujitolea",

    "contact.title": "Jiunge Nasi",
    "contact.lede": "Tunakaribisha ushirikiano na mashirika ya afya, vyuo vikuu, vyama vya kitaaluma na NGOs zinazoshiriki dhamira yetu ya kuboresha huduma za afya ya ngono na VVU kupitia elimu, ushirikiano na ujenzi endelevu wa uwezo.",
    "contact.direct": "Barua pepe ya moja kwa moja",
    "form.name": "Jina Kamili",
    "form.email": "Anwani ya Barua Pepe",
    "form.message": "Ujumbe / Ulizo",
    "form.send": "Uliza Sasa",

    "footer.tagline": "Kuwezesha elimu ya afya ya ngono duniani kote kupitia ushirikiano wa kimataifa na programu za mafunzo zinazotegemea ushahidi.",
    "footer.visits": "ziara hadi sasa",
    "footer.copyright": "Taasisi ya Kimataifa ya Elimu ya Afya ya Ngono na VVU. Haki zote zimehifadhiwa.",
  },

  ha: {
    "skip": "Tsallaka zuwa abun ciki",
    "brand.sub": "Ayyukan kiwon lafiya · Ilimin kanjamau",
    "lang.label": "Harshe",
    "nav.menu": "Menu",
    "nav.about": "Wane ne mu",
    "nav.work": "Abin da muke yi",
    "nav.where": "Inda muke aiki",
    "nav.impact": "Sakamako",
    "nav.gallery": "Hotuna",
    "nav.members": "Mambobi",
    "nav.contact": "Tuntube mu",

    "hero.kicker": "Mai zaman kanta · Masu sa-kai ke jagoranta · A duk duniya",
    "hero.title": "Gina ingantaccen ilimin kiwon lafiyar jiki da kanjamau a duk duniya",
    "hero.lede": "Haɓaka tsarin kiwon lafiya ta hanyar ilimi mai ɗorewa, haɗin gwiwa da haɓaka ƙarfin aiki — tare da likitocin gida.",
    "hero.cta1": "Haɗa gwiwa da mu",
    "hero.cta2": "Inda muke aiki",
    "hero.photoAlt": "Likitoci a wani horo na IFSHHE",

    "about.title": "Wane ne mu",
    "about.p1": "Gidauniyar Ƙasa da Ƙasa don Ilimin Lafiyar Jima'i da HIV (IFSHHE) ƙungiya ce mai zaman kanta da masu sa kai ke jagoranta, wadda ta sadaukar da kanta wajen ƙarfafa ilimin lafiyar jima'i, HIV da ciwon hanta a duniya baki ɗaya.",
    "about.p2": "Muna haɗin gwiwa da ma'aikatan lafiya da ƙungiyoyin gida don samar da ilimi mai ɗorewa wanda ya dace da al'ada, wanda ke gina ƙarfin aiki, tallafa wa bunƙasar ayyuka da inganta kula da marasa lafiya.",
    "about.photoAlt": "Mahalarta taron bita suna aiki tare",

    "work.title": "Abin da muke yi",
    "work.p1.t": "Ilimi da Horo",
    "work.p1.d": "Samar da ilimi da horo bisa hujja kan cututtukan da ake ɗauka ta jima'i, HIV, ciwon hanta da fannoni masu alaƙa, wanda ya dace da tsarin lafiyar gida da bukatun ma'aikata.",
    "work.p2.t": "Haɓaka Ƙarfin Aiki",
    "work.p2.d": "Aiki tare da ma'aikatan lafiya da ƙungiyoyin gida don ƙarfafa ilimi, horar da malaman gida da tallafa wa ci gaba mai ɗorewa a kula da lafiyar jima'i, HIV da ciwon hanta.",
    "work.p3.t": "Haɗin Gwiwa Na Duniya",
    "work.p3.d": "Gina haɗin gwiwa na dogon lokaci da ƙungiyoyin gida, jami'o'i da cibiyoyin lafiya don tsarawa tare da gudanar da shirye-shiryen ilimi masu ɗorewa.",

    "where.title": "Inda muke aiki",
    "where.hint": "Zaɓi ƙasar da aka haskaka don ganin abin da muka yi a can.",
    "where.fallback": "Taswirar ta kasa lodi. Yi amfani da jerin ƙasashe.",

    "country.sd.name": "Sudan",
    "country.sd.meta": "Haɗin gwiwar SHAWG",
    "country.sd.summary": "Shirin horo na farko kan cututtukan da ake ɗauka ta jima'i da aka gudanar tare da SHAWG.",
    "country.ng.name": "Najeriya",
    "country.ng.meta": "Abokan tarayya na duniya",
    "country.ng.summary": "Taron bita kan lafiyar jima'i da haihuwa ga matasa da aka gudanar tare da abokan hulɗa na ƙasa da ƙasa.",
    "country.tz.name": "Tanzaniya",
    "country.tz.meta": "RDTC · ILDS",
    "country.tz.summary": "Shirin ilimin lafiyar jima'i da cututtukan jima'i tare da haɗin gwiwar RDTC da ILDS.",
    "country.gb.name": "Ƙasar Biritaniya",
    "country.gb.meta": "Likitoci masu sa-kai",
    "country.gb.summary": "Gidan malamai masu sa kai, bunƙasa ilimi da haɗin gwiwa na ƙasa da ƙasa.",

    "impact.title": "Sakamakonmu",
    "impact.lede": "IFSHHE na auna tasirinta ta ra'ayoyin mahalarta, tantance ilimi da haɗin gwiwa na dogon lokaci. Burinmu shi ne gina ƙarfin gida mai ɗorewa wanda zai ci gaba bayan kowane shirin horo.",
    "impact.s1.t": "Ƙasashen da muke tallafa wa",
    "impact.s1.d": "Sudan, Najeriya, Tanzaniya",
    "impact.s2.t": "Ma'aikatan lafiya",
    "impact.s2.d": "Gina ilimi da ƙwarewa ta hanyar ilimi da horo.",
    "impact.s3.t": "Haɗin gwiwa",
    "impact.s3.d": "Aiki tare da ƙungiyoyin gida da abokan hulɗa na ƙasa da ƙasa.",
    "impact.s4.t": "Ilimi mai ɗorewa",
    "impact.s4.d": "Tallafa wa ƙarfin aiki na dogon lokaci ta hanyar horar da masu horarwa.",

    "gallery.title": "Lokutan aikinmu",

    "members.title": "Haɗu da malamanmu masu sa kai",

    "contact.title": "Shiga Ciki",
    "contact.lede": "Muna maraba da haɗin gwiwa da ƙungiyoyin lafiya, jami'o'i, ƙungiyoyin ƙwararru da NGOs waɗanda suke da burinmu na inganta kula da lafiyar jima'i da HIV ta hanyar ilimi, haɗin gwiwa da gina ƙarfin aiki mai ɗorewa.",
    "contact.direct": "Adireshin Imel na kai tsaye",
    "form.name": "Cikakken Suna",
    "form.email": "Adireshin Imel",
    "form.message": "Sako / Tambaya",
    "form.send": "Yi Tambaya Yanzu",

    "footer.tagline": "Ƙarfafa ilimin lafiyar jima'i a duniya ta hanyar haɗin gwiwa na duniya da shirye-shiryen horo bisa hujja.",
    "footer.visits": "ziyara zuwa yanzu",
    "footer.copyright": "Gidauniyar Ƙasa da Ƙasa don Ilimin Lafiyar Jima'i da HIV. Duk haƙƙoƙi an kiyaye su.",
  },
};

/* Languages written right-to-left. */
window.IFSHHE_RTL = ["ar"];

/* Names shown in the language menu (each in its own language). */
window.IFSHHE_LANG_NAMES = { en: "English", ar: "العربية", sw: "Kiswahili", ha: "Hausa" };

/*
 * t(key, vars) — look up a text key in the page's language, falling back to
 * English and then to the key itself. `vars` fills {placeholders}:
 *   t("form.ok.t", { name: "Amina" })  ->  "Thank you, Amina."
 */
window.t = function (key, vars) {
  const dict = window.IFSHHE_I18N;
  const lang = (document.documentElement.lang || "en").slice(0, 2);
  let text = (dict[lang] && dict[lang][key]) ?? dict.en[key] ?? key;
  if (vars && typeof text === "string") {
    text = text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
  }
  return text;
};
