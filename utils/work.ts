export type WorkProject = {
  code: string;
  name: string;
  category: string;

  background: string;
  foreground: string;
  accent: string;

  href: string;

  themeWord: string;

  intent: string;
  benefit: string;

  items: readonly {
    number: string;
    title: string;
    subtitle?: string;
  }[];
};

export const WORK_PROJECTS: readonly WorkProject[] = [
  {
    code: "W — 001",
    name: "Elevro",
    category: "Enterprise Engineering",

    background: "#DCE8ED",
    foreground: "#102A33",
    accent: "#527987",

    href: "https://elevro.com",

    themeWord: "CLARITY",

    intent:
      "Five complex engineering capabilities shaped into one connected digital story.",

    benefit:
      "Designed to make service discovery clearer, strengthen enterprise credibility and create a more focused path toward enquiry.",

    items: [
      {
        number: "01",
        title: "Quality Engineering",
      },
      {
        number: "02",
        title: "Product Enablement",
      },
      {
        number: "03",
        title: "Artificial Intelligence",
      },
      {
        number: "04",
        title: "Cloud Engineering",
      },
      {
        number: "05",
        title: "Digital Engineering",
      },
    ],
  },

  {
    code: "W — 002",
    name: "KP Wood Craft",
    category: "Craftsmanship & Interiors",

    background: "#D7B37B",
    foreground: "#20150E",
    accent: "#7A4326",

    href: "https://kpwoodcraft.in",

    themeWord: "CRAFT",

    intent:
      "Bringing the precision and personality of handcrafted woodwork into a refined digital experience.",

    benefit:
      "Designed to build trust before the first conversation, make custom services easier to explore and reinforce the premium nature of the craftsmanship.",

    items: [
      {
        number: "01",
        title: "Custom Furniture",
      },
      {
        number: "02",
        title: "Carpentry",
      },
      {
        number: "03",
        title: "Interiors",
      },
      {
        number: "04",
        title: "Renovation",
      },
      {
        number: "05",
        title: "Wood Craft",
      },
    ],
  },

  {
    code: "W — 003",
    name: "Shuruup",
    category: "Private Markets",

    background: "#07111F",
    foreground: "#F4F1E8",
    accent: "#D8B35A",

    href: "https://shuruup.com",

    themeWord: "DISCOVERY",

    intent:
      "Turning private-market complexity into an experience built around discovery, clarity and curated access.",

    benefit:
      "Designed to make alternative investment opportunities easier to understand while creating a more premium and trust-led digital experience.",

    items: [
      {
        number: "01",
        title: "Pre-IPO",
      },
      {
        number: "02",
        title: "High-Growth Startups",
      },
      {
        number: "03",
        title: "Private Equity",
      },
      {
        number: "04",
        title: "Institutional Opportunities",
      },
      {
        number: "05",
        title: "Curated Access",
      },
    ],
  },

  {
    code: "W — 004",
    name: "Anmol Medicare",
    category: "Flutter Healthcare Application",

    background: "#E7F3EF",
    foreground: "#12352D",
    accent: "#49A889",

    href: "#",

    themeWord: "FLOW",

    intent:
      "An end-to-end healthcare application experience spanning discovery, booking, payments, reports and ongoing patient care.",

    benefit:
      "Designed to reduce friction across complex healthcare journeys and provide one consistent place for tests, bookings, reports and care.",

    items: [
      {
        number: "01",
        title: "Discover",
        subtitle: "Tests & Packages",
      },
      {
        number: "02",
        title: "Book",
        subtitle: "Lab & Slot Selection",
      },
      {
        number: "03",
        title: "Pay",
        subtitle: "Payment & Confirmation",
      },
      {
        number: "04",
        title: "Manage",
        subtitle: "Bookings & Reports",
      },
      {
        number: "05",
        title: "Care",
        subtitle: "Home Care & Consultation",
      },
      {
        number: "06",
        title: "Account",
        subtitle: "Profile, Family & Corporate",
      },
    ],
  },
];
