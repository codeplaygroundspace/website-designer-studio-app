export type StudioCategory =
  | "Pages"
  | "Sections"
  | "Navigations"
  | "Media"
  | "Forms"
  | "Utility";

export type StudioAsset = {
  id: string;
  title: string;
  category: StudioCategory;
  image: string;
  height: number;
};

export const studioCategories: StudioCategory[] = [
  "Pages",
  "Sections",
  "Navigations",
  "Media",
  "Forms",
  "Utility",
];

export const studioAssets: StudioAsset[] = [
  {
    id: "page-landing",
    title: "Landing page",
    category: "Pages",
    image: "/studio-assets/page-landing.svg",
    height: 900,
  },
  {
    id: "page-detail",
    title: "Detail page",
    category: "Pages",
    image: "/studio-assets/page-detail.svg",
    height: 900,
  },
  {
    id: "section-hero",
    title: "Editorial hero",
    category: "Sections",
    image: "/studio-assets/section-hero.svg",
    height: 520,
  },
  {
    id: "section-gallery",
    title: "Gallery grid",
    category: "Sections",
    image: "/studio-assets/section-gallery.svg",
    height: 500,
  },
  {
    id: "nav-minimal",
    title: "Minimal nav",
    category: "Navigations",
    image: "/studio-assets/nav-minimal.svg",
    height: 120,
  },
  {
    id: "nav-split",
    title: "Split nav",
    category: "Navigations",
    image: "/studio-assets/nav-split.svg",
    height: 140,
  },
  {
    id: "media-feature",
    title: "Feature image",
    category: "Media",
    image: "/studio-assets/media-feature.svg",
    height: 460,
  },
  {
    id: "media-mosaic",
    title: "Image mosaic",
    category: "Media",
    image: "/studio-assets/media-mosaic.svg",
    height: 520,
  },
  {
    id: "form-inquiry",
    title: "Inquiry form",
    category: "Forms",
    image: "/studio-assets/form-inquiry.svg",
    height: 560,
  },
  {
    id: "form-newsletter",
    title: "Newsletter band",
    category: "Forms",
    image: "/studio-assets/form-newsletter.svg",
    height: 300,
  },
  {
    id: "utility-footer",
    title: "Footer",
    category: "Utility",
    image: "/studio-assets/utility-footer.svg",
    height: 360,
  },
  {
    id: "utility-cta",
    title: "Call to action",
    category: "Utility",
    image: "/studio-assets/utility-cta.svg",
    height: 360,
  },
];

export const studioAssetsById = new Map(
  studioAssets.map((asset) => [asset.id, asset]),
);
