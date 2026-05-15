import { getSecureHeaders } from './auth';

const WP_API = process.env.WORDPRESS_API_URL || 'http://localhost:8000/wp-json/wp/v2';

export interface Episode {
  numero: number;
  titulo: string;
  data: string;
  link: string;
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
    temporadas_json?: string; // JSON string that we'll parse
  };
  temporadas?: Season[]; // Parsed from JSON
}

/**
 * Parse JSON string from ACF field
 */
function parseTemporadas(jsonString?: string): Season[] {
  if (!jsonString) return [];
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing temporadas JSON:', error);
    return [];
  }
}

/**
 * Get all programs with parsed seasons/episodes
 */
export async function getPrograms(): Promise<Program[]> {
  try {
    const response = await fetch(`${API_URL}/programas?per_page=100&_embed`, {
      headers: getSecureHeaders(),
      next: { revalidate: 3600 }, // Cache 1 hour
    });

    if (!response.ok) {
      console.error('Failed to fetch programs:', response.statusText);
      return [];
    }

    const programs = await response.json();
    
    // Parse JSON temporadas for each program and extract featured image URL
    return programs.map((program: any) => ({
      ...program,
      featured_image_url: program._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      temporadas: parseTemporadas(program.acf?.temporadas_json),
    }));
  } catch (error) {
    console.error('Error fetching programs:', error);
    return [];
  }
}

/**
 * Get program by slug
 */
export async function getProgramBySlug(slug: string): Promise<Program | null> {
  try {
    const response = await fetch(
      `${API_URL}/programas?slug=${slug}&_embed`,
      {
        headers: getSecureHeaders(),
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const program = data[0];
    
    if (!program) return null;
    
    return {
      ...program,
      featured_image_url: program._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      temporadas: parseTemporadas(program.acf?.temporadas_json),
    };
  } catch (error) {
    console.error('Error fetching program:', error);
    return null;
  }
}

/**
 * Get featured programs for Gaia Play
 */
export async function getFeaturedPrograms(): Promise<Program[]> {
  const allPrograms = await getPrograms();
  return allPrograms.filter((p) => p.acf?.destaque_gaia_play === true);
}

/**
 * Get programs by category
 */
export async function getProgramsByCategory(category: string): Promise<Program[]> {
  const allPrograms = await getPrograms();
  return allPrograms.filter((p) => p.acf?.categoria_programa === category);
}
