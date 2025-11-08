"use client";

import { useMemo, useState } from "react";

type RaffleEntry = {
  id: string;
  label: string;
  weight?: number;
};

type EntriesWheelProps = {
  entries: RaffleEntry[];
  onWinnerSelected?: (entry: RaffleEntry) => void;
};

type WheelSegment = {
  entry: RaffleEntry;
  startAngle: number;
  endAngle: number;
  midAngle: number;
  color: string;
};

const SEGMENT_COLORS = [
  "#4ECDC4",
  "#45B7D1",
  "#F7B267",
  "#F25F5C",
  "#B77FFF",
  "#FFD166",
  "#06D6A0",
  "#118AB2",
];

const DEFAULT_ENTRIES: RaffleEntry[] = [
  { id: "placeholder-1", label: "No entries yet" },
];

const WHEEL_SIZE = 360;
const RADIUS = 140;
const CENTER = 160;

export function RaffleEntriesWheel({
  entries,
  onWinnerSelected,
}: EntriesWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<RaffleEntry | null>(null);

  const segments = useMemo<WheelSegment[]>(() => {
    const validEntries = entries.length ? entries : DEFAULT_ENTRIES;
    const totalWeight = validEntries.reduce((total, entry) => {
      const weight = entry.weight ?? 1;
      return total + (weight > 0 ? weight : 1);
    }, 0);
    let cursor = 0;
    return validEntries.map((entry, index) => {
      const weight = entry.weight ?? 1;
      const normalizedWeight = weight > 0 ? weight : 1;
      const sliceAngle = (normalizedWeight / totalWeight) * 360;
      const startAngle = cursor;
      const endAngle = cursor + sliceAngle;
      const midAngle = startAngle + sliceAngle / 2;
      const color = SEGMENT_COLORS[index % SEGMENT_COLORS.length];
      cursor += sliceAngle;
      return { entry, startAngle, endAngle, midAngle, color };
    });
  }, [entries]);

  const handleSpin = () => {
    if (isSpinning || segments.length === 0) {
      return;
    }
    const randomSegment =
      segments[Math.floor(Math.random() * segments.length)];
    const baseRotation = 720 + Math.random() * 360;
    const targetRotation =
      baseRotation + (360 - randomSegment.midAngle + rotation % 360);
    setIsSpinning(true);
    setWinner(null);
    setRotation((current) => current + targetRotation);
    window.setTimeout(() => {
      setIsSpinning(false);
      setWinner(randomSegment.entry);
      onWinnerSelected?.(randomSegment.entry);
    }, 3200);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex items-center justify-center">
        <div className="relative h-80 w-80">
          <div
            className="absolute inset-0 rounded-full border-4 border-zinc-200 shadow-inner"
            aria-hidden="true"
          />
          <div
            className="absolute inset-3 rounded-full border border-white/40 bg-white shadow-lg transition-transform duration-[3000ms] ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <WheelSvg segments={segments} />
            <div className="absolute inset-12 flex flex-col items-center justify-center gap-2 rounded-full bg-white/70 backdrop-blur-sm">
              <span className="text-sm uppercase tracking-wide text-zinc-500">
                Total Entries
              </span>
              <span className="text-3xl font-semibold text-zinc-900">
                {entries.length}
              </span>
              {winner && (
                <div className="text-center text-xs text-zinc-600">
                  Winner: <strong>{winner.label}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute -top-6 flex flex-col items-center">
          <span className="relative block h-10 w-10 rounded-full bg-zinc-900 shadow-lg">
            <span className="absolute left-1/2 top-full h-3 w-2 -translate-x-1/2 rounded-b-full bg-zinc-900" />
          </span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Winner
          </span>
        </div>
      </div>
      <button
        type="button"
        className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
        onClick={handleSpin}
        disabled={isSpinning || segments.length === 0}
      >
        {isSpinning ? "Spinning..." : "Spin the Wheel"}
      </button>
    </div>
  );
}

type WheelSvgProps = {
  segments: WheelSegment[];
};

function WheelSvg({ segments }: WheelSvgProps) {
  return (
    <svg
      viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
      className="pointer-events-none h-full w-full select-none"
    >
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="#f8fafc"
        stroke="#e2e8f0"
        strokeWidth={2}
      />
      {segments.map((segment, index) => (
        <path
          key={segment.entry.id ?? index}
          d={describeSegment(segment.startAngle, segment.endAngle)}
          fill={segment.color}
          stroke="#ffffff"
          strokeWidth={2}
        />
      ))}
      {segments.map((segment, index) => {
        const labelPosition = polarToCartesian(
          CENTER,
          CENTER,
          RADIUS * 0.6,
          segment.midAngle
        );

        return (
          <text
            key={`label-${segment.entry.id ?? index}`}
            x={labelPosition.x}
            y={labelPosition.y}
            fill="#0f172a"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize={12}
            fontWeight={600}
            transform={`rotate(${segment.midAngle}, ${labelPosition.x}, ${labelPosition.y})`}
          >
            {segment.entry.label}
          </text>
        );
      })}
    </svg>
  );
}

function describeSegment(startAngle: number, endAngle: number) {
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
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
