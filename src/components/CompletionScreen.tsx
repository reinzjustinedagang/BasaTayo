import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { PlayfulButton } from './ui/PlayfulButton';
interface CompletionScreenProps {
  title: string;
  subtitle: string;
  starsEarned: number;
  onFinish: () => void;
}
export function CompletionScreen({
  title,
  subtitle,
  starsEarned,
  onFinish
}: CompletionScreenProps) {
  // Generate random positions for background stars
  const backgroundStars = Array.from({
    length: 12
  }).map((_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    scale: Math.random() * 0.5 + 0.5,
    delay: Math.random() * 0.5
  }));
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      className="absolute inset-0 bg-basa-bg/95 flex flex-col items-center justify-center z-50 p-6 overflow-hidden">

      {/* Confetti Stars */}
      {backgroundStars.map((star) =>
      <motion.div
        key={star.id}
        initial={{
          opacity: 0,
          scale: 0,
          x: 0,
          y: 0
        }}
        animate={{
          opacity: [0, 1, 0],
          scale: star.scale,
          x: `${star.x}vw`,
          y: `${star.y}vh`,
          rotate: 360
        }}
        transition={{
          duration: 2,
          delay: star.delay,
          repeat: Infinity,
          repeatDelay: Math.random() * 2
        }}
        className="absolute text-basa-accent">

          <Star size={32} fill="currentColor" />
        </motion.div>
      )}

      <motion.div
        initial={{
          scale: 0.5,
          y: 50
        }}
        animate={{
          scale: 1,
          y: 0
        }}
        transition={{
          type: 'spring',
          bounce: 0.5
        }}
        className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border-4 border-basa-accent flex flex-col items-center text-center max-w-md w-full relative z-10">

        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 10, 0]
          }}
          transition={{
            duration: 1,
            delay: 0.5
          }}
          className="mb-6 relative">

          <Star
            size={120}
            fill="#FFE66D"
            className="text-basa-accent drop-shadow-lg" />

          <motion.div
            initial={{
              scale: 0
            }}
            animate={{
              scale: 1
            }}
            transition={{
              delay: 1,
              type: 'spring'
            }}
            className="absolute -bottom-4 -right-4 bg-basa-primary text-white font-heading font-bold text-2xl w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-md">

            +{starsEarned}
          </motion.div>
        </motion.div>

        <h2 className="text-5xl font-heading font-black text-basa-primary mb-4 leading-tight">
          {title}
        </h2>

        <p className="text-2xl font-body font-bold text-gray-600 mb-10">
          {subtitle}
        </p>

        <PlayfulButton
          variant="success"
          size="xl"
          onClick={onFinish}
          className="w-full">

          Bumalik sa Home
        </PlayfulButton>
      </motion.div>
    </motion.div>);

}