"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { TrendDataPoint } from "@/types";

interface TrendChartProps {
  data: TrendDataPoint[];
}

export default function TrendChart({ data }: TrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-navy-600 rounded-xl p-6 h-64 flex items-center justify-center">
        <p className="text-gray-400">No trend data available</p>
      </div>
    );
  }

  return (
    <div className="bg-navy-600 rounded-xl p-6 pinstripe-bg">
      <h3 className="text-lg font-semibold text-white mb-4 gold-underline inline-block">
        Starter Performance Trend
      </h3>
      <div className="h-64 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0C2340",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#C4A747" }}
              itemStyle={{ color: "#fff" }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  strikeouts: "Strikeouts",
                  earnedRuns: "Earned Runs",
                  inningsPitched: "Innings Pitched",
                };
                return [value, labels[name] || name];
              }}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  strikeouts: "K",
                  earnedRuns: "ER",
                  inningsPitched: "IP",
                };
                return <span className="text-gray-300">{labels[value] || value}</span>;
              }}
            />
            <Line
              type="monotone"
              dataKey="strikeouts"
              stroke="#C4A747"
              strokeWidth={2}
              dot={{ fill: "#C4A747", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#C4A747" }}
            />
            <Line
              type="monotone"
              dataKey="earnedRuns"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ fill: "#EF4444", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#EF4444" }}
            />
            <Line
              type="monotone"
              dataKey="inningsPitched"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: "#3B82F6", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#3B82F6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
