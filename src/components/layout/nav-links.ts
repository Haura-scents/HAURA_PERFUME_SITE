export type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Shop",
    href: "/shop",
    children: [
      { label: "All Fragrances", href: "/shop" },
      { label: "Women", href: "/shop/women" },
      { label: "Men", href: "/shop/men" },
      { label: "Unisex", href: "/shop/unisex" },
      { label: "Discovery Sets", href: "/shop/discovery-sets" },
    ],
  },
  { label: "Collections", href: "/collections" },
  { label: "Discover", href: "/discover" },
  { label: "Gifts", href: "/gifts" },
  { label: "About", href: "/about" },
];

export const FOOTER_LINKS = {
  shop: [
    { label: "Women", href: "/shop/women" },
    { label: "Men", href: "/shop/men" },
    { label: "Unisex", href: "/shop/unisex" },
    { label: "Discovery Sets", href: "/shop/discovery-sets" },
    { label: "Gifts", href: "/gifts" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Discover", href: "/discover" },
    { label: "Collections", href: "/collections" },
  ],
  support: [
    { label: "My Account", href: "/account" },
    { label: "Order History", href: "/account/orders" },
    { label: "Returns Policy", href: "/legal/returns" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Returns", href: "/legal/returns" },
  ],
};
