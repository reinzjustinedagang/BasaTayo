import { useState, useEffect } from 'react';

interface ProgressData {
  stars: number;
  completedWriting: string[];
  completedReading: string[];
  ownedStickers: string[];
  unlockedAchievements: string[];
}

const DEFAULT_PROGRESS: ProgressData = {
  stars: 0,
  completedWriting: [],
  completedReading: [],
  ownedStickers: [],
  unlockedAchievements: []
};

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(() => {
    const saved = localStorage.getItem('basaTayoProgress');
    // Merge with DEFAULT_PROGRESS to ensure new fields exist for returning users
    return saved ?
    { ...DEFAULT_PROGRESS, ...JSON.parse(saved) } :
    DEFAULT_PROGRESS;
  });

  useEffect(() => {
    localStorage.setItem('basaTayoProgress', JSON.stringify(progress));
  }, [progress]);

  const checkAchievements = (currentProgress: ProgressData) => {
    const newAchievements = [...currentProgress.unlockedAchievements];
    let updated = false;

    if (
    currentProgress.completedWriting.length > 0 &&
    !newAchievements.includes('first_write'))
    {
      newAchievements.push('first_write');
      updated = true;
    }
    if (
    currentProgress.completedReading.length > 0 &&
    !newAchievements.includes('first_read'))
    {
      newAchievements.push('first_read');
      updated = true;
    }
    if (currentProgress.stars >= 5 && !newAchievements.includes('five_stars')) {
      newAchievements.push('five_stars');
      updated = true;
    }
    if (
    currentProgress.stars >= 20 &&
    !newAchievements.includes('twenty_stars'))
    {
      newAchievements.push('twenty_stars');
      updated = true;
    }

    if (updated) {
      return { ...currentProgress, unlockedAchievements: newAchievements };
    }
    return currentProgress;
  };

  const addStar = () => {
    setProgress((prev) => checkAchievements({ ...prev, stars: prev.stars + 1 }));
  };

  const markWritingComplete = (id: string) => {
    setProgress((prev) => {
      if (prev.completedWriting.includes(id)) return prev;
      const next = {
        ...prev,
        stars: prev.stars + 1,
        completedWriting: [...prev.completedWriting, id]
      };
      return checkAchievements(next);
    });
  };

  const markReadingComplete = (id: string) => {
    setProgress((prev) => {
      if (prev.completedReading.includes(id)) return prev;
      const next = {
        ...prev,
        stars: prev.stars + 1,
        completedReading: [...prev.completedReading, id]
      };
      return checkAchievements(next);
    });
  };

  const buySticker = (id: string, cost: number) => {
    setProgress((prev) => {
      if (prev.stars >= cost && !prev.ownedStickers.includes(id)) {
        return {
          ...prev,
          stars: prev.stars - cost,
          ownedStickers: [...prev.ownedStickers, id]
        };
      }
      return prev;
    });
  };

  const resetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
  };

  return {
    progress,
    addStar,
    markWritingComplete,
    markReadingComplete,
    buySticker,
    resetProgress
  };
}