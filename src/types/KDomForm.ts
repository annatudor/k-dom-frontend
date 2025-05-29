// src/types/KDomForm.ts
import type { Hub, Language, KDomTheme } from "@/types/KDom"; // import corect

export interface FormData {
  kdomName: string;
  kdomUrl: string;
  language: Language;
  description: string;
  hub: Hub;
  theme: KDomTheme;
  contentHtml: string;
  isForKids: boolean; // backend name
}
