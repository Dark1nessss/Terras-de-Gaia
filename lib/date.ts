const PT_LOCALE = "pt-PT";

export function formatDate(date: Date | string, format: "full" | "short" = "full"): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (format === "short") {
    return d.toLocaleDateString(PT_LOCALE, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  if (format === "full") {
    return d.toLocaleDateString(PT_LOCALE, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return d.toLocaleDateString(PT_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function formatExibicao(dateTimeString: string | null | undefined): string {
  if (!dateTimeString) return "Não especificado";
  
  try {
    const str = dateTimeString.toString().trim();
    
    let date: Date;
    
    // Formato: "2026-05-20 19:00:00" (WordPress datetime)
    if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(str)) {
      const [datePart, timePart] = str.split(' ');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute] = timePart.split(':').map(Number);
      date = new Date(year, month - 1, day, hour, minute, 0);
    } else {
      // Tentar parse genérico
      date = new Date(str);
    }
    
    if (isNaN(date.getTime())) {
      return "Não especificado";
    }
    
    const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
                  'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const dia = dias[date.getDay()];
    const hora = date.toLocaleTimeString(PT_LOCALE, { hour: '2-digit', minute: '2-digit' });
    
    return `${dia} às ${hora}`;
  } catch (error) {
    console.error('[formatExibicao] Error:', error);
    return "Não especificado";
  }
}

export function formatYear(yearString: string | null | undefined): string {
  if (!yearString) return new Date().getFullYear().toString();
  
  try {
    const str = yearString.toString().trim();
    
    // Se é YYYYMMDD (8 dígitos)
    if (/^\d{8}$/.test(str)) {
      return str.substring(0, 4);
    }
    
    // Se já é só o ano (4 dígitos)
    if (/^\d{4}$/.test(str)) {
      return str;
    }
    
    // Se é uma data (YYYY-MM-DD ou similar)
    const date = new Date(str);
    if (!isNaN(date.getTime())) {
      return date.getFullYear().toString();
    }
    
    return new Date().getFullYear().toString();
  } catch (error) {
    return new Date().getFullYear().toString();
  }
}