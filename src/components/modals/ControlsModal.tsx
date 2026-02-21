/**
 * ControlsModal - Quick reference for all desktop and mobile interactions.
 */

import { Modal, ModalBody } from './Modal';

interface ControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ControlSection({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className={`text-sm font-semibold ${color} mb-1.5 flex items-center gap-2`}>
        {icon}
        {title}
      </h3>
      <ul className="space-y-1 text-sm text-gray-400 ml-1">{children}</ul>
    </div>
  );
}

function ControlItem({ action, description }: { action: string; description: string }) {
  return (
    <li>
      <span className="text-gray-300">{action}</span>
      {' — '}
      {description}
    </li>
  );
}

export function ControlsModal({ isOpen, onClose }: ControlsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Controls" size="lg">
      <ModalBody>
        <div className="space-y-4">
          {/* Desktop — Planner */}
          <ControlSection
            title="Desktop — Planner"
            color="text-cyan-400"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          >
            <ControlItem action="Hover" description="See power details in the info panel" />
            <ControlItem action="Click" description="Select powers or open the enhancement picker" />
            <ControlItem action="Right-click a power" description="Lock its info in the panel" />
            <ControlItem action="Right-click a slot" description="Remove enhancement or remove the slot" />
            <ControlItem action="Shift + Right-click a slot" description="Bulk actions menu" />
            <ControlItem action="Drag the + button" description="Add multiple slots at once" />
          </ControlSection>

          {/* Desktop — Enhancement Picker */}
          <ControlSection
            title="Desktop — Enhancement Picker"
            color="text-green-400"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            }
          >
            <ControlItem action="Click a piece" description="Slot a single enhancement" />
            <ControlItem action="Shift+Click" description="Multi-select pieces across sets" />
            <ControlItem action="Click a selected piece" description="Slot all selected pieces at once" />
            <ControlItem action="Drag across pieces" description="Range-select within a set" />
          </ControlSection>

          {/* Mobile — Planner */}
          <ControlSection
            title="Mobile — Planner"
            color="text-amber-400"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
          >
            <ControlItem action="Tap" description="Select powers or open the enhancement picker" />
            <ControlItem action="Long-press a power" description="View its info in the panel" />
            <ControlItem action="Touch and hold a slot" description="Action menu (add, remove, clear)" />
            <ControlItem action="Touch and drag the + button" description="Add multiple slots" />
          </ControlSection>

          {/* Dashboard */}
          <ControlSection
            title="Dashboard"
            color="text-purple-400"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          >
            <ControlItem action="Click a stat" description="Track it (highlights IO Sets that boost that stat)" />
            <ControlItem action="Click a tracked stat" description="Untrack it" />
          </ControlSection>
        </div>
      </ModalBody>
    </Modal>
  );
}
