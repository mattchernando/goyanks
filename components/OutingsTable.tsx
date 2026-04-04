"use client";

import type { Outing } from "@/types";
import { formatDate, formatIP } from "@/lib/queries";

interface OutingsTableProps {
  outings: Outing[];
}

export default function OutingsTable({ outings }: OutingsTableProps) {
  if (outings.length === 0) {
    return (
      <div className="bg-navy-600 rounded-xl p-6">
        <p className="text-gray-400 text-center">No outings to display</p>
      </div>
    );
  }

  return (
    <div className="bg-navy-600 rounded-xl overflow-hidden pinstripe-bg">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white gold-underline inline-block">
          Recent Outings
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Pitcher
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Opp
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                IP
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gold uppercase tracking-wider">
                K
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                ER
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {outings.map((outing) => (
              <tr
                key={outing.id}
                className="table-row-hover transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-300">
                  {formatDate(outing.game_date)}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-white">
                    {outing.pitcher_name}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {outing.opponent || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-white text-center">
                  {formatIP(outing.innings_pitched)}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gold text-center">
                  {outing.strikeouts ?? "-"}
                </td>
                <td className="px-4 py-3 text-sm text-white text-center">
                  {outing.earned_runs ?? "-"}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                      outing.is_starter
                        ? "bg-gold/20 text-gold"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {outing.is_starter ? "SP" : "RP"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
