// Browser Web Speech API helpers — client-only.

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function speak(text: string, lang: "fr" | "en") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const target = lang === "fr" ? "fr" : "en";
  const voices = window.speechSynthesis.getVoices();
  const v =
    voices.find((v) => v.lang.toLowerCase().startsWith(target + "-")) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(target));
  if (v) u.voice = v;
  u.lang = v?.lang ?? (target === "fr" ? "fr-FR" : "en-US");
  u.rate = 1;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}
