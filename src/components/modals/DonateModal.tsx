/**
 * DonateModal — the in-site "Support Sidekick" donation flow.
 *
 * Embeds Buy Me a Coffee's official widget page in a CROSS-ORIGIN <iframe>
 * inside our own modal. Because the iframe is cross-origin, BMC's code runs in
 * BMC's origin under the browser's same-origin policy — it physically cannot
 * read this app's localStorage (including the Supabase session token) or touch
 * our DOM. The user still donates without leaving the site.
 *
 * This replaces the former `cdnjs.buymeacoffee.com/.../widget.prod.min.js`
 * <script>, which ran with full FIRST-PARTY privileges (a live, unpinned
 * third-party script that could read our origin's storage). See the "Security"
 * section in ARCHITECTURE.md and the CSP `frame-src` allowance in
 * vite.config.ts.
 *
 * The iframe mounts only while the modal is open (Modal returns null when
 * closed), so no connection to BMC is made until the user clicks Support.
 */

import { Modal } from './Modal';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BMC_USERNAME = 'Wednesdaywoe';
// The embeddable widget page — the same URL the official BMC widget iframed.
// Apex host directly (www 301-redirects here) to avoid a redirect hop.
const BMC_WIDGET_URL = `https://buymeacoffee.com/widget/page/${BMC_USERNAME}`;
// Full profile page, used by the new-tab fallback link below.
const BMC_PAGE_URL = `https://buymeacoffee.com/${BMC_USERNAME}`;

export function DonateModal({ isOpen, onClose }: DonateModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Support Sidekick ☕"
      size="lg"
      scrollBody={false}
      mobileFullscreen
    >
      <div className="flex flex-col h-full min-h-0">
        <iframe
          src={BMC_WIDGET_URL}
          title="Buy Sidekick a coffee"
          className="w-full flex-1 min-h-[480px] border-0 bg-white"
          loading="lazy"
          // Delegate the Payment Request API into the cross-origin frame so
          // BMC/Stripe's embedded checkout can use Apple/Google Pay. (BMC's
          // own SameSite=Lax cookies are still blocked in this third-party
          // context by the browser — that's expected; the "open in new tab"
          // link below is the guaranteed first-party fallback.)
          allow="payment"
        />
        <div className="shrink-0 px-4 py-2.5 text-center text-xs text-gray-400 border-t border-gray-700">
          Trouble loading?{' '}
          <a
            href={BMC_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Open Buy Me a Coffee in a new tab ↗
          </a>
        </div>
      </div>
    </Modal>
  );
}
