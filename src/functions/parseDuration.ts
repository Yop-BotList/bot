import prettyMilliseconds from "pretty-ms";

/**
 * Transformer une durée en millisecondes en une durée en années, semaines, jours, heures, minutes (en français)
 * @param {Number} duration - Durée en millisecondes
 * @returns {String}
 */
export default function parseDuration (duration: number) {
    const data = prettyMilliseconds(duration, { compact: true }).replace(/d/g, " jour(s)").replace(/h/g, " heure(s)").replace(/m/g, " minute(s)").replace(/w/g, " semaine(s)").replace(/y/g, " année(s)")

    return data;
}