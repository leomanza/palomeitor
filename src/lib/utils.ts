import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const adjectives = [
  "Audaz", "Valiente", "Calmo", "Astuto", "Curioso", "Veloz",
  "Elegante", "Leal", "Amistoso", "Gentil", "Grandioso", "Honorable",
  "Intrépido", "Jovial", "Agudo", "Misterioso", "Noble", "Observador",
  "Pacífico", "Rápido", "Silencioso", "Firme", "Confiable", "Vigilante",
  "Sabio", "Juguetón", "Resplandeciente", "Triunfante", "Urbano"
];

const nouns = [
  "Halcón", "Paloma", "Gorrión", "Águila", "Zorzal", "Cardenal",
  "Vencejo", "Colibrí", "Mirlo", "Búho", "Cernícalo", "Gavilán",
  "Patrullero", "Vigía", "Explorador", "Guardián", "Mensajero", "Navegante",
  "Pionero", "Rastreador", "Vagabundo", "Centinela", "Viajero", "Observador",
  "Cazador", "Correcaminos", "Defensor", "Maestro", "Líder"
];

// Simple hashing function to get a number from a string
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function generateAlias(userId: string): string {
  const hash = simpleHash(userId);
  const adjIndex = hash % adjectives.length;
  // Use a slightly different hash for the noun to increase combinations
  const nounIndex = (hash >> 8) % nouns.length; 
  return `${adjectives[adjIndex]} ${nouns[nounIndex]}`;
}
