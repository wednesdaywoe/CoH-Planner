/**
 * AboutModal component - displays contributor information with character details
 */

import { useState } from 'react';
import { Modal, ModalBody } from './Modal';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Character {
  name: string;
  server: string;
}

interface Contributor {
  alias: string;
  characters: Character[];
}

const CONTRIBUTORS: Contributor[] = [
  {
    alias: '@wednesdaywoe',
    characters: [
      { name: 'Toxa', server: 'Justice' },
      { name: 'Miss Ultimate', server: 'Virtue' },
      { name: 'Lady Nightstar', server: 'Everlasting' },
      { name: 'Stormsiren', server: 'Everlasting' },
      { name: 'Charnel', server: 'Excelsior' },
      { name: 'Immashtu', server: 'Excelsior' },
      { name: 'Safeword?', server: 'Excelsior' },
      { name: 'Maiden Fury', server: 'Excelsior' },
      { name: 'Bride of the Hamidon', server: 'Excelsior' },
      { name: 'Lady Stormsurge', server: 'Excelsior' },
    ],
  },
];

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [hoveredContributor, setHoveredContributor] = useState<string | null>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalBody>
        <div className="min-h-[600px] pb-32">
          <div className="flex flex-col items-center gap-4 pt-8">
            {CONTRIBUTORS.map((contributor) => (
              <div
                key={contributor.alias}
                className="relative"
                onMouseEnter={() => setHoveredContributor(contributor.alias)}
                onMouseLeave={() => setHoveredContributor(null)}
              >
                {/* Contributor plaque */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 min-w-[280px] animate-pulse-glow shadow-lg">
                  <div className="text-xl font-bold text-white tracking-wide">
                    {contributor.alias}
                  </div>
                </div>

                  {/* Character list tooltip */}
                  {hoveredContributor === contributor.alias && (() => {
                    // Group characters by server
                    const charactersByServer = contributor.characters.reduce((acc, char) => {
                      if (!acc[char.server]) {
                        acc[char.server] = [];
                      }
                      acc[char.server].push(char.name);
                      return acc;
                    }, {} as Record<string, string[]>);

                    return (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 min-w-[200px] animate-in fade-in zoom-in-95 duration-200">
                        {Object.entries(charactersByServer).map(([server, characters], idx) => (
                          <div key={server} className={idx > 0 ? 'mt-3' : ''}>
                            <div className="text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wide text-center">
                              {server}
                            </div>
                            <div className="space-y-1">
                              {characters.map((charName) => (
                                <div key={charName} className="text-sm text-gray-200 text-center">
                                  {charName}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        {/* Arrow pointer */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-8 border-transparent border-b-gray-800"></div>
                      </div>
                    );
                  })()}
                </div>
              ))}
          </div>

          {/* Personal note */}
          <div className="max-w-md mx-auto mt-10 px-4 text-center">
            <p className="text-sm text-gray-400 leading-relaxed italic">
              I'm 100% not the right person for this job, but I got tired of waiting for someone else to make it. So here we are. I also make videos about City of Heroes and other things at{' '}
              <a href="https://www.youtube.com/@wednesdaywoeplays" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                @wednesdaywoeplays
              </a>
            </p>
            <p className="text-sm text-gray-500 mt-2">—WW</p>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
