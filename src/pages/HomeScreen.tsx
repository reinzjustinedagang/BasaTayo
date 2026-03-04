import React, { Children } from 'react';
import { motion } from 'framer-motion';
import { Star, Edit3, Mic, ShoppingBag, Trophy, Settings } from 'lucide-react';
import { PlayfulButton } from '../components/ui/PlayfulButton';
interface HomeScreenProps {
  onNavigate: (
  screen: 'home' | 'writing' | 'reading' | 'shop' | 'achievements' | 'admin')
  => void;
  stars: number;
}
export function HomeScreen({ onNavigate, stars }: HomeScreenProps) {
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };
  return (
    <div className="min-h-screen bg-basa-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Admin Button — top right corner */}
      <motion.button
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          delay: 1
        }}
        onClick={() => onNavigate('admin')}
        className="absolute top-4 right-4 z-20 p-3 bg-white/80 rounded-full shadow-sm border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
        title="Admin Panel">

        <Settings size={20} />
      </motion.button>

      {/* Decorative Background Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: 'easeInOut'
        }}
        className="absolute top-10 left-10 text-basa-accent opacity-50">

        <Star size={64} fill="currentColor" />
      </motion.div>
      <motion.div
        animate={{
          y: [0, 20, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: 'easeInOut'
        }}
        className="absolute bottom-20 right-10 text-basa-secondary opacity-30">

        <div className="w-32 h-16 bg-current rounded-full blur-xl" />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md flex flex-col items-center z-10">

        {/* Progress Badge — centered again */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex items-center bg-white px-6 py-3 rounded-full shadow-md border-2 border-basa-accent">

          <Star className="text-basa-accent mr-2" fill="#FFE66D" size={32} />
          <span className="font-heading text-2xl font-bold text-basa-text">
            {stars} Bituin
          </span>
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.h1
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 2
            }}
            className="text-6xl font-heading font-black text-basa-primary mb-4 drop-shadow-md">

            BasaTayo
          </motion.h1>
          <p className="font-body text-xl font-bold text-basa-text opacity-80">
            Matuto tayong bumasa at sumulat!
          </p>
        </motion.div>

        {/* Main Buttons */}
        <div className="w-full space-y-4">
          <motion.div variants={itemVariants}>
            <PlayfulButton
              variant="primary"
              size="xl"
              onClick={() => onNavigate('writing')}
              className="w-full flex justify-between px-8">

              <span className="flex items-center gap-4">
                <Edit3 size={36} />
                Pagsulat
              </span>
            </PlayfulButton>
          </motion.div>

          <motion.div variants={itemVariants}>
            <PlayfulButton
              variant="secondary"
              size="xl"
              onClick={() => onNavigate('reading')}
              className="w-full flex justify-between px-8">

              <span className="flex items-center gap-4">
                <Mic size={36} />
                Pagbasa
              </span>
            </PlayfulButton>
          </motion.div>

          {/* Secondary Row: Shop & Achievements */}
          <motion.div variants={itemVariants} className="flex gap-4 pt-4">
            <PlayfulButton
              variant="accent"
              size="lg"
              onClick={() => onNavigate('shop')}
              className="flex-1 flex flex-col items-center py-4">

              <ShoppingBag size={28} className="mb-1" />
              <span className="text-lg">Tindahan</span>
            </PlayfulButton>

            <PlayfulButton
              variant="success"
              size="lg"
              onClick={() => onNavigate('achievements')}
              className="flex-1 flex flex-col items-center py-4">

              <Trophy size={28} className="mb-1" />
              <span className="text-lg">Nakamit</span>
            </PlayfulButton>
          </motion.div>
        </div>
      </motion.div>
    </div>);

}