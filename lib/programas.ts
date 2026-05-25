
export interface Episode {
  numero: number;
  titulo: string;
  data: string;
  /** Primary video link — Bunny URL (/play/ or /embed/) or YouTube URL. Takes priority over link_youtube. */
  link?: string;
  /** Legacy YouTube-only field. Used as fallback when `link` is absent. */
  link_youtube?: string;
  duracao: number;
}

export interface Season {
  numero_temporada: number;
  descricao_temporada: string;
  data_inicio: string;
  episodios: Episode[];
}

export interface Program {
  id: number;
  title: { rendered: string };
  slug: string; // From post
  excerpt: { rendered: string }; // From post
  featured_media: number; // From post
  featured_image_url?: string; // Added for display
  acf: {
    categoria_programa: string; // Only ACF field for category
    destaque_gaia_play: boolean; // Only ACF field for featured
    temporadas?: string; // JSON string that we'll parse
  };
  temporadas?: Season[]; // Parsed from JSON
}

/**
 * Parse JSON string from ACF field
 */
export function parseTemporadas(jsonString?: string): Season[] {
  if (!jsonString) return [];
  try {
    return JSON.parse(jsonString);
  } catch {
    return [];
  }
}

// Fetch functions live in lib/wp.ts (getProgramas, getProgramaBySlug, getFeaturedProgramas).
// This file exports only shared types and helpers used across the app.
