'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Home,
  Languages,
  Image as ImageIcon,
  ChevronDown,
  ArrowRight,
  Clipboard,
  Star,
  Brain,
  LucideIcon,
} from 'lucide-react';
import UserProfileDropdown from './UserProfileDropdown';

export default function TextTranslator() {
  const router = useRouter();
  const [sourceLanguage, setSourceLanguage] = useState('Auto-Detect');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isCompareEnabled, setIsCompareEnabled] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [userProfilePosition, setUserProfilePosition] = useState({ top: 0, left: 0 });
  const userProfileButtonRef = useRef<HTMLButtonElement>(null);
  const [isSourceLangOpen, setIsSourceLangOpen] = useState(false);
  const [isTargetLangOpen, setIsTargetLangOpen] = useState(false);
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const modelButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  interface AIModel {
    id: string;
    name: string;
    icon: LucideIcon | string;
    iconColor: string;
    description: string;
    cost: string;
    costType: 'basic' | 'advanced' | 'free';
  }

  const aiModels: AIModel[] = [
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      icon: Sparkles,
      iconColor: 'text-purple-500',
      description: "Google's first fully hybrid reasoning model, delivering a major upgrade in reasoning capabilities, while still prioritizing speed.",
      cost: 'Every 4k Characters Costs 1 Basic Credit',
      costType: 'basic',
    },
    {
      id: 'gpt-4.1-mini',
      name: 'GPT-4.1 mini',
      icon: Sparkles,
      iconColor: 'text-green-500',
      description: "OpenAI's latest model, offers fast, superior performance in chat, coding, and reasoning tasks for everyday use.",
      cost: 'Every 4k Characters Costs 3 Basic Credit',
      costType: 'basic',
    },
    {
      id: 'gpt-4.1',
      name: 'GPT-4.1',
      icon: Sparkles,
      iconColor: 'text-blue-500',
      description: "OpenAI's flagship model for complex tasks. It is well suited for problem solving across domains.",
      cost: 'Every 4k Characters Costs 1 Advanced Credit',
      costType: 'advanced',
    },
    {
      id: 'deepseek-v3',
      name: 'DeepSeek V3',
      icon: Brain,
      iconColor: 'text-blue-600',
      description: "DeepSeek's advanced model excelling in complex reasoning, mathematics, and coding tasks, delivering superior performance in both analytical and creative tasks.",
      cost: 'Every 4k Characters Costs 3 Basic Credits',
      costType: 'basic',
    },
    {
      id: 'claude-3.5-haiku',
      name: 'Claude 3.5 Haiku',
      icon: Star,
      iconColor: 'text-black',
      description: "Anthropic's most compact model, designed for near-instant responsiveness and seamless AI experiences that mimic human interactions",
      cost: 'Every 4k Characters Costs 1 Basic Credit',
      costType: 'basic',
    },
    {
      id: 'claude-3.7-sonnet',
      name: 'Claude 3.7 Sonnet',
      icon: Star,
      iconColor: 'text-orange-600',
      description: "Anthropic's most intelligent model, with visible step-by-step reasoning. Excels in real-world tasks, especially coding and web development, with significantly improved performance across all areas.",
      cost: 'Every 4k Characters Costs 1 Advanced Credit',
      costType: 'advanced',
    },
    {
      id: 'gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      icon: Sparkles,
      iconColor: 'text-blue-600',
      description: "Google's best model for general performance across a wide range of tasks.",
      cost: 'Every 4k Characters Costs 1 Advanced Credit',
      costType: 'advanced',
    },
    {
      id: 'google',
      name: 'Google',
      icon: 'G',
      iconColor: 'text-blue-600',
      description: 'Free translation service powered by Google Translate.',
      cost: 'Free Translation',
      costType: 'free',
    },
    {
      id: 'bing',
      name: 'Bing',
      icon: 'b',
      iconColor: 'text-blue-600',
      description: 'Free translation service powered by Microsoft Bing Translator.',
      cost: 'Free Translation',
      costType: 'free',
    },
  ];

  const getSelectedModel = () => {
    return aiModels.find(m => m.id === selectedModel) || aiModels[0];
  };

  const handleModelHover = (modelId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    setHoveredModel(modelId);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.bottom + 8,
      left: rect.left,
    });
  };

  const handleModelLeave = () => {
    setHoveredModel(null);
  };

  const languages = [
    'Auto-Detect',
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Russian',
    'Japanese',
    'Korean',
    'Chinese',
    'Arabic',
    'Hindi',
    'Dutch',
    'Polish',
    'Turkish',
    'Vietnamese',
    'Thai',
    'Indonesian',
    'Swedish',
    'Norwegian',
    'Danish',
    'Finnish',
    'Greek',
    'Hebrew',
    'Czech',
    'Romanian',
    'Hungarian',
  ];


  const handleUserProfileClick = () => {
    if (userProfileButtonRef.current) {
      const rect = userProfileButtonRef.current.getBoundingClientRect();
      const dropdownWidth = 320;
      const dropdownHeight = 400;
      const viewportWidth = window.innerWidth;

      let top = rect.top - dropdownHeight - 8;
      let left = rect.left - dropdownWidth + rect.width;

      if (top < 8) {
        top = rect.bottom + 8;
      }
      if (left < 8) {
        left = 8;
      }
      if (left + dropdownWidth > viewportWidth - 8) {
        left = viewportWidth - dropdownWidth - 8;
      }

      setUserProfilePosition({ top, left });
      setIsUserProfileOpen(!isUserProfileOpen);
    }
  };

  const handleTranslate = () => {
    // TODO: Implement translation API call
    console.log('Translating:', inputText);
    setTranslatedText('Translation will appear here...');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="relative w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Webby Sider
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/chat')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              <Languages className="w-5 h-5 text-orange-500" />
              <span>AI Translator</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/translator/image-translator')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ImageIcon className="w-5 h-5" />
              <span>Image Translator</span>
            </motion.button>
          </div>
        </div>

        {/* Footer Icons */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around">
          <motion.button
            ref={userProfileButtonRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleUserProfileClick}
            className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold"
          >
            P
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center"
          >
            <Clipboard className="w-4 h-4" />
          </motion.button>
        </div>

        {/* User Profile Dropdown */}
        {isUserProfileOpen && (
          <UserProfileDropdown
            isOpen={isUserProfileOpen}
            onClose={() => setIsUserProfileOpen(false)}
            position={userProfilePosition}
          />
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            {/* Source Language */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsSourceLangOpen(!isSourceLangOpen);
                  setIsTargetLangOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span>{sourceLanguage}</span>
                <ChevronDown className="w-4 h-4" />
              </motion.button>
              {isSourceLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-64 overflow-y-auto"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSourceLanguage(lang);
                        setIsSourceLangOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Arrow */}
            <ArrowRight className="w-5 h-5 text-gray-400" />

            {/* Target Language */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsTargetLangOpen(!isTargetLangOpen);
                  setIsSourceLangOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span>{targetLanguage}</span>
                <ChevronDown className="w-4 h-4" />
              </motion.button>
              {isTargetLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-64 overflow-y-auto"
                >
                  {languages.filter(l => l !== 'Auto-Detect').map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setTargetLanguage(lang);
                        setIsTargetLangOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* AI Model Tabs */}
            <div className="flex items-center gap-2 ml-auto relative">
              {/* Dropdown Arrow */}
              <ChevronDown className="w-5 h-5 text-gray-400" />
              
              {/* Model Icons and Selected Name */}
              <div className="flex items-center gap-2">
                {aiModels.map((model) => {
                  const isSelected = selectedModel === model.id;
                  const isStringIcon = typeof model.icon === 'string';
                  
                  return (
                    <div key={model.id} className="relative flex items-center gap-2">
                      <motion.button
                        ref={(el) => {
                          modelButtonRefs.current[model.id] = el;
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={(e) => handleModelHover(model.id, e)}
                        onMouseLeave={handleModelLeave}
                        onClick={() => setSelectedModel(model.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-gray-900 dark:bg-gray-700' 
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {isStringIcon ? (
                          <span className={`text-sm font-bold ${model.icon === 'G' ? 'text-[#4285F4]' : 'text-[#0078D4]'}`}>
                            {model.icon as string}
                          </span>
                        ) : (
                          (() => {
                            const Icon = model.icon as LucideIcon;
                            return <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : model.iconColor}`} />;
                          })()
                        )}
                      </motion.button>
                      
                      {/* Model Name (shown inline when selected) */}
                      {isSelected && (
                        <span className="text-sm font-medium text-gray-900 dark:text-white border-b-2 border-purple-500">
                          {model.name}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Tooltip */}
              {hoveredModel && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="fixed bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-xl p-4 z-[100] max-w-xs"
                  style={{
                    top: `${tooltipPosition.top}px`,
                    left: `${tooltipPosition.left}px`,
                  }}
                  onMouseEnter={() => setHoveredModel(hoveredModel)}
                  onMouseLeave={handleModelLeave}
                >
                  <div className="absolute -top-2 left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-800"></div>
                  <h4 className="font-semibold mb-2">{aiModels.find(m => m.id === hoveredModel)?.name}</h4>
                  <p className="text-sm text-gray-300 mb-2">
                    {aiModels.find(m => m.id === hoveredModel)?.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    {aiModels.find(m => m.id === hoveredModel)?.cost}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Compare Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Compare</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCompareEnabled(!isCompareEnabled)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  isCompareEnabled ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: isCompareEnabled ? 24 : 0 }}
                  className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-md"
                />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Translation Panels */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Input */}
          <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Please enter the text to be translated."
              className="flex-1 w-full p-6 resize-none border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              maxLength={20000}
            />
            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 text-right">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {inputText.length}/20000
              </span>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
            {translatedText ? (
              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {translatedText}
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                  {(() => {
                    const currentModel = getSelectedModel();
                    if (typeof currentModel.icon === 'string') {
                      return (
                        <div className={`text-6xl font-bold ${currentModel.icon === 'G' ? 'text-[#4285F4]' : 'text-[#0078D4]'}`}>
                          {currentModel.icon}
                        </div>
                      );
                    }
                    const Icon = currentModel.icon;
                    return <Icon className={`w-12 h-12 ${currentModel.iconColor}`} />;
                  })()}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Translate using {getSelectedModel().name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {getSelectedModel().cost}
                </p>
              </div>
            )}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTranslate}
                disabled={!inputText.trim()}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Click to translate
              </motion.button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

