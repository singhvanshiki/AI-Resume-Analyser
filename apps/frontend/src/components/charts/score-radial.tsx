"use client";

import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

interface ScoreRadialProps {
  score: number;
}

export function ScoreRadial({ score }: ScoreRadialProps) {
  const data = [{ name: "score", value: score, fill: "#0f766e" }];

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer>
        <RadialBarChart
          data={data}
          innerRadius="70%"
          outerRadius="100%"
          startAngle={180}
          endAngle={0}
        >
          <RadialBar dataKey="value" cornerRadius={10} />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
