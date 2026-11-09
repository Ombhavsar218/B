import { Sparkles, Heart, MapPin, Calendar } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';
import { formatOrdinal } from '../../utils/format';

export function WebGLFallback() {
  const destinations = Object.values(birthdayConfig.destinations).filter(
    (d) => d.id !== 'intro'
  );

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-gradient-to-b from-[#BCE3FA]/50 via-[#FFF9F2] to-[#FADAE6]/50 px-4 py-10 text-[#3B2B4B]">
      <div className="mx-auto max-w-3xl">
        <div className="storybook-panel rounded-3xl p-8 text-center md:p-12">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#E2B362]/45 bg-[#FFF9F2]/90 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#8D6EC2] uppercase">
            <Sparkles className="h-3.5 w-3.5 text-[#E2A84B]" />
            <span>Storybook Mode</span>
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight text-[#3B2B4B] md:text-5xl">
            {birthdayConfig.parkTitle}
          </h1>

          <p className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-[#6E5098]">
            <Calendar className="h-4 w-4 text-[#E2A84B]" />
            <span>
              Celebrating {birthdayConfig.sisterName}&apos;s {formatOrdinal(birthdayConfig.age)}{' '}
              Birthday &middot; {birthdayConfig.birthdayDate}
            </span>
          </p>

          <div className="mx-auto my-6 h-px w-32 bg-gradient-to-r from-transparent via-[#E2B362] to-transparent" />

          <p className="mx-auto max-w-xl text-base leading-relaxed text-[#4E3A63]">
            {birthdayConfig.personalBirthdayMessage}
          </p>

          <p className="mt-5 rounded-2xl border border-[#D9CCF2] bg-[#FFF9F2]/80 px-4 py-3 text-xs text-[#6E5098]">
            Your browser or device currently has 3D graphics (WebGL) disabled, so we opened the
            illustrated storybook edition for you. Enable hardware acceleration or open in a modern
            browser to explore the full 3D park.
          </p>

          <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="rounded-2xl border border-[#E2B362]/30 bg-white/65 p-4 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: dest.accentColor }}
                  />
                  <h2 className="font-display text-xl font-semibold text-[#3B2B4B]">
                    {dest.label}
                  </h2>
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[#8D6EC2]">
                  <MapPin className="h-3 w-3" />
                  <span>{dest.subtitle}</span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#55426B]">{dest.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#8D6EC2]">
            <Heart className="h-4 w-4 fill-[#F39BB8] text-[#F39BB8]" />
            <span>Crafted with love for {birthdayConfig.sisterName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
