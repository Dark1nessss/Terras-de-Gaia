import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Vila Nova de Gaia coordinates
const LAT = 41.1348;
const LON = -8.6150;

const WEATHER_DATA: Record<number, { condition: string; icon: string }> = {
  0:  { condition: 'Céu Limpo',             icon: 'sun'              },
  1:  { condition: 'Principalmente Limpo',  icon: 'cloud-sun'        },
  2:  { condition: 'Parcialmente Nublado',  icon: 'cloud-sun'        },
  3:  { condition: 'Nublado',               icon: 'cloud'            },
  45: { condition: 'Nevoeiro',              icon: 'cloud-fog'        },
  48: { condition: 'Nevoeiro Gelado',       icon: 'cloud-fog'        },
  51: { condition: 'Chuvisco Leve',         icon: 'cloud-drizzle'    },
  53: { condition: 'Chuvisco',              icon: 'cloud-drizzle'    },
  55: { condition: 'Chuvisco Intenso',      icon: 'cloud-drizzle'    },
  61: { condition: 'Chuva Leve',            icon: 'cloud-rain'       },
  63: { condition: 'Chuva',                 icon: 'cloud-rain'       },
  65: { condition: 'Chuva Intensa',         icon: 'cloud-rain'       },
  71: { condition: 'Neve Leve',             icon: 'cloud-snow'       },
  73: { condition: 'Neve',                  icon: 'snowflake'        },
  75: { condition: 'Neve Intensa',          icon: 'snowflake'        },
  80: { condition: 'Aguaceiros',            icon: 'cloud-rain'       },
  81: { condition: 'Aguaceiros Fortes',     icon: 'cloud-lightning'  },
  82: { condition: 'Aguaceiros Violentos',  icon: 'cloud-lightning'  },
  95: { condition: 'Trovoada',              icon: 'cloud-lightning'  },
  96: { condition: 'Trovoada com Granizo',  icon: 'cloud-lightning'  },
  99: { condition: 'Trovoada com Granizo',  icon: 'cloud-lightning'  },
};

export async function GET() {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code&timezone=Europe%2FLisbon`,
      { next: { revalidate: 3600 } } // Cache 1 hour
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Weather fetch failed' }, { status: 502 });
    }

    const data = await res.json();
    const temperature = Math.round(data.current.temperature_2m);
    const entry = WEATHER_DATA[data.current.weather_code as number] ?? { condition: 'Condições Variáveis', icon: '🌡️' };

    return NextResponse.json({ temperature, condition: entry.condition, icon: entry.icon });
  } catch {
    return NextResponse.json({ error: 'Weather unavailable' }, { status: 500 });
  }
}
