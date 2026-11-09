import { useRef, useState, type MutableRefObject } from 'react';
import { ArrowUp, Sparkles, Zap } from 'lucide-react';
import type { ParkInteractable } from '../../config/parkInteractables';

interface MobileControlsProps {
  visible: boolean;
  joystickRef: MutableRefObject<{ x: number; y: number }>;
  touchLookDeltaRef: MutableRefObject<{ dx: number; dy: number }>;
  jumpRequestRef: MutableRefObject<boolean>;
  sprintToggleRef: MutableRefObject<boolean>;
  nearbyInteractable: ParkInteractable | null;
  onTriggerInteract: (item: ParkInteractable) => void;
}

export function MobileControls({
  visible,
  joystickRef,
  touchLookDeltaRef,
  jumpRequestRef,
  sprintToggleRef,
  nearbyInteractable,
  onTriggerInteract,
}: MobileControlsProps) {
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const [sprinting, setSprinting] = useState(false);

  const stickOriginRef = useRef<{ x: number; y: number; pointerId: number | null }>({
    x: 0,
    y: 0,
    pointerId: null,
  });

  const lookPointerRef = useRef<{ pointerId: number | null; lastX: number; lastY: number }>({
    pointerId: null,
    lastX: 0,
    lastY: 0,
  });

  if (!visible) return null;

  const MAX_RADIUS = 38;

  const updateStick = (clientX: number, clientY: number) => {
    const dx = clientX - stickOriginRef.current.x;
    const dy = clientY - stickOriginRef.current.y;
    const dist = Math.hypot(dx, dy);
    const clamped = Math.min(dist, MAX_RADIUS);
    const angle = Math.atan2(dy, dx);
    const nx = dist > 0.001 ? Math.cos(angle) * clamped : 0;
    const ny = dist > 0.001 ? Math.sin(angle) * clamped : 0;

    setKnobOffset({ x: nx, y: ny });
    // Screen +X is Right; Screen -Y is Forward (+1 forward)
    joystickRef.current.x = nx / MAX_RADIUS;
    joystickRef.current.y = -ny / MAX_RADIUS;
  };

  const resetStick = () => {
    stickOriginRef.current.pointerId = null;
    setKnobOffset({ x: 0, y: 0 });
    joystickRef.current.x = 0;
    joystickRef.current.y = 0;
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[15] select-none">
      {/* Right-Side Touch-Drag Look Surface (keeps upper bar & bottom buttons unobstructed) */}
      <div
        className="pointer-events-auto touch-none absolute top-16 right-0 bottom-28 left-[42%]"
        aria-label="Touch drag to look around"
        onPointerDown={(e) => {
          lookPointerRef.current = {
            pointerId: e.pointerId,
            lastX: e.clientX,
            lastY: e.clientY,
          };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (lookPointerRef.current.pointerId !== e.pointerId) return;
          const dx = e.clientX - lookPointerRef.current.lastX;
          const dy = e.clientY - lookPointerRef.current.lastY;
          lookPointerRef.current.lastX = e.clientX;
          lookPointerRef.current.lastY = e.clientY;
          touchLookDeltaRef.current.dx += dx;
          touchLookDeltaRef.current.dy += dy;
        }}
        onPointerUp={(e) => {
          if (lookPointerRef.current.pointerId === e.pointerId) {
            lookPointerRef.current.pointerId = null;
          }
        }}
        onPointerCancel={() => {
          lookPointerRef.current.pointerId = null;
        }}
      />

      {/* Bottom-Left: Virtual Analog Movement Joystick */}
      <div className="pointer-events-auto absolute bottom-5 left-4 sm:bottom-6 sm:left-6">
        <div
          role="application"
          aria-label="Virtual movement joystick"
          className="touch-none relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#E2B362]/70 bg-[#FFF9F2]/45 shadow-lg backdrop-blur-md"
          onPointerDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            stickOriginRef.current = {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
              pointerId: e.pointerId,
            };
            e.currentTarget.setPointerCapture(e.pointerId);
            updateStick(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (stickOriginRef.current.pointerId !== e.pointerId) return;
            updateStick(e.clientX, e.clientY);
          }}
          onPointerUp={(e) => {
            if (stickOriginRef.current.pointerId === e.pointerId) {
              resetStick();
            }
          }}
          onPointerCancel={resetStick}
        >
          <div className="pointer-events-none h-10 w-10 rounded-full border border-white/60 bg-white/30" />
          <div
            style={{
              transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)`,
            }}
            className="pointer-events-none absolute flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#F7C6D9] to-[#D9CCF2] shadow-md"
          >
            <div className="h-3 w-3 rounded-full bg-white/85" />
          </div>
        </div>
      </div>

      {/* Bottom-Right: Dedicated Interact, Jump & Sprint Touch Buttons */}
      <div className="pointer-events-auto absolute right-4 bottom-5 flex items-end gap-2.5 sm:right-6 sm:bottom-6">
        {/* Sprint Toggle */}
        <button
          type="button"
          onClick={() => {
            const next = !sprinting;
            setSprinting(next);
            sprintToggleRef.current = next;
          }}
          aria-label="Toggle Sprint"
          className={`flex h-11 w-11 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition active:scale-95 ${
            sprinting
              ? 'border-[#D99B38] bg-[#3B2B4B] text-[#FFD98E]'
              : 'border-[#E2B362]/65 bg-[#FFF9F2]/80 text-[#3B2B4B]'
          }`}
        >
          <Zap className="h-4 w-4" />
        </button>

        {/* Jump Button */}
        <button
          type="button"
          onClick={() => {
            jumpRequestRef.current = true;
          }}
          aria-label="Jump"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E2B362]/75 bg-[#FFF9F2]/85 text-[#3B2B4B] shadow-md backdrop-blur-md active:scale-90"
        >
          <ArrowUp className="h-5 w-5" />
        </button>

        {/* Interact Button (Glows brightly when near an attraction) */}
        <button
          type="button"
          disabled={!nearbyInteractable}
          onClick={() => {
            if (nearbyInteractable) onTriggerInteract(nearbyInteractable);
          }}
          aria-label={nearbyInteractable ? nearbyInteractable.actionPrompt : 'Interact'}
          className={`flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 shadow-lg backdrop-blur-md transition active:scale-90 ${
            nearbyInteractable
              ? 'border-[#D99B38] bg-gradient-to-br from-[#FADAE6] via-[#FFF6E5] to-[#E6DDF9] text-[#3B2B4B] ring-4 ring-[#F6BE65]/40'
              : 'border-white/60 bg-[#FFF9F2]/45 text-[#8E77A8] opacity-65'
          }`}
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-[9px] font-bold uppercase">Use</span>
        </button>
      </div>
    </div>
  );
}
