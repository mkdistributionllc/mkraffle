/**
 * Visual raffle entries wheel
 *
 * This component is a purely decorative representation of raffle odds. It animates
 * continuously and does not determine or announce winners.
 */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type RaffleEntry = {
  id: string;
  label: string;
  weight?: number;
};

type RaffleEntriesWheelProps = {
  entries: RaffleEntry[];
  /**
   * Duration for one full rotation (defaults to 12s)
   */
  spinDurationMs?: number;
};

const COLORS = [
  "#4F46E5",
  "#38BDF8",
  "#22D3EE",
  "#34D399",
  "#F97316",
  "#FACC15",
  "#A855F7",
  "#EF4444",
];

const SIZE = 340;
const CENTER = SIZE / 2;
const RADIUS = CENTER - 14;

export function RaffleEntriesWheel({
  entries,
  spinDurationMs = 12000,
}: RaffleEntriesWheelProps) {
  const shuffledEntries = useMemo(() => shuffleEntries(entries), [entries]);
  const segments = useMemo(() => buildSegments(shuffledEntries), [shuffledEntries]);
  const [rotation, setRotation] = useState(0);
  const previousTimestamp = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const step = (timestamp: number) => {
      if (previousTimestamp.current === null) {
        previousTimestamp.current = timestamp;
      }
      const delta = timestamp - previousTimestamp.current;
      previousTimestamp.current = timestamp;
      const degreesPerMs = 360 / spinDurationMs;
      setRotation((prev) => (prev + degreesPerMs * delta) % 360);
      frameRef.current = window.requestAnimationFrame(step);
    };
    frameRef.current = window.requestAnimationFrame(step);
    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
      previousTimestamp.current = null;
    };
  }, [spinDurationMs, segments.length]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex items-center justify-center">
        <div className="relative h-[420px] w-[420px]">
          <div className="absolute inset-0 rounded-full border border-white/10 bg-zinc-950/80 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="absolute inset-[18px] rounded-full border border-white/5 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 shadow-inner shadow-black/60" />
          </div>
          <div
            className="absolute inset-[28px]"
            style={{ transformOrigin: "50% 50%", transform: `rotate(${rotation}deg)` }}
          >
            <WheelSvg segments={segments} />
          </div>
        </div>
        <div className="pointer-events-none absolute -top-9 flex flex-col items-center">
          <span className="relative block h-16 w-16 rounded-full border-2 border-amber-400 bg-amber-500 text-transparent shadow-lg shadow-amber-900/60">
            <span className="absolute left-1/2 top-full h-5 w-3 -translate-x-1/2 rounded-b-full bg-amber-400" />
          </span>
          <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-amber-200">
            Live odds
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 rounded-full border border-white/10 bg-zinc-950/80 text-zinc-100 shadow-inner shadow-black/40">
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
          Entries
        </span>
        <span className="text-4xl font-semibold">
          {entries.length.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

type WheelSegment = {
  entry: RaffleEntry;
  startAngle: number;
  endAngle: number;
  midAngle: number;
  color: string;
};

type WheelSvgProps = {
  segments: WheelSegment[];
};

function WheelSvg({ segments }: WheelSvgProps) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="pointer-events-none h-full w-full select-none"
    >
      <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="#0f172a" />
      {segments.map((segment) => (
        <path
          key={segment.entry.id}
          d={describeArc(segment.startAngle, segment.endAngle)}
          fill={segment.color}
          stroke="#0f172a"
          strokeWidth={1.4}
        />
      ))}
      {segments.map((segment) => {
        const { x, y } = polarToCartesian(
          CENTER,
          CENTER,
          RADIUS * 0.63,
          segment.midAngle
        );
        return (
          <text
            key={`${segment.entry.id}-label`}
            x={x}
            y={y}
            fill="#0f172a"
            fontWeight={600}
            fontSize={12}
            dominantBaseline="middle"
            textAnchor="middle"
            transform={`rotate(${segment.midAngle}, ${x}, ${y})`}
          >
            {getFirstName(segment.entry.label)}
          </text>
        );
      })}
    </svg>
  );
}

function buildSegments(entries: RaffleEntry[]): WheelSegment[] {
  if (!entries.length) {
    return [
      {
        entry: { id: "empty", label: "No entries yet" },
        startAngle: 0,
        endAngle: 360,
        midAngle: 180,
        color: COLORS[0],
      },
    ];
  }

  const totalWeight = entries.reduce(
    (sum, entry) => sum + Math.max(entry.weight ?? 1, 1),
    0
  );

  let cursor = 0;

  return entries.map((entry, index) => {
    const normalizedWeight = Math.max(entry.weight ?? 1, 1);
    const sliceAngle = (normalizedWeight / totalWeight) * 360;
    const startAngle = cursor;
    const endAngle = cursor + sliceAngle;
    const midAngle = startAngle + sliceAngle / 2;
    const color = COLORS[index % COLORS.length];
    cursor += sliceAngle;
    return { entry, startAngle, endAngle, midAngle, color };
  });
}

function describeArc(startAngle: number, endAngle: number) {
  const start = polarToCartesian(CENTER, CENTER, RADIUS, endAngle);
  const end = polarToCartesian(CENTER, CENTER, RADIUS, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    "M",
    CENTER,
    CENTER,
    "L",
    start.x,
    start.y,
    "A",
    RADIUS,
    RADIUS,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "Z",
  ].join(" ");
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function shuffleEntries(entries: RaffleEntry[]) {
  if (!entries.length) {
    return [];
  }
  const cloned = [...entries];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

function getFirstName(label: string) {
  const trimmed = label.trim();
  if (!trimmed) {
    return label;
  }
  const [first] = trimmed.split(/\s+/);
  return first || label;
}
