// =========================================================
// MENGENFORMATIERUNG FÜR BACKREZEPTE
// =========================================================

/**
 * Rundet eine Zahl auf maximal eine Nachkommastelle.
 *
 * Beispiele:
 * 200       -> 200
 * 216.666   -> 216.7
 * 162.5     -> 162.5
 */
function roundAmount(amount) {
  return Math.round((amount + Number.EPSILON) * 10) / 10;
}

/**
 * Prüft, ob eine Zahl ganzzahlig ist.
 */
function isInteger(value) {
  return Number.isInteger(value);
}

/**
 * Wandelt einfache Brüche in schöne Unicode-Brüche um.
 *
 * 0.25 -> ¼
 * 0.5  -> ½
 * 0.75 -> ¾
 */
function formatFraction(value) {
  const fractions = {
    0.25: "¼",
    0.5: "½",
    0.75: "¾",
  };

  return fractions[value] || null;
}

/**
 * Formatiert eine Zahl für die Anzeige.
 *
 * Beispiele:
 *
 * 2       -> "2"
 * 2.5     -> "2,5"
 * 0.5     -> "½"
 * 1.5     -> "1½"
 * 1.25    -> "1¼"
 * 1.75    -> "1¾"
 */
export function formatNumber(value) {
  const rounded = roundAmount(value);

  if (isInteger(rounded)) {
    return String(rounded);
  }

  const whole = Math.floor(rounded);
  const fraction = roundAmount(rounded - whole);

  const fractionText = formatFraction(fraction);

  if (fractionText) {
    if (whole === 0) {
      return fractionText;
    }

    return `${whole}${fractionText}`;
  }

  return rounded.toString().replace(".", ",");
}

/**
 * Formatiert eine Zutat inklusive Menge und Einheit.
 *
 * Beispiele:
 *
 * {
 *   amount: 200,
 *   unit: "g",
 *   name: "Mehl"
 * }
 *
 * -> "200 g Mehl"
 */
export function formatIngredient(ingredient, amount = ingredient.amount) {
  if (!ingredient) {
    return "";
  }

  const formattedAmount = formatNumber(amount);

  const unit = ingredient.unit?.trim() || "";

  const name = ingredient.name?.trim() || "";

  // -------------------------------------------------------
  // Stück-Zutaten
  // -------------------------------------------------------

  if (unit.toLowerCase() === "stück") {
    return formatPieceIngredient(formattedAmount, amount, name);
  }

  // -------------------------------------------------------
  // Normale Zutaten
  // -------------------------------------------------------

  return [formattedAmount, unit, name].filter(Boolean).join(" ");
}

/**
 * Formatiert Zutaten, deren Einheit "Stück" ist.
 *
 * Aus:
 *
 * 1 Stück Eier
 *
 * wird:
 *
 * 1 Ei
 *
 * und:
 *
 * 2 Stück Eier
 *
 * wird:
 *
 * 2 Eier
 */
function formatPieceIngredient(formattedAmount, amount, name) {
  const singularNames = {
    ei: "Ei",
    eier: "Ei",
  };

  const normalizedName = name.toLowerCase();

  if (amount === 1 && singularNames[normalizedName]) {
    return `${formattedAmount} ${singularNames[normalizedName]}`;
  }

  if (normalizedName === "ei" && amount !== 1) {
    return `${formattedAmount} Eier`;
  }

  return `${formattedAmount} ${name}`;
}
