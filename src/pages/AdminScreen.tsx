import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Settings,
  RotateCcw,
  Volume2,
  Upload,
  X } from
'lucide-react';
import { ContentData, Sticker } from '../hooks/useContent';
import { PlayfulButton } from '../components/ui/PlayfulButton';
interface AdminScreenProps {
  onBack: () => void;
  content: ContentData;
  addLetter: (letter: string) => void;
  removeLetter: (letter: string) => void;
  addWord: (word: string) => void;
  removeWord: (word: string) => void;
  addSyllableGroup: (letter: string, syllables: string[]) => void;
  removeSyllableGroup: (letter: string) => void;
  addSticker: (sticker: Sticker) => void;
  removeSticker: (id: string) => void;
  setCustomAudio: (text: string, dataUrl: string) => void;
  removeCustomAudio: (text: string) => void;
  resetContent: () => void;
}
function playAudio(text: string, customAudio: Record<string, string>) {
  const custom = customAudio[text];
  if (custom) {
    const audio = new Audio(custom);
    audio.play().catch(() => {});
    return;
  }
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fil-PH';
  utterance.rate = 0.8;
  const voices = window.speechSynthesis.getVoices();
  const filVoice = voices.find(
    (v) => v.lang.includes('fil') || v.lang.includes('tl')
  );
  if (filVoice) utterance.voice = filVoice;
  window.speechSynthesis.speak(utterance);
}
function AudioUploadButton({
  text,
  customAudio,
  onUpload,
  onRemove





}: {text: string;customAudio: Record<string, string>;onUpload: (text: string, dataUrl: string) => void;onRemove: (text: string) => void;}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const hasCustom = !!customAudio[text];
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500000) {
      alert('Masyadong malaki ang file. Max 500KB lang.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpload(text, reader.result);
      }
    };
    reader.readAsDataURL(file);
    if (fileRef.current) fileRef.current.value = '';
  };
  return (
    <div className="flex items-center gap-1">
      {hasCustom ?
      <button
        onClick={() => onRemove(text)}
        className="text-orange-500 hover:bg-orange-50 p-1.5 rounded-lg"
        title="Tanggalin ang custom na tunog">

          <X size={16} />
        </button> :
      null}
      <button
        onClick={() => fileRef.current?.click()}
        className={`p-1.5 rounded-lg ${hasCustom ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
        title={
        hasCustom ? 'Palitan ang custom na tunog' : 'Mag-upload ng tunog'
        }>

        <Upload size={16} />
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFile} />

    </div>);

}
export function AdminScreen({
  onBack,
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
}: AdminScreenProps) {
  const [activeTab, setActiveTab] = useState<
    'letters' | 'words' | 'syllables' | 'stickers'>(
    'letters');
  const [newLetter, setNewLetter] = useState('');
  const [newWord, setNewWord] = useState('');
  const [newSyllableLetter, setNewSyllableLetter] = useState('');
  const [newSyllables, setNewSyllables] = useState('');
  const [newStickerName, setNewStickerName] = useState('');
  const [newStickerIcon, setNewStickerIcon] = useState('');
  const [newStickerCost, setNewStickerCost] = useState('10');
  const handleAddLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLetter.trim()) {
      addLetter(newLetter.trim());
      setNewLetter('');
    }
  };
  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWord.trim()) {
      addWord(newWord.trim());
      setNewWord('');
    }
  };
  const handleAddSyllableGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSyllableLetter.trim() && newSyllables.trim()) {
      const syllablesArray = newSyllables.
      split(',').
      map((s) => s.trim()).
      filter((s) => s);
      addSyllableGroup(newSyllableLetter.trim(), syllablesArray);
      setNewSyllableLetter('');
      setNewSyllables('');
    }
  };
  const handleAddSticker = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStickerName.trim() && newStickerIcon.trim() && newStickerCost) {
      addSticker({
        id: `sticker_${Date.now()}`,
        name: newStickerName.trim(),
        icon: newStickerIcon.trim(),
        cost: parseInt(newStickerCost, 10) || 10
      });
      setNewStickerName('');
      setNewStickerIcon('');
      setNewStickerCost('10');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-body">
      <header className="p-4 flex items-center justify-between bg-white shadow-sm z-10">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600">

          <ArrowLeft size={32} />
        </button>
        <h1 className="font-heading text-3xl font-bold text-gray-800 flex items-center">
          <Settings className="mr-2" /> Admin Panel
        </h1>
        <button
          onClick={() => {
            if (window.confirm('I-reset ang lahat ng content sa default?'))
            resetContent();
          }}
          className="p-2 rounded-full hover:bg-red-100 text-red-500"
          title="Reset to Default">

          <RotateCcw size={24} />
        </button>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex md:flex-col gap-2 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('letters')}
            className={`p-4 text-left rounded-xl font-bold whitespace-nowrap ${activeTab === 'letters' ? 'bg-basa-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>

            Mga Titik
          </button>
          <button
            onClick={() => setActiveTab('words')}
            className={`p-4 text-left rounded-xl font-bold whitespace-nowrap ${activeTab === 'words' ? 'bg-basa-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>

            Mga Salita
          </button>
          <button
            onClick={() => setActiveTab('syllables')}
            className={`p-4 text-left rounded-xl font-bold whitespace-nowrap ${activeTab === 'syllables' ? 'bg-basa-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>

            Mga Pantig
          </button>
          <button
            onClick={() => setActiveTab('stickers')}
            className={`p-4 text-left rounded-xl font-bold whitespace-nowrap ${activeTab === 'stickers' ? 'bg-basa-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>

            Mga Sticker
          </button>
        </div>

        <div className="flex-1 bg-white rounded-3xl shadow-sm p-6 border-2 border-gray-100">
          {activeTab === 'letters' &&
          <div>
              <h2 className="text-2xl font-heading font-bold mb-2">
                Pamahalaan ang mga Titik
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Mag-upload ng sariling tunog o gamitin ang auto-voice. Lalabas
                sa Pagsulat.
              </p>
              <form onSubmit={handleAddLetter} className="flex gap-2 mb-6">
                <input
                type="text"
                value={newLetter}
                onChange={(e) => setNewLetter(e.target.value)}
                placeholder="Bagong Titik (hal. E)"
                className="flex-1 border-2 border-gray-200 rounded-xl p-3 text-lg focus:border-basa-primary focus:outline-none"
                required />

                <PlayfulButton type="submit" variant="primary" size="sm">
                  <Plus size={18} /> Idagdag
                </PlayfulButton>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {content.letters.map((letter) =>
              <div
                key={letter}
                className="bg-gray-50 border-2 border-gray-200 rounded-xl p-3 flex justify-between items-center">

                    <span className="font-heading font-bold text-2xl">
                      {letter}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                    onClick={() => playAudio(letter, content.customAudio)}
                    className="text-basa-secondary hover:bg-blue-50 p-2 rounded-lg"
                    title="Pakinggan">

                        <Volume2 size={18} />
                      </button>
                      <AudioUploadButton
                    text={letter}
                    customAudio={content.customAudio}
                    onUpload={setCustomAudio}
                    onRemove={removeCustomAudio} />

                      <button
                    onClick={() => removeLetter(letter)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg">

                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
              )}
              </div>
              {content.letters.length > 0 &&
            <p className="text-xs text-gray-400 mt-4">
                  <span className="text-green-600">●</span> = may custom na
                  tunog &nbsp; Walang upload = gagamitin ang auto-voice
                </p>
            }
            </div>
          }

          {activeTab === 'words' &&
          <div>
              <h2 className="text-2xl font-heading font-bold mb-2">
                Pamahalaan ang mga Salita
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Gagamitin sa Pagsulat at Pagbasa. Mag-upload ng tunog kung
                gusto.
              </p>
              <form onSubmit={handleAddWord} className="flex gap-2 mb-6">
                <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="Bagong Salita (hal. Pusa)"
                className="flex-1 border-2 border-gray-200 rounded-xl p-3 text-lg focus:border-basa-primary focus:outline-none"
                required />

                <PlayfulButton type="submit" variant="primary" size="sm">
                  <Plus size={18} /> Idagdag
                </PlayfulButton>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {content.words.map((word) =>
              <div
                key={word}
                className="bg-gray-50 border-2 border-gray-200 rounded-xl p-3 flex justify-between items-center">

                    <span className="font-heading font-bold text-xl">
                      {word}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                    onClick={() => playAudio(word, content.customAudio)}
                    className="text-basa-secondary hover:bg-blue-50 p-2 rounded-lg"
                    title="Pakinggan">

                        <Volume2 size={18} />
                      </button>
                      <AudioUploadButton
                    text={word}
                    customAudio={content.customAudio}
                    onUpload={setCustomAudio}
                    onRemove={removeCustomAudio} />

                      <button
                    onClick={() => removeWord(word)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg">

                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
              )}
              </div>
            </div>
          }

          {activeTab === 'syllables' &&
          <div>
              <h2 className="text-2xl font-heading font-bold mb-2">
                Pamahalaan ang mga Pantig
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                I-click ang pantig para pakinggan. Mag-upload ng tunog kung
                gusto.
              </p>
              <form
              onSubmit={handleAddSyllableGroup}
              className="flex flex-col gap-3 mb-6 bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">

                <input
                type="text"
                value={newSyllableLetter}
                onChange={(e) => setNewSyllableLetter(e.target.value)}
                placeholder="Pangunahing Titik (hal. P)"
                className="border-2 border-gray-200 rounded-xl p-3 text-lg focus:border-basa-primary focus:outline-none"
                required />

                <input
                type="text"
                value={newSyllables}
                onChange={(e) => setNewSyllables(e.target.value)}
                placeholder="Mga Pantig (hal. Pa, Pe, Pi, Po, Pu)"
                className="border-2 border-gray-200 rounded-xl p-3 text-lg focus:border-basa-primary focus:outline-none"
                required />

                <p className="text-sm text-gray-500">
                  Paghiwalayin ng kuwit (comma) ang mga pantig.
                </p>
                <PlayfulButton
                type="submit"
                variant="primary"
                size="sm"
                className="w-full">

                  <Plus size={18} /> Idagdag ang Grupo
                </PlayfulButton>
              </form>
              <div className="space-y-3">
                {content.syllableGroups.map((group) =>
              <div
                key={group.letter}
                className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 flex justify-between items-start">

                    <div className="flex-1">
                      <span className="font-heading font-bold text-2xl block mb-2">
                        Grupo: {group.letter}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {group.syllables.map((s) =>
                    <div
                      key={s}
                      className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">

                            <button
                        onClick={() => playAudio(s, content.customAudio)}
                        className="px-3 py-1 font-bold hover:bg-blue-50 transition-colors flex items-center gap-1"
                        title="Pakinggan">

                              {s}{' '}
                              <Volume2 size={14} className="text-gray-400" />
                            </button>
                            <AudioUploadButton
                        text={s}
                        customAudio={content.customAudio}
                        onUpload={setCustomAudio}
                        onRemove={removeCustomAudio} />

                          </div>
                    )}
                      </div>
                    </div>
                    <button
                  onClick={() => removeSyllableGroup(group.letter)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg shrink-0 ml-2">

                      <Trash2 size={20} />
                    </button>
                  </div>
              )}
              </div>
            </div>
          }

          {activeTab === 'stickers' &&
          <div>
              <h2 className="text-2xl font-heading font-bold mb-2">
                Pamahalaan ang mga Sticker
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Mga sticker na mabibili sa Tindahan gamit ang bituin.
              </p>
              <form
              onSubmit={handleAddSticker}
              className="flex flex-col gap-3 mb-6 bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">

                <div className="flex gap-3">
                  <input
                  type="text"
                  value={newStickerIcon}
                  onChange={(e) => setNewStickerIcon(e.target.value)}
                  placeholder="Emoji (hal. 🐶)"
                  className="w-24 border-2 border-gray-200 rounded-xl p-3 text-2xl text-center focus:border-basa-primary focus:outline-none"
                  required />

                  <input
                  type="text"
                  value={newStickerName}
                  onChange={(e) => setNewStickerName(e.target.value)}
                  placeholder="Pangalan (hal. Aso)"
                  className="flex-1 border-2 border-gray-200 rounded-xl p-3 text-lg focus:border-basa-primary focus:outline-none"
                  required />

                </div>
                <div className="flex items-center gap-3">
                  <label className="font-bold text-gray-600">
                    Halaga (Bituin):
                  </label>
                  <input
                  type="number"
                  min="1"
                  value={newStickerCost}
                  onChange={(e) => setNewStickerCost(e.target.value)}
                  className="w-24 border-2 border-gray-200 rounded-xl p-3 text-lg focus:border-basa-primary focus:outline-none"
                  required />

                </div>
                <PlayfulButton
                type="submit"
                variant="primary"
                size="sm"
                className="w-full">

                  <Plus size={18} /> Idagdag ang Sticker
                </PlayfulButton>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {content.stickers.map((sticker) =>
              <div
                key={sticker.id}
                className="bg-gray-50 border-2 border-gray-200 rounded-xl p-3 flex justify-between items-center">

                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{sticker.icon}</span>
                      <div>
                        <div className="font-bold">{sticker.name}</div>
                        <div className="text-sm text-gray-500">
                          ⭐ {sticker.cost}
                        </div>
                      </div>
                    </div>
                    <button
                  onClick={() => removeSticker(sticker.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg">

                      <Trash2 size={18} />
                    </button>
                  </div>
              )}
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

}