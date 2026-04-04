"use client";

import Image from "next/image";
import type { Outing } from "@/types";
import { formatFullDate, formatIP } from "@/lib/queries";

interface LatestOutingCardProps {
  outing: Outing;
}

export default function LatestOutingCard({ outing }: LatestOutingCardProps) {
  return (
    <div className="bg-navy-600 rounded-2xl overflow-hidden pinstripe-bg">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-gold text-sm font-medium uppercase tracking-wider mb-1">
              Latest Outing
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {outing.pitcher_name}
            </h2>
            <p className="text-gray-400 mt-1">
              vs {outing.opponent} • {formatFullDate(outing.game_date)}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
              outing.is_starter
                ? "bg-gold/20 text-gold"
                : "bg-blue-500/20 text-blue-400"
            }`}
          >
            {outing.is_starter ? "Starter" : "Reliever"}
          </span>
        </div>

        {/* Stat Line */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatBox label="IP" value={formatIP(outing.innings_pitched)} />
          <StatBox label="K" value={outing.strikeouts?.toString() || "-"} highlight />
          <StatBox label="ER" value={outing.earned_runs?.toString() || "-"} />
          <StatBox label="Pitches" value={outing.pitch_count?.toString() || "-"} />
        </div>

        {/* AI Headline */}
        {outing.ai_headline && (
          <div className="mb-4">
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
              {outing.ai_headline}
            </h3>
            {outing.ai_takeaway && (
              <p className="text-gray-300 leading-relaxed">
                {outing.ai_takeaway}
              </p>
            )}
          </div>
        )}

        {/* AI Analysis Pills */}
        <div className="flex flex-wrap gap-3 mt-4">
          {outing.ai_strength && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
              <p className="text-xs text-green-400 uppercase font-medium mb-1">
                Strength
              </p>
              <p className="text-sm text-green-200">{outing.ai_strength}</p>
            </div>
          )}
          {outing.ai_concern && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
              <p className="text-xs text-orange-400 uppercase font-medium mb-1">
                Concern
              </p>
              <p className="text-sm text-orange-200">{outing.ai_concern}</p>
            </div>
          )}
        </div>
      </div>

      {/* Graphic Image */}
      {outing.graphic_url && (
        <div className="relative aspect-square max-w-md mx-auto p-4">
          <Image
            src={outing.graphic_url}
            alt={`${outing.pitcher_name} outing graphic`}
            fill
            className="object-contain rounded-lg"
            priority
          />
        </div>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="text-center">
      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
        {label}
      </p>
      <p
        className={`text-2xl md:text-3xl font-bold ${
          highlight ? "text-gold" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
