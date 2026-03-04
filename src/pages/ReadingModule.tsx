import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mic, MicOff, Star, AlertCircle } from 'lucide-react';
import { PlayfulButton } from '../components/ui/PlayfulButton';
import { CompletionScreen } from '../components/CompletionScreen';
import { ContentData } from '../hooks/useContent';
interface ReadingModuleProps {
  onBack: () => void;
  onComplete: (id: string) => void;
  completedItems: string[];
  content: ContentData;
}
const WORDS_PER_SESSION = 5;
function shuffleAndPick(arr: string[], count: number): string[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
export function ReadingModule({
  onBack,
  onComplete,
  completedItems,
  content
}: ReadingModuleProps) {
  // Pick random words once per session
  const sessionWords = useMemo(() => {
    const allWords = content.words.length > 0 ? content.words : ['Aso'];
    const count = Math.min(WORDS_PER_SESSION, allWords.length);
    return shuffleAndPick(allWords, count);
  }, []); // empty deps = only on mount (new session each time)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<
    'idle' | 'listening' | 'success' | 'error'>(
    'idle');
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [sessionCompletedCount, setSessionCompletedCount] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  const currentWord = sessionWords[currentIndex];
  const isCompleted = completedItems.includes(`read_${currentWord}`);
  const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const hasSupport = !!SpeechRecognition;
  const startListening = () => {
    if (!hasSupport) {
      setErrorMsg('Hindi suportado ng browser mo ang voice recognition.');
      return;
    }
    setStatus('listening');
    setTranscript('');
    setErrorMsg('');
    setIsRecording(true);
    const recognition = new SpeechRecognition();
    recognition.lang = 'fil-PH';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript.toLowerCase().trim();
      setTranscript(speechResult);
      if (!speechResult) {
        setStatus('error');
        setErrorMsg('Walang narinig. Subukan muli.');
        return;
      }
      const normalizedTarget = currentWord.toLowerCase().trim();
      const spokenWords = speechResult.
      replace(/[.,!?]/g, '').
      split(/\s+/).
      map((w: string) => w.trim()).
      filter((w: string) => w.length > 0);
      const isCorrect = spokenWords.some(
        (word: string) => word === normalizedTarget
      );
      if (isCorrect) {
        setStatus('success');
        if (!isCompleted) {
          onComplete(`read_${currentWord}`);
        }
      } else {
        setStatus('error');
        setErrorMsg('');
      }
    };
    recognition.onerror = (event: any) => {
      setStatus('error');
      if (event.error === 'not-allowed') {
        setErrorMsg('Kailangan ng pahintulot sa mikropono.');
      } else {
        setErrorMsg('Hindi ko narinig nang maayos. Subukan muli.');
      }
      setIsRecording(false);
    };
    recognition.onend = () => {
      setIsRecording(false);
      if (statusRef.current === 'listening') {
        setStatus('idle');
      }
    };
    try {
      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      setStatus('error');
      setErrorMsg('May nangyaring mali. Subukan muli.');
      setIsRecording(false);
    }
  };
  const nextWord = () => {
    setStatus('idle');
    setTranscript('');
    const newCompletedCount = sessionCompletedCount + 1;
    setSessionCompletedCount(newCompletedCount);
    if (newCompletedCount >= sessionWords.length) {
      setShowCompletion(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };
  return (
    <div className="min-h-screen bg-basa-bg flex flex-col relative">
      {showCompletion &&
      <CompletionScreen
        title="Magaling! Tapos ka na! 🌟"
        subtitle={`${sessionWords.length}/${sessionWords.length} na salita ang nabasa mo!`}
        starsEarned={sessionWords.length}
        onFinish={onBack} />

      }

      <header className="p-4 flex items-center justify-between bg-white shadow-sm z-10">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 text-basa-text transition-colors"
          aria-label="Bumalik">

          <ArrowLeft size={32} />
        </button>
        <h1 className="font-heading text-3xl font-bold text-basa-secondary">
          Pagbasa
        </h1>
        <div className="w-10 text-center font-bold text-gray-400 font-body">
          {currentIndex + 1}/{sessionWords.length}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
        {!hasSupport &&
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 flex items-start w-full">
            <AlertCircle className="mr-2 shrink-0 mt-1" />
            <p className="font-body text-sm">
              Paumanhin, hindi suportado ng iyong browser ang Voice Recognition.
              Gumamit ng Google Chrome sa Android.
            </p>
          </div>
        }

        {/* Word Display Card — NO speaker button, pupil must read it themselves */}
        <motion.div
          key={currentWord}
          initial={{
            scale: 0.8,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          className="bg-white w-full aspect-[4/3] rounded-[3rem] shadow-lg border-4 border-gray-100 flex flex-col items-center justify-center relative mb-12">

          {isCompleted &&
          <div className="absolute top-6 right-6 text-basa-accent">
              <Star fill="currentColor" size={32} />
            </div>
          }
          <p className="text-gray-500 font-body text-xl font-bold mb-2">
            Basahin ang salita:
          </p>
          <h2 className="text-7xl font-heading font-black text-basa-text tracking-wide text-center px-4 break-words">
            {currentWord}
          </h2>
        </motion.div>

        {/* Feedback Area */}
        <div className="h-24 flex items-center justify-center mb-8 w-full">
          {status === 'listening' &&
          <motion.div
            animate={{
              scale: [1, 1.1, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5
            }}
            className="text-basa-secondary font-bold text-2xl font-heading flex items-center">

              <div className="w-3 h-3 bg-basa-secondary rounded-full mr-2 animate-pulse" />
              Nakikinig...
            </motion.div>
          }

          {status === 'success' &&
          <motion.div
            initial={{
              y: 20,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            className="text-center">

              <h3 className="text-4xl font-heading font-black text-basa-success mb-2">
                Tama!
              </h3>
              <p className="text-gray-600 font-body text-lg">
                Sinabi mo: "{transcript}"
              </p>
            </motion.div>
          }

          {status === 'error' &&
          <motion.div
            initial={{
              x: [-10, 10, -10, 10, 0]
            }}
            className="text-center">

              <h3 className="text-2xl font-heading font-bold text-basa-primary mb-2">
                Subukan muli.
              </h3>
              <p className="text-gray-500 font-body text-sm px-4 text-center">
                {errorMsg || (
              transcript ?
              `Narinig ko: "${transcript}"` :
              'Walang narinig.')}
              </p>
            </motion.div>
          }
        </div>

        {/* Controls */}
        <div className="w-full flex justify-center">
          {status === 'success' ?
          <PlayfulButton
            variant="success"
            size="xl"
            onClick={nextWord}
            className="w-full">

              Susunod na Salita
            </PlayfulButton> :

          <motion.button
            whileHover={{
              scale: 1.05
            }}
            whileTap={{
              scale: 0.95
            }}
            onClick={startListening}
            disabled={isRecording || !hasSupport}
            className={`w-32 h-32 rounded-full flex items-center justify-center shadow-bouncy active:shadow-bouncy-active transition-all ${isRecording ? 'bg-red-500 text-white shadow-[0_6px_0_0_#b91c1c] active:shadow-[0_0px_0_0_#b91c1c]' : 'bg-basa-secondary text-white'} ${!hasSupport ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Magsalita">

              {isRecording ?
            <motion.div
              animate={{
                scale: [1, 1.2, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: 1
              }}>

                  <MicOff size={48} />
                </motion.div> :

            <Mic size={48} />
            }
            </motion.button>
          }
        </div>

        {!isRecording && status !== 'success' && hasSupport &&
        <p className="mt-6 text-gray-500 font-body font-bold text-center">
            Pindutin ang mikropono at basahin ang salita.
          </p>
        }
      </div>
    </div>);

}