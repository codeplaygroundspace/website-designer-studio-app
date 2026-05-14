export type StudioCategory =
  | "Top of page"
  | "Welcome / intro"
  | "About"
  | "Testimonials"
  | "Footer";

export type StudioAsset = {
  id: string;
  title: string;
  category: StudioCategory;
  image: string;
  height: number;
};

export const studioCategories: StudioCategory[] = [
  "Top of page",
  "Welcome / intro",
  "About",
  "Testimonials",
  "Footer",
];

export const studioAssets: StudioAsset[] = [
  {
    id: "section-about-01",
    title: "About section",
    category: "About",
    image: "/studio-assets/sections/about/about-01.png",
    height: 540,
  },
  {
    id: "section-footer-01",
    title: "Footer section",
    category: "Footer",
    image: "/studio-assets/sections/footer/footer-01.png",
    height: 540,
  },
  {
    id: "section-hero-01",
    title: "Top of page 01",
    category: "Top of page",
    image: "/studio-assets/sections/hero/hero-01.png",
    height: 540,
  },
  {
    id: "section-hero-02",
    title: "Top of page 02",
    category: "Top of page",
    image: "/studio-assets/sections/hero/hero-02.png",
    height: 540,
  },
  {
    id: "section-hero-03",
    title: "Top of page 03",
    category: "Top of page",
    image: "/studio-assets/sections/hero/hero-03.png",
    height: 540,
  },
  {
    id: "section-hero-04",
    title: "Top of page 04",
    category: "Top of page",
    image: "/studio-assets/sections/hero/hero-04.png",
    height: 540,
  },
  {
    id: "section-testimonial-01",
    title: "Testimonials section",
    category: "Testimonials",
    image: "/studio-assets/sections/testimonial/testimonial-01.png",
    height: 540,
  },
  {
    id: "section-welcome-01",
    title: "Welcome section",
    category: "Welcome / intro",
    image: "/studio-assets/sections/welcome/welcome-01.png",
    height: 540,
  },
];

export const studioAssetsById = new Map(
  studioAssets.map((asset) => [asset.id, asset]),
);
