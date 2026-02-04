import {
  interpolate,
  spring,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface TableRow {
  cells: (string | number)[];
}

interface TableCascadeProps {
  headers: string[];
  rows: TableRow[];
  staggerFrames?: number;
  rowDurationFrames?: number;
  style?: React.CSSProperties;
}

const AnimatedRow: React.FC<{
  cells: (string | number)[];
  isHeader?: boolean;
}> = ({ cells, isHeader = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entranceProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(entranceProgress, [0, 1], [10, 0]);

  return (
    <tr
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        backgroundColor: isHeader ? "rgba(30, 41, 59, 0.8)" : "transparent",
      }}
    >
      {cells.map((cell, i) => {
        const CellTag = isHeader ? "th" : "td";
        return (
          <CellTag
            key={i}
            style={{
              padding: "12px 16px",
              textAlign: i === 0 ? "left" : "right",
              borderBottom: "1px solid rgba(71, 85, 105, 0.5)",
              fontWeight: isHeader ? 600 : 400,
              color: isHeader ? "#94a3b8" : "#e2e8f0",
              fontSize: isHeader ? 12 : 14,
              textTransform: isHeader ? "uppercase" : "none",
              letterSpacing: isHeader ? "0.05em" : "normal",
            }}
          >
            {cell}
          </CellTag>
        );
      })}
    </tr>
  );
};

export const TableCascade: React.FC<TableCascadeProps> = ({
  headers,
  rows,
  staggerFrames = 3,
  rowDurationFrames = 30,
  style,
}) => {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: "system-ui, -apple-system, sans-serif",
        ...style,
      }}
    >
      <thead>
        <Sequence durationInFrames={rowDurationFrames} layout="none">
          <AnimatedRow cells={headers} isHeader />
        </Sequence>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <Sequence
            key={i}
            from={(i + 1) * staggerFrames}
            durationInFrames={rowDurationFrames}
            layout="none"
          >
            <AnimatedRow cells={row.cells} />
          </Sequence>
        ))}
      </tbody>
    </table>
  );
};
