import {
  Home,
  Map,
  Flower2,
  Castle,
  Heart,
  Cake,
  Compass,
  Snowflake,
  Palmtree,
  Orbit,
} from 'lucide-react';
import type { ParkDestinationId } from '../../config/birthdayConfig';

interface FloatingNavProps {
  visible: boolean;
  activeDestination: ParkDestinationId;
  isMapOpen: boolean;
  onSelectDestination: (id: ParkDestinationId) => void;
  onToggleMap: () => void;
}

const NAV_ITEMS: Array<{
  id: ParkDestinationId | 'map';
  label: string;
  icon: typeof Home;
}> = [
  { id: 'intro', label: 'Home', icon: Home },
  { id: 'map', label: 'Park Map', icon: Map },
  { id: 'frozen-kingdom', label: 'Frozen', icon: Snowflake },
  { id: 'fantasyland', label: 'Fantasy', icon: Castle },
  { id: 'tulip-garden', label: 'Tulip Garden', icon: Flower2 },
  { id: 'adventure-kingdom', label: 'Adventure', icon: Palmtree },
  { id: 'galaxy-kingdom', label: 'Galaxy', icon: Orbit },
  { id: 'surprises', label: 'Celebration', icon: Cake },
  { id: 'memories', label: 'Memories', icon: Heart },
];

export function FloatingNav({
  visible,
  activeDestination,
  isMapOpen,
  onSelectDestination,
  onToggleMap,
}: FloatingNavProps) {
  if (!visible) return null;

  return (
    <>
      {/* Top-Left Return-to-Park Pill */}
      <div className="pointer-events-auto fixed top-4 left-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectDestination('hub')}
          className={`storybook-pill inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition-all hover:-translate-y-0.5 ${
            activeDestination === 'hub' && !isMapOpen
              ? 'border-[#D99B38] bg-[#FFF4DE]/95 text-[#3B2B4B]'
              : 'text-[#5A4570]'
          }`}
          title="Return to Main Park Overview"
        >
          <Compass className="h-4 w-4 text-[#D99B38]" />
          <span>Main Park</span>
        </button>
      </div>

      {/* Bottom Floating Navigation Dock */}
      <nav
        aria-label="Park Navigation"
        className="pointer-events-auto fixed inset-x-0 bottom-3 z-20 flex justify-center px-2 sm:bottom-4 sm:px-3"
      >
        <div className="storybook-pill no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto rounded-full p-1.5 shadow-lg">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.id === 'map'
                ? isMapOpen
                : !isMapOpen && activeDestination === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'map') {
                    onToggleMap();
                  } else {
                    onSelectDestination(item.id);
                  }
                }}
                className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all duration-200 sm:px-3.5 sm:text-[13px] ${
                  isActive
                    ? 'bg-gradient-to-r from-[#F7C6D9]/85 via-[#FFF2DC] to-[#D9CCF2]/85 text-[#3B2B4B] shadow-sm ring-1 ring-[#E2B362]/65'
                    : 'text-[#5A4570] hover:bg-white/60 hover:text-[#3B2B4B]'
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 shrink-0 ${
                    isActive ? 'text-[#C8842B]' : 'text-[#8D6EC2]'
                  }`}
                />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
