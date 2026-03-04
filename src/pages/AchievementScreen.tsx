import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Award, Lock } from 'lucide-react';
import { ContentData } from '../hooks/useContent';
import { STICKERS } from './ShopScreen';
interface AchievementScreenProps {
  onBack: () => void;
  unlockedAchievements: string[];
  ownedStickers: string[];
  content: ContentData;
}
const ACHIEVEMENTS = [
{
  id: 'first_write',
  title: 'Unang Pagsulat',
  desc: 'Nakapagsulat ng unang titik o salita.',
  icon: '✏️'
},
{
  id: 'first_read',
  title: 'Unang Pagbasa',
  desc: 'Nakapagbasa ng unang salita.',
  icon: '📖'
},
{
  id: 'five_stars',
  title: 'Limang Bituin',
  desc: 'Nakamit ang 5 bituin.',
  icon: '🌟'
},
{
  id: 'twenty_stars',
  title: 'Dalawampung Bituin',
  desc: 'Nakamit ang 20 bituin.',
  icon: '✨'
}];

export function AchievementScreen({
  onBack,
  unlockedAchievements,
  ownedStickers,
  content
}: AchievementScreenProps) {
  const [activeTab, setActiveTab] = useState<'achievements' | 'stickers'>(
    'achievements'
  );
  const ownedStickerData = content.stickers.filter((s) =>
  ownedStickers.includes(s.id)
  );
  return (
    <div className="min-h-screen bg-basa-bg flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between bg-white shadow-sm z-10">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 text-basa-text transition-colors"
          aria-label="Bumalik">

          <ArrowLeft size={32} />
        </button>
        <h1 className="font-heading text-3xl font-bold text-basa-primary flex items-center">
          <Trophy className="mr-2" /> Mga Nakamit
        </h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <div className="flex-1 flex flex-col p-4 max-w-2xl mx-auto w-full">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 bg-white p-2 rounded-full shadow-sm border-2 border-gray-100">
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-3 rounded-full font-heading text-lg font-bold transition-colors ${activeTab === 'achievements' ? 'bg-basa-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>

            Mga Achievement
          </button>
          <button
            onClick={() => setActiveTab('stickers')}
            className={`flex-1 py-3 rounded-full font-heading text-lg font-bold transition-colors ${activeTab === 'stickers' ? 'bg-basa-accent text-basa-text shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>

            Mga Sticker
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'achievements' &&
          <div className="space-y-4">
              {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              return (
                <motion.div
                  key={achievement.id}
                  initial={{
                    opacity: 0,
                    y: 10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  className={`bg-white p-4 rounded-3xl border-4 flex items-center gap-4 shadow-sm ${isUnlocked ? 'border-basa-success' : 'border-gray-200 opacity-70'}`}>

                    <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${isUnlocked ? 'bg-green-100' : 'bg-gray-100'}`}>

                      {isUnlocked ?
                    achievement.icon :

                    <Lock className="text-gray-400" />
                    }
                    </div>
                    <div>
                      <h3
                      className={`font-heading font-bold text-xl ${isUnlocked ? 'text-basa-text' : 'text-gray-500'}`}>

                        {achievement.title}
                      </h3>
                      <p className="font-body text-sm text-gray-500">
                        {isUnlocked ?
                      achievement.desc :
                      'Ipagpatuloy ang pag-aaral para mabuksan ito.'}
                      </p>
                    </div>
                    {isUnlocked &&
                  <div className="ml-auto text-basa-success">
                        <Award size={28} />
                      </div>
                  }
                  </motion.div>);

            })}
            </div>
          }

          {activeTab === 'stickers' &&
          <div>
              {ownedStickerData.length === 0 ?
            <div className="text-center py-12 bg-white rounded-3xl border-4 border-dashed border-gray-200">
                  <div className="text-6xl mb-4 opacity-50">🛍️</div>
                  <h3 className="font-heading text-xl text-gray-500 font-bold mb-2">
                    Wala pang sticker
                  </h3>
                  <p className="font-body text-gray-400">
                    Bumili ng mga sticker sa Tindahan!
                  </p>
                </div> :

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {ownedStickerData.map((sticker) =>
              <motion.div
                key={sticker.id}
                initial={{
                  scale: 0
                }}
                animate={{
                  scale: 1
                }}
                className="bg-white aspect-square rounded-3xl border-4 border-gray-100 flex items-center justify-center text-5xl shadow-sm"
                title={sticker.name}>

                      {sticker.icon}
                    </motion.div>
              )}
                </div>
            }
            </div>
          }
        </div>
      </div>
    </div>);

}