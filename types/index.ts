export type SceneId =
  | "landing"
  | "memories"
  | "letter"
  | "birthday"
  | "timeline"
  | "reasons"
  | "gallery"
  | "notes"
  | "secret"
  | "finale";

export interface ImageItem {
  src: string;
  alt: string;
}

export interface TimelineItem {
  label: string;
  detail: string;
  date?: string;
}

export interface GiftOption {
  id: string;
  title: string;
  subtitle: string;
  icon: "gift" | "heart" | "lock";
}
