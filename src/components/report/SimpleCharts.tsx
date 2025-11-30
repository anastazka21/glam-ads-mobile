// Simple chart components for better PDF rendering
interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export const SimplePieChart = ({ data, size = 200 }: { data: PieChartData[]; size?: number }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;
  const innerRadius = size * 0.2;

  const segments: { item: PieChartData; startAngle: number; endAngle: number }[] = [];
  let accumulatedAngle = -90;

  data.forEach((item) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    segments.push({
      item,
      startAngle: accumulatedAngle,
      endAngle: accumulatedAngle + angle,
    });
    accumulatedAngle += angle;
  });

  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  const createArcPath = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
    const start = polarToCartesian(centerX, centerY, outerR, endAngle);
    const end = polarToCartesian(centerX, centerY, outerR, startAngle);
    const innerStart = polarToCartesian(centerX, centerY, innerR, endAngle);
    const innerEnd = polarToCartesian(centerX, centerY, innerR, startAngle);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return [
      `M ${start.x} ${start.y}`,
      `A ${outerR} ${outerR} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${innerR} ${innerR} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y}`,
      "Z",
    ].join(" ");
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => (
        <path
          key={i}
          d={createArcPath(seg.startAngle, seg.endAngle, radius, innerRadius)}
          fill={seg.item.color}
        />
      ))}
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-foreground text-2xl font-bold"
      >
        {data[0]?.value.toFixed(0)}%
      </text>
    </svg>
  );
};

interface BarChartData {
  name: string;
  value: number;
  color?: string;
}

export const SimpleBarChart = ({ data, height = 200 }: { data: BarChartData[]; height?: number }) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const barWidth = 100 / data.length;

  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      {data.map((item, i) => {
        const barHeight = (item.value / maxValue) * (height - 30);
        const x = i * barWidth + barWidth * 0.1;
        const y = height - barHeight - 20;
        return (
          <g key={i}>
            <rect
              x={`${x}%`}
              y={y}
              width={`${barWidth * 0.8}%`}
              height={barHeight}
              fill={item.color || "#ec4899"}
              rx={4}
            />
            <text
              x={`${x + barWidth * 0.4}%`}
              y={height - 5}
              textAnchor="middle"
              className="fill-muted-foreground text-[8px]"
            >
              {item.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

interface LineChartData {
  name: string;
  reach?: number;
  clicks?: number;
}

export const SimpleLineChart = ({ data, height = 200 }: { data: LineChartData[]; height?: number }) => {
  const reachValues = data.map((d) => d.reach || 0);
  const clicksValues = data.map((d) => d.clicks || 0);
  const maxValue = Math.max(...reachValues, ...clicksValues);

  const getPath = (values: number[]) => {
    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = height - 30 - (v / maxValue) * (height - 50);
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  };

  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      <path
        d={getPath(reachValues)}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
      />
      <path
        d={getPath(clicksValues)}
        fill="none"
        stroke="#ec4899"
        strokeWidth="2"
      />
      {data.map((item, i) => (
        <text
          key={i}
          x={`${(i / (data.length - 1)) * 100}%`}
          y={height - 5}
          textAnchor="middle"
          className="fill-muted-foreground text-[8px]"
        >
          {item.name}
        </text>
      ))}
    </svg>
  );
};
