import React, { useState } from 'react';
import { HomeScreen } from './pages/HomeScreen';
import { WritingModule } from './pages/WritingModule';
import { ReadingModule } from './pages/ReadingModule';
import { ShopScreen } from './pages/ShopScreen';
import { AchievementScreen } from './pages/AchievementScreen';
import { AdminScreen } from './pages/AdminScreen';
import { useProgress } from './hooks/useProgress';
import { useContent } from './hooks/useContent';
type Screen = 'home' | 'writing' | 'reading' | 'shop' | 'achievements' | 'admin';
export function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const { progress, markWritingComplete, markReadingComplete, buySticker } =
  useProgress();
  const {
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
  } = useContent();
  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };
  return (
    <div className="w-full min-h-screen bg-basa-bg font-body text-basa-text selection:bg-basa-accent selection:text-basa-text">
      {currentScreen === 'home' &&
      <HomeScreen onNavigate={navigateTo} stars={progress.stars} />
      }

      {currentScreen === 'writing' &&
      <WritingModule
        onBack={() => navigateTo('home')}
        onComplete={markWritingComplete}
        completedItems={progress.completedWriting}
        content={content} />

      }

      {currentScreen === 'reading' &&
      <ReadingModule
        onBack={() => navigateTo('home')}
        onComplete={markReadingComplete}
        completedItems={progress.completedReading}
        content={content} />

      }

      {currentScreen === 'shop' &&
      <ShopScreen
        onBack={() => navigateTo('home')}
        stars={progress.stars}
        ownedStickers={progress.ownedStickers}
        onBuySticker={buySticker}
        content={content} />

      }

      {currentScreen === 'achievements' &&
      <AchievementScreen
        onBack={() => navigateTo('home')}
        unlockedAchievements={progress.unlockedAchievements}
        ownedStickers={progress.ownedStickers}
        content={content} />

      }

      {currentScreen === 'admin' &&
      <AdminScreen
        onBack={() => navigateTo('home')}
        content={content}
        addLetter={addLetter}
        removeLetter={removeLetter}
        addWord={addWord}
        removeWord={removeWord}
        addSyllableGroup={addSyllableGroup}
        removeSyllableGroup={removeSyllableGroup}
        addSticker={addSticker}
        removeSticker={removeSticker}
        setCustomAudio={setCustomAudio}
        removeCustomAudio={removeCustomAudio}
        resetContent={resetContent} />

      }
    </div>);

}