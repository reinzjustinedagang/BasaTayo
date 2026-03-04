import { useState, useEffect } from 'react';

export interface SyllableGroup {
  letter: string;
  syllables: string[];
}

export interface Sticker {
  id: string;
  name: string;
  cost: number;
  icon: string;
}

export interface ContentData {
  letters: string[];
  words: string[];
  syllableGroups: SyllableGroup[];
  stickers: Sticker[];
  customAudio: Record<string, string>; // key = text (e.g. "A", "Ba", "Aso"), value = base64 data URL
}

const DEFAULT_CONTENT: ContentData = {
  letters: ['A', 'B', 'K', 'D', 'M'],
  words: ['Aso', 'Bata', 'Nanay', 'Ama', 'Bola'],
  syllableGroups: [
  { letter: 'B', syllables: ['Ba', 'Be', 'Bi', 'Bo', 'Bu'] },
  { letter: 'K', syllables: ['Ka', 'Ke', 'Ki', 'Ko', 'Ku'] },
  { letter: 'D', syllables: ['Da', 'De', 'Di', 'Do', 'Du'] },
  { letter: 'M', syllables: ['Ma', 'Me', 'Mi', 'Mo', 'Mu'] }],

  stickers: [
  { id: 'sticker_apple', name: 'Mansanas', cost: 5, icon: '🍎' },
  { id: 'sticker_star', name: 'Gintong Bituin', cost: 10, icon: '⭐' },
  { id: 'sticker_medal', name: 'Medalya', cost: 15, icon: '🏅' },
  { id: 'sticker_trophy', name: 'Tropeo', cost: 20, icon: '🏆' },
  { id: 'sticker_crown', name: 'Korona', cost: 25, icon: '👑' },
  { id: 'sticker_rocket', name: 'Rocket', cost: 30, icon: '🚀' }],

  customAudio: {}
};

export function useContent() {
  const [content, setContent] = useState<ContentData>(() => {
    const saved = localStorage.getItem('basaTayoContent');
    return saved ?
    { ...DEFAULT_CONTENT, ...JSON.parse(saved) } :
    DEFAULT_CONTENT;
  });

  useEffect(() => {
    localStorage.setItem('basaTayoContent', JSON.stringify(content));
  }, [content]);

  const addLetter = (letter: string) => {
    if (!content.letters.includes(letter)) {
      setContent((prev) => ({ ...prev, letters: [...prev.letters, letter] }));
    }
  };

  const removeLetter = (letter: string) => {
    setContent((prev) => ({
      ...prev,
      letters: prev.letters.filter((l) => l !== letter)
    }));
  };

  const addWord = (word: string) => {
    if (!content.words.includes(word)) {
      setContent((prev) => ({ ...prev, words: [...prev.words, word] }));
    }
  };

  const removeWord = (word: string) => {
    setContent((prev) => ({
      ...prev,
      words: prev.words.filter((w) => w !== word)
    }));
  };

  const addSyllableGroup = (letter: string, syllables: string[]) => {
    setContent((prev) => {
      const existing = prev.syllableGroups.find((g) => g.letter === letter);
      if (existing) {
        return {
          ...prev,
          syllableGroups: prev.syllableGroups.map((g) =>
          g.letter === letter ?
          {
            ...g,
            syllables: Array.from(
              new Set([...g.syllables, ...syllables])
            )
          } :
          g
          )
        };
      }
      return {
        ...prev,
        syllableGroups: [...prev.syllableGroups, { letter, syllables }]
      };
    });
  };

  const removeSyllableGroup = (letter: string) => {
    setContent((prev) => ({
      ...prev,
      syllableGroups: prev.syllableGroups.filter((g) => g.letter !== letter)
    }));
  };

  const addSticker = (sticker: Sticker) => {
    if (!content.stickers.find((s) => s.id === sticker.id)) {
      setContent((prev) => ({ ...prev, stickers: [...prev.stickers, sticker] }));
    }
  };

  const removeSticker = (id: string) => {
    setContent((prev) => ({
      ...prev,
      stickers: prev.stickers.filter((s) => s.id !== id)
    }));
  };

  const setCustomAudio = (text: string, dataUrl: string) => {
    setContent((prev) => ({
      ...prev,
      customAudio: { ...prev.customAudio, [text]: dataUrl }
    }));
  };

  const removeCustomAudio = (text: string) => {
    setContent((prev) => {
      const next = { ...prev.customAudio };
      delete next[text];
      return { ...prev, customAudio: next };
    });
  };

  const resetContent = () => {
    setContent(DEFAULT_CONTENT);
  };

  return {
    content,
    addLetter,
    removeLetter,
    addWord,
    removeWord,
    addSyllableGroup,
    removeSyllableGroup,
    addSticker,
    removeSticker,
    setCustomAudio,
    removeCustomAudio,
    resetContent
  };
}