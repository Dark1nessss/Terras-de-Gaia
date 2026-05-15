# CPT & ACF Setup: Programas + Advertisement

## Overview

Two new CPTs to set up in WordPress Admin, then connect via TypeScript lib functions.

---

# PART 1: PROGRAMAS (Program Library - Simplified)

## Overview

**Post fields** (WordPress native): Title, Slug, Excerpt, Featured Image  
**ACF fields** (3 only): Category, Featured, Seasons JSON

## WordPress Admin Setup

### Step 1: Create CPT in Custom Post Type UI

| Setting | Value |
|---|---|
| **Post Type Slug** | `programas` |
| **Plural Label** | Programas |
| **Singular Label** | Programa |
| **Description** | Biblioteca de Programas com Temporadas e Episódios |
| **Supports** | Title, Excerpt, Thumbnail, Custom Fields |
| **Has Archive** | Yes |
| **Menu Position** | 7 |
| **Show in REST** | Yes |
| **REST Base** | `programas` |

### Step 2: Create ACF Field Group

**Field Group Name:** `Detalhes do Programa`  
**Location Rule:** Post Type is equal to `programas`

#### ACF Fields (3 total):

| # | Field Label | Field Name | Field Type | Notes |
|---|---|---|---|---|
| 1 | Categoria | `categoria_programa` | Select | Options: Documentário, Desporto, Magazine, Infantil, Outro |
| 2 | Destaque em Gaia Play? | `destaque_gaia_play` | True/False | Show in featured section |
| 3 | Temporadas (JSON) | `temporadas_json` | Textarea | Paste JSON structure (see example below) |

### Example Temporadas JSON

Paste this into the `temporadas_json` field:

```json
[
  {
    "numero_temporada": 1,
    "descricao_temporada": "Primeira temporada",
    "data_inicio": "2024-01-15",
    "episodios": [
      {
        "numero": 1,
        "titulo": "Episódio Inicial",
        "data": "2024-01-15",
        "link_youtube": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "duracao": 45
      },
      {
        "numero": 2,
        "titulo": "Segundo Episódio",
        "data": "2024-01-22",
        "link_youtube": "https://www.youtube.com/watch?v=jNQXAC9IVRw",
        "duracao": 42
      }
    ]
  }
]
```

---

# PART 2: ADVERTISEMENT (Simple Ad System)

## Overview

Simple advertising system with **7 fields only**:  
1. **Position** (includes format) - Where and what size
2. **Image** - The ad media (required)
3. **Media Type** - What kind (image, GIF, video)
4. **Start/End Dates** - When to show
5. **Click URL** - Where it links to
6. **Active** - On/off toggle

## WordPress Admin Setup

### Step 1: Create CPT in Custom Post Type UI

| Setting | Value |
|---|---|
| **Post Type Slug** | `advertisement` |
| **Plural Label** | Publicidade |
| **Singular Label** | Anúncio |
| **Description** | Anúncios Visuais |
| **Supports** | Title (admin only), Thumbnail, Custom Fields |
| **Has Archive** | No |
| **Menu Position** | 8 |
| **Show in REST** | Yes |
| **REST Base** | `advertisement` |

### Step 2: Create ACF Field Group

**Field Group Name:** `Detalhes do Anúncio`  
**Location Rule:** Post Type is equal to `advertisement`

#### Fields (7 total):

| # | Field Label | Field Name | Field Type | Notes |
|---|---|---|---|---|
| 1 | Posição do Anúncio | `posicao_anuncio` | Select | sidebar_square, sidebar_wide, featured_wide, etc. |
| 2 | Imagem do Anúncio | `image_ad` | Image | JPG, PNG, GIF, MP4 (required) |
| 3 | Tipo de Mídia | `tipo_de_midia` | Select | Options: image, gif, muted_video |
| 4 | Data de Início | `data_inicio` | Date Picker | When campaign starts (optional) |
| 5 | Data de Fim | `data_fim` | Date Picker | When campaign ends (optional) |
| 6 | URL de Clique | `url_clickthrough` | URL | Where clicking the ad goes (optional) |
| 7 | Ativo? | `ativo` | True/False | Turn on/off (default: true) |

### Example Positions (Select Options for Field #1)

```
sidebar_square
sidebar_tall
featured_wide
featured_tall
inline_square
footer_wide
```

**Naming:** `position_format`  
- **Positions:** sidebar, featured, inline, footer
- **Formats:** square (1:1), tall (1:2), wide (2:1)

### Media Guidelines

- **Images:** JPG, PNG (<200KB recommended)
- **GIFs:** Animated GIF (<500KB recommended, max 2MB)
- **Muted Videos:** MP4/WebM, NO AUDIO (max 10MB, max 30s)

**Recommended sizes for each format:**
- `square`: 300x300px
- `wide`: 1200x600px
- `tall`: 600x1200px

---

## How Components Use This

Components call `getAdsByPosition('sidebar_square')` to fetch all ads for that position.  
If multiple ads exist for the same position, they rotate every 5 seconds.

**Example:**
- Sidebar has 3 ads (all position: `sidebar_square`)
- Component displays Ad 1 → 5s → Ad 2 → 5s → Ad 3 → 5s → loops

---

---

## TypeScript Functions (Next.js)

### `/lib/programas.ts`

```typescript
import { getSecureHeaders } from './auth';

const WP_API = process.env.WORDPRESS_API_URL || 'http://localhost:8000/wp-json/wp/v2';

export interface Episode {
  numero: number;
  titulo: string;
  data: string;
  link_youtube: string;
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
  acf: {
    categoria_programa: string;
    destaque_gaia_play: boolean;
    temporadas_json?: string; // JSON string parsed to seasons
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
    const response = await fetch(`${WP_API}/programas?per_page=100`, {
      headers: getSecureHeaders(),
      next: { revalidate: 3600 }, // Cache 1 hour
    });

    if (!response.ok) {
      console.error('Failed to fetch programs:', response.statusText);
      return [];
    }

    const programs = await response.json();
    
    // Parse JSON temporadas for each program
    return programs.map((program: Program) => ({
      ...program,
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
      `${WP_API}/programas?slug=${slug}`,
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
```

### `/lib/ads.ts`

```typescript
import { getSecureHeaders } from './auth';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || process.env.WORDPRESS_API_URL || 'http://localhost:8000/wp-json/wp/v2';

export interface Advertisement {
  id: number;
  title: { rendered: string };
  image_ad?: string;
  acf: {
    posicao_anuncio: string; // Position + Format (e.g., 'sidebar_square', 'featured_wide')
    image_ad?: string; // Image URL from ACF
    tipo_de_midia: 'image' | 'gif' | 'muted_video';
    data_inicio?: string;
    data_fim?: string;
    url_clickthrough?: string;
    ativo: boolean;
  };
}

/**
 * Get all active advertisements within date range
 */
export async function getAds(): Promise<Advertisement[]> {
  try {
    const res = await fetch(`${API_URL}/advertisement?per_page=100`, {
      headers: getSecureHeaders(),
      next: { revalidate: 1800 }, // Cache 30 minutes
    });

    if (!res.ok) {
      console.error('Failed to fetch ads:', res.statusText);
      return [];
    }

    const ads = await res.json();
    const now = new Date();

    // Filter: active + within date range
    return ads.filter((ad: Advertisement) => {
      if (!ad.acf?.ativo) return false;

      const startDate = ad.acf.data_inicio ? new Date(ad.acf.data_inicio) : null;
      const endDate = ad.acf.data_fim ? new Date(ad.acf.data_fim) : null;

      if (startDate && now < startDate) return false;
      if (endDate && now > endDate) return false;

      return true;
    });
  } catch (error) {
    console.error('Error fetching ads:', error);
    return [];
  }
}

/**
 * Get ads by position (e.g., 'sidebar_square', 'featured_wide')
 */
export async function getAdsByPosition(position: string): Promise<Advertisement[]> {
  const allAds = await getAds();
  return allAds.filter((ad) => ad.acf?.posicao_anuncio === position);
}

/**
 * Get single ad by ID
 */
export async function getAdById(id: number): Promise<Advertisement | null> {
  try {
    const res = await fetch(`${API_URL}/advertisement/${id}`, {
      headers: getSecureHeaders(),
      next: { revalidate: 1800 },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching ad:', error);
    return null;
  }
}

/**
 * Get ads grouped by position for rotating galleries
 */
export async function getAdsByPositionGrouped(): Promise<Record<string, Advertisement[]>> {
  const allAds = await getAds();
  return allAds.reduce(
    (acc, ad) => {
      const pos = ad.acf?.posicao_anuncio || 'unknown';
      if (!acc[pos]) acc[pos] = [];
      acc[pos].push(ad);
      return acc;
    },
    {} as Record<string, Advertisement[]>
  );
}
```

/**
 * Get all active advertisements
 */
export async function getAds(): Promise<Advertisement[]> {
  try {
    const res = await fetch(`${API_URL}/advertisement?per_page=100&_embed`, {
      headers: getSecureHeaders(),
      next: { revalidate: 1800 }, // Cache 30 minutes
    });

    if (!res.ok) {
      console.error('Failed to fetch ads:', res.statusText);
      return [];
    }

    const ads = await res.json();
    const now = new Date();

    // Filter: active + within date range
    return ads
      .filter((ad: Advertisement) => {
        if (!ad.acf?.ativo) return false;

        const startDate = ad.acf.data_inicio ? new Date(ad.acf.data_inicio) : null;
        const endDate = ad.acf.data_fim ? new Date(ad.acf.data_fim) : null;

        if (startDate && now < startDate) return false;
        if (endDate && now > endDate) return false;

        return true;
      })
      .map((ad: any) => ({
        ...ad,
        featured_image_url: ad._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      }));
  } catch (error) {
    console.error('Error fetching ads:', error);
    return [];
  }
}

/**
 * Get ads by position
 */
export async function getAdsByPosition(
  position: 'sidebar' | 'featured' | 'inline' | 'footer'
): Promise<Advertisement[]> {
  const allAds = await getAds();
  return allAds.filter((ad) => ad.acf?.posicao_anuncio === position);
}

/**
 * Get ads by category
 */
export async function getAdsByCategory(category: string): Promise<Advertisement[]> {
  const allAds = await getAds();
  return allAds.filter((ad) => ad.acf?.categoria_anuncio === category);
}

/**
 * Get single ad by ID
 */
export async function getAdById(id: number): Promise<Advertisement | null> {
  try {
    const res = await fetch(`${API_URL}/advertisement/${id}?_embed`, {
      headers: getSecureHeaders(),
      next: { revalidate: 1800 },
    });

    if (!res.ok) return null;

    const ad = await res.json();
    return {
      ...ad,
      featured_image_url: ad._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
    };
  } catch (error) {
    console.error('Error fetching ad:', error);
    return null;
  }
}

/**
 * Get ads grouped by position (for gallery/rotation display)
 */
export async function getAdsByPositionGrouped(): Promise<
  Record<'sidebar' | 'featured' | 'inline' | 'footer', Advertisement[]>
> {
  const allAds = await getAds();
  
  return {
    sidebar: allAds.filter((ad) => ad.acf?.posicao_anuncio === 'sidebar'),
    featured: allAds.filter((ad) => ad.acf?.posicao_anuncio === 'featured'),
    inline: allAds.filter((ad) => ad.acf?.posicao_anuncio === 'inline'),
    footer: allAds.filter((ad) => ad.acf?.posicao_anuncio === 'footer'),
  };
}
```

---

## Next Steps

1. ✅ Create both CPTs in WordPress Admin (slug, labels, supports)
2. ✅ Create ACF field groups with fields from tables above
3. ✅ Copy lib/programas.ts and update lib/ads.ts
4. ⏳ Create sample entries in each CPT to test
5. ⏳ Create Next.js pages/components to display data

What components do you want to create next?
- Program portal/grid?
- Program details page (with seasons/episodes)?
- Ad display components?



```json
[
  {
    "numero_temporada": 1,
    "descricao_temporada": "First season",
    "data_inicio": "2024-01-15",
    "episodios": [
      {
        "numero": 1,
        "titulo": "Episode 1",
        "data": "2024-01-15",
        "link_youtube": "https://youtu.be/...",
        "duracao": 52
      } // mais episodios?
      {
        // fazes mais uma destas brackets {}
        "numero": 2,
        "titulo": "Episode 2",
        "data": "2024-01-22",
        "link_youtube": "https://youtu.be/...",
        "duracao": 48
      }
    ]
  } // Nova temporada? fazes aqui mais um {} e segues o mesmo formato que da primeira
  {
    "numero_temporada": 2,
    "descricao_temporada": "Second season",
    "data_inicio": "2024-06-01",
    "episodios": [
      {
        "numero": 1,
        "titulo": "Episode 1",
        "data": "2024-06-01",
        "link_youtube": "https://youtu.be/...",
        "duracao": 50
      }
      {
        "numero": 2,
        "titulo": "Episode 2",
        "data": "2024-06-08",
        "link_youtube": "https://youtu.be/...",
        "duracao": 45
      }
    ]
  }
]
```