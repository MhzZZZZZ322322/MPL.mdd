import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap } from 'lucide-react';

interface Stage3SwissProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function Stage3Swiss({ isExpanded, onToggle }: Stage3SwissProps) {
  return (
    <div className="bg-gradient-to-r from-zinc-900/95 to-black/90 border border-primary/30 rounded-lg shadow-xl">
      <button
        onClick={onToggle}
        className="w-full p-6 text-left hover:bg-primary/5 transition-colors rounded-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Stage 3 - Format Actualizat</h2>
              <p className="text-gray-300 text-sm">Swiss System eliminat - formatul s-a schimbat</p>
            </div>
          </div>
          <ChevronDown 
            className={`w-6 h-6 text-primary transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
          >
            <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/10 border border-amber-500/30 rounded-lg p-8 text-center">
              <Zap className="mx-auto h-16 w-16 text-amber-400 mb-4" />
              <h3 className="text-xl font-semibold text-amber-300 mb-3">Format Restructurat</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Turneul Kingston nu mai folosește Swiss System în Stage 3. 
                Noul format simplificat: <strong>Stage 1</strong> (8 grupe de 4 echipe) → <strong>Stage 2</strong> (Double Elimination cu 16 echipe).
              </p>
              <p className="text-gray-400 text-sm">
                Stage 3 Swiss a fost eliminat din formatul oficial al turneului pentru o experiență mai clară și directă.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}