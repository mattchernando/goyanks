import type { QuickStats as QuickStatsType } from "@/types";

interface QuickStatsProps {
  stats: QuickStatsType;
}

export default function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Recent Avg K"
        value={stats.avgStrikeouts.toString()}
        highlight
      />
      <StatCard
        label="Recent Avg ER"
        value={stats.avgEarnedRuns.toString()}
      />
      <StatCard
        label="Recent Avg IP"
        value={stats.avgInningsPitched.toString()}
      />
      <StatCard
        label="Total Outings"
        value={stats.totalOutings.toString()}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-navy-600 rounded-xl p-4 stat-card pinstripe-bg">
      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
        {label}
      </p>
      <p
        className={`text-3xl font-bold ${
          highlight ? "text-gold" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
