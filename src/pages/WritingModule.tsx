import React, {
  useEffect,
  useState,
  useRef,
  createElement,
  Component } from
'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eraser, CheckCircle, Star, Volume2 } from 'lucide-react';
import { PlayfulButton } from '../components/ui/PlayfulButton';
import { ContentData } from '../hooks/useContent';
interface WritingModuleProps {
  onBack: () => void;
  onComplete: (id: string) => void;
  completedItems: string[];
  content: ContentData;
}
type CategoryType = 'letters' | 'syllables' | 'words';
export function WritingModule({
  onBack,
  onComplete,
  completedItems,
  content
}: WritingModuleProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('letters');
  const [selectedSyllableGroup, setSelectedSyllableGroup] = useState<
    string | null>(
    null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const handleBack = () => {
    if (selectedItem) {
      setSelectedItem(null);
    } else if (activeCategory === 'syllables' && selectedSyllableGroup) {
      setSelectedSyllableGroup(null);
    } else {
      onBack();
    }
  };
  const renderGridItems = (items: string[]) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((item) => {
          const isCompleted = completedItems.includes(`write_${item}`);
          return (
            <motion.button
              whileHover={{
                scale: 1.05
              }}
              whileTap={{
                scale: 0.95
              }}
              key={item}
              onClick={() => setSelectedItem(item)}
              className="bg-white aspect-square rounded-3xl shadow-sm border-4 border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">

              {isCompleted &&
              <div className="absolute top-2 right-2 text-basa-accent">
                  <Star fill="currentColor" size={24} />
                </div>
              }
              <span className="font-heading text-5xl font-bold text-basa-text">
                {item}
              </span>
            </motion.button>);

        })}
      </div>);

  };
  const renderSyllableGroups = () => {
    return (
      <div className="grid grid-cols-2 gap-4">
        {content.syllableGroups.map((group) => {
          // Calculate progress for this group
          const completedInGroup = group.syllables.filter((s) =>
          completedItems.includes(`write_${s}`)
          ).length;
          const totalInGroup = group.syllables.length;
          const isAllCompleted = completedInGroup === totalInGroup;
          return (
            <motion.button
              whileHover={{
                scale: 1.05
              }}
              whileTap={{
                scale: 0.95
              }}
              key={group.letter}
              onClick={() => setSelectedSyllableGroup(group.letter)}
              className="bg-white p-6 rounded-3xl shadow-sm border-4 border-gray-100 flex flex-col items-center justify-center relative overflow-hidden min-h-[160px]">

              {isAllCompleted &&
              <div className="absolute top-3 right-3 text-basa-accent">
                  <Star fill="currentColor" size={28} />
                </div>
              }
              <span className="font-heading text-6xl font-black text-basa-primary mb-2">
                {group.letter}
              </span>
              <div className="bg-gray-100 px-4 py-1 rounded-full">
                <span className="font-body font-bold text-gray-500 text-sm">
                  {completedInGroup}/{totalInGroup} tapos
                </span>
              </div>
            </motion.button>);

        })}
      </div>);

  };
  return (
    <div className="min-h-screen bg-basa-bg flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between bg-white shadow-sm z-10">
        <button
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-gray-100 text-basa-text transition-colors"
          aria-label="Bumalik">

          <ArrowLeft size={32} />
        </button>
        <h1 className="font-heading text-3xl font-bold text-basa-primary">
          {selectedItem ? 'I-trace ang titik' : 'Pagsulat'}
        </h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {!selectedItem ?
      <div className="flex-1 flex flex-col p-4 max-w-2xl mx-auto w-full">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar py-4 mb-4">
            <button
            onClick={() => {
              setActiveCategory('letters');
              setSelectedSyllableGroup(null);
            }}
            className={`whitespace-nowrap px-6 py-3 rounded-full font-heading text-xl font-bold transition-colors ${activeCategory === 'letters' ? 'bg-basa-secondary text-white shadow-md' : 'bg-white text-basa-text border-2 border-gray-200'}`}>

              Mga Titik
            </button>
            <button
            onClick={() => {
              setActiveCategory('syllables');
              setSelectedSyllableGroup(null);
            }}
            className={`whitespace-nowrap px-6 py-3 rounded-full font-heading text-xl font-bold transition-colors ${activeCategory === 'syllables' ? 'bg-basa-secondary text-white shadow-md' : 'bg-white text-basa-text border-2 border-gray-200'}`}>

              Mga Pantig
            </button>
            <button
            onClick={() => {
              setActiveCategory('words');
              setSelectedSyllableGroup(null);
            }}
            className={`whitespace-nowrap px-6 py-3 rounded-full font-heading text-xl font-bold transition-colors ${activeCategory === 'words' ? 'bg-basa-secondary text-white shadow-md' : 'bg-white text-basa-text border-2 border-gray-200'}`}>

              Mga Salita
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeCategory === 'letters' && renderGridItems(content.letters)}

            {activeCategory === 'words' && renderGridItems(content.words)}

            {activeCategory === 'syllables' &&
          <>
                {!selectedSyllableGroup ?
            renderSyllableGroups() :

            <motion.div
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              className="flex flex-col">

                    <h2 className="font-heading text-2xl font-bold text-gray-600 mb-4 text-center">
                      Mga pantig ng {selectedSyllableGroup}
                    </h2>
                    {renderGridItems(
                content.syllableGroups.find(
                  (g) => g.letter === selectedSyllableGroup
                )?.syllables || []
              )}
                  </motion.div>
            }
              </>
          }
          </div>
        </div> :

      <TracingCanvas
        word={selectedItem}
        onSuccess={() => {
          onComplete(`write_${selectedItem}`);
        }}
        onNext={() => setSelectedItem(null)} />

      }
    </div>);

}
// --- Tracing Canvas Component ---
function TracingCanvas({
  word,
  onSuccess,
  onNext




}: {word: string;onSuccess: () => void;onNext: () => void;}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const guideCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<
    Array<{
      x: number;
      y: number;
    }>>(
    []);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  // Build a pixel mask of the guide text so we know WHERE the letter is
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 20;
      ctx.strokeStyle = '#FF6B6B';
    }
    // Create an offscreen canvas to render the guide text as a pixel mask
    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const offCtx = offscreen.getContext('2d');
    if (offCtx) {
      const fontSize =
      word.length > 2 ? canvas.height * 0.45 : canvas.height * 0.65;
      offCtx.font = `800 ${fontSize}px "Baloo 2", cursive`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillStyle = '#000000';
      offCtx.fillText(word, offscreen.width / 2, offscreen.height / 2);
    }
    guideCanvasRef.current = offscreen;
    // Reset state for new word
    setDrawnPoints([]);
    setStatus('idle');
  }, [word]);
  const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX =
    'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
    'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (status === 'success') return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const coords = getCoords(e);
    if (!ctx || !coords) return;
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setDrawnPoints((prev) => [...prev, coords]);
  };
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || status === 'success') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const coords = getCoords(e);
    if (!ctx || !coords) return;
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setDrawnPoints((prev) => [...prev, coords]);
  };
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawnPoints([]);
    setStatus('idle');
  };
  const checkResult = () => {
    const guideCanvas = guideCanvasRef.current;
    if (!guideCanvas || drawnPoints.length < 10) {
      setStatus('error');
      return;
    }
    const guideCtx = guideCanvas.getContext('2d');
    if (!guideCtx) {
      setStatus('error');
      return;
    }
    const guideData = guideCtx.getImageData(
      0,
      0,
      guideCanvas.width,
      guideCanvas.height
    );
    // Helper: check if a pixel coordinate is on the guide text (with tolerance radius)
    const isOnGuide = (px: number, py: number, tolerance: number): boolean => {
      for (let dx = -tolerance; dx <= tolerance; dx += 2) {
        for (let dy = -tolerance; dy <= tolerance; dy += 2) {
          const sx = Math.round(px + dx);
          const sy = Math.round(py + dy);
          if (
          sx < 0 ||
          sy < 0 ||
          sx >= guideCanvas.width ||
          sy >= guideCanvas.height)

          continue;
          const idx = (sy * guideCanvas.width + sx) * 4;
          if (guideData.data[idx + 3] > 50) return true; // alpha > 50 means text pixel
        }
      }
      return false;
    };
    // 1. PRECISION: What % of drawn points are on the guide text?
    const tolerance = 28; // px tolerance around the guide stroke
    let onGuideCount = 0;
    for (const pt of drawnPoints) {
      if (isOnGuide(pt.x, pt.y, tolerance)) {
        onGuideCount++;
      }
    }
    const precision = onGuideCount / drawnPoints.length;
    // 2. COVERAGE: Divide guide text bounding area into grid cells, check how many were hit
    // Find bounding box of guide text pixels
    let minX = guideCanvas.width,
      maxX = 0,
      minY = guideCanvas.height,
      maxY = 0;
    for (let y = 0; y < guideCanvas.height; y += 4) {
      for (let x = 0; x < guideCanvas.width; x += 4) {
        const idx = (y * guideCanvas.width + x) * 4;
        if (guideData.data[idx + 3] > 50) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    const gridCols = Math.max(3, Math.min(8, word.length * 3));
    const gridRows = 4;
    const cellW = (maxX - minX) / gridCols;
    const cellH = (maxY - minY) / gridRows;
    const hitCells = new Set<string>();
    // Check which grid cells have guide text
    const guideCells = new Set<string>();
    for (let y = minY; y <= maxY; y += 4) {
      for (let x = minX; x <= maxX; x += 4) {
        const idx = (y * guideCanvas.width + x) * 4;
        if (guideData.data[idx + 3] > 50) {
          const col = Math.floor((x - minX) / cellW);
          const row = Math.floor((y - minY) / cellH);
          guideCells.add(`${col},${row}`);
        }
      }
    }
    // Check which guide cells were hit by drawn points
    for (const pt of drawnPoints) {
      if (pt.x >= minX && pt.x <= maxX && pt.y >= minY && pt.y <= maxY) {
        const col = Math.floor((pt.x - minX) / cellW);
        const row = Math.floor((pt.y - minY) / cellH);
        const key = `${col},${row}`;
        if (guideCells.has(key)) {
          hitCells.add(key);
        }
      }
    }
    const coverage = guideCells.size > 0 ? hitCells.size / guideCells.size : 0;
    // Both precision (>= 50% of strokes on guide) and coverage (>= 40% of letter covered) must pass
    if (precision >= 0.5 && coverage >= 0.4) {
      setStatus('success');
      onSuccess();
    } else {
      setStatus('error');
    }
  };
  const speakWord = () => {
    // Check for custom uploaded audio first
    const customAudioUrl = (window as any).__basaTayoContent?.customAudio?.[
    word];

    // Try reading from localStorage directly since we don't have props here
    if (!customAudioUrl) {
      try {
        const saved = localStorage.getItem('basaTayoContent');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.customAudio?.[word]) {
            const audio = new Audio(parsed.customAudio[word]);
            audio.play().catch(() => {});
            return;
          }
        }
      } catch (e) {}
    } else {
      const audio = new Audio(customAudioUrl);
      audio.play().catch(() => {});
      return;
    }
    // Fallback to speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'fil-PH';
      utterance.rate = 0.8;
      const voices = window.speechSynthesis.getVoices();
      const filVoice = voices.find(
        (v) => v.lang.includes('fil') || v.lang.includes('tl')
      );
      if (filVoice) {
        utterance.voice = filVoice;
      } else {
        const fallbackVoice = voices.find(
          (v) => v.lang.includes('es') || v.lang.includes('id')
        );
        if (fallbackVoice) utterance.voice = fallbackVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };
  return (
    <div className="flex-1 flex flex-col p-4 max-w-2xl mx-auto w-full">
      <div className="flex justify-end mb-4">
        <PlayfulButton
          variant="secondary"
          size="sm"
          onClick={speakWord}
          className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
          aria-label="Pakinggan">

          <Volume2 size={28} />
        </PlayfulButton>
      </div>
      <div className="flex-1 relative bg-white rounded-3xl shadow-inner border-4 border-gray-100 overflow-hidden mb-6 flex items-center justify-center">
        {/* Dotted Guide Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span
            className="font-heading font-bold text-trace"
            style={{
              fontSize: word.length > 2 ? '8rem' : '14rem'
            }}>

            {word}
          </span>
        </div>

        {/* Drawing Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full touch-none" />


        {/* Success Overlay */}
        {status === 'success' &&
        <motion.div
          initial={{
            scale: 0,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20">

            <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 10, 0]
            }}
            transition={{
              duration: 0.5
            }}>

              <Star
              size={100}
              fill="#FFE66D"
              className="text-basa-accent mb-4 drop-shadow-md" />

            </motion.div>
            <h2 className="text-5xl font-heading font-black text-basa-primary drop-shadow-sm">
              Magaling!
            </h2>
          </motion.div>
        }
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <PlayfulButton
          variant="accent"
          size="lg"
          onClick={clearCanvas}
          className="flex-1">

          <Eraser className="mr-2" /> Burahin
        </PlayfulButton>

        {status === 'success' ?
        <PlayfulButton
          variant="success"
          size="lg"
          onClick={onNext}
          className="flex-1">

            Susunod <ArrowLeft className="ml-2 rotate-180" />
          </PlayfulButton> :

        <PlayfulButton
          variant="primary"
          size="lg"
          onClick={checkResult}
          className="flex-1">

            <CheckCircle className="mr-2" /> Tapos na
          </PlayfulButton>
        }
      </div>

      {status === 'error' &&
      <motion.p
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="text-center mt-4 text-xl font-bold text-red-500 font-body">

          Subukan ulit. I-trace nang mabuti sa ibabaw ng titik!
        </motion.p>
      }
    </div>);

}