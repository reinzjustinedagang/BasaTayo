import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ShoppingBag, Check } from 'lucide-react';
import { PlayfulButton } from '../components/ui/PlayfulButton';
import { ContentData } from '../hooks/useContent';
interface ShopScreenProps {
  onBack: () => void;
  stars: number;
  ownedStickers: string[];
  onBuySticker: (id: string, cost: number) => void;
  content: ContentData;
}
export const STICKERS = [
{
  id: 'sticker_apple',
  name: 'Mansanas',
  cost: 5,
  icon: '🍎'
},
{
  id: 'sticker_star',
  name: 'Gintong Bituin',
  cost: 10,
  icon: '⭐'
},
{
  id: 'sticker_medal',
  name: 'Medalya',
  cost: 15,
  icon: '🏅'
},
{
  id: 'sticker_trophy',
  name: 'Tropeo',
  cost: 20,
  icon: '🏆'
},
{
  id: 'sticker_crown',
  name: 'Korona',
  cost: 25,
  icon: '👑'
},
{
  id: 'sticker_rocket',
  name: 'Rocket',
  cost: 30,
  icon: '🚀'
}];

export function ShopScreen({
  onBack,
  stars,
  ownedStickers,
  onBuySticker,
  content
}: ShopScreenProps) {
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
        <h1 className="font-heading text-3xl font-bold text-basa-accent flex items-center">
          <ShoppingBag className="mr-2" /> Tindahan
        </h1>
        <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
          <Star className="text-basa-accent mr-1" fill="#FFE66D" size={20} />
          <span className="font-heading font-bold text-basa-text text-xl">
            {stars}
          </span>
        </div>
      </header>

      <div className="flex-1 p-6 max-w-2xl mx-auto w-full">
        <p className="text-center font-body text-gray-600 mb-8 text-lg">
          Gamitin ang iyong mga bituin para bumili ng mga sticker!
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {content.stickers.map((sticker) => {
            const isOwned = ownedStickers.includes(sticker.id);
            const canAfford = stars >= sticker.cost;
            return (
              <motion.div
                key={sticker.id}
                whileHover={{
                  scale: 1.02
                }}
                className={`bg-white rounded-3xl p-4 flex flex-col items-center text-center border-4 shadow-sm ${isOwned ? 'border-basa-success' : 'border-gray-100'}`}>

                <div className="text-6xl mb-4 mt-2">{sticker.icon}</div>
                <h3 className="font-heading font-bold text-lg text-basa-text mb-2 line-clamp-1">
                  {sticker.name}
                </h3>

                <div className="mt-auto w-full">
                  {isOwned ?
                  <div className="bg-green-100 text-green-700 font-body font-bold py-2 rounded-xl flex items-center justify-center w-full">
                      <Check size={18} className="mr-1" /> Nabili na
                    </div> :

                  <PlayfulButton
                    variant={canAfford ? 'accent' : 'secondary'}
                    size="sm"
                    className={`w-full ${!canAfford ? 'opacity-50' : ''}`}
                    onClick={() =>
                    canAfford && onBuySticker(sticker.id, sticker.cost)
                    }
                    disabled={!canAfford}>

                      <Star size={16} fill="currentColor" className="mr-1" />{' '}
                      {sticker.cost}
                    </PlayfulButton>
                  }
                </div>
              </motion.div>);

          })}
        </div>
      </div>
    </div>);

}