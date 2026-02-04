import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  title?: string;
  maxValue?: number;
  staggerDelay?: number;
  barColor?: string;
  showValues?: boolean;
  style?: React.CSSProperties;
}

const COLOR_BAR_DEFAULT = "#22c55e";
const COLOR_TEXT = "#e2e8f0";
const COLOR_MUTED = "#94a3b8";
const COLOR_AXIS = "#475569";

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  maxValue,
  staggerDelay = 5,
  barColor = COLOR_BAR_DEFAULT,
  showValues = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const calculatedMax = maxValue || Math.max(...data.map((d) => d.value)) * 1.1;

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        ...style,
      }}
    >
      {title && (
        <div
          style={{
            color: COLOR_TEXT,
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          {title}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.map((item, i) => {
          const progress = spring({
            frame: frame - i * staggerDelay,
            fps,
            config: { damping: 18, stiffness: 80 },
          });

          const barWidth = (item.value / calculatedMax) * 100 * progress;
          const opacity = Math.min(1, progress * 2);

          return (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 100,
                  color: COLOR_MUTED,
                  fontSize: 13,
                  textAlign: "right",
                  flexShrink: 0,
                  opacity,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 28,
                  backgroundColor: "rgba(71, 85, 105, 0.3)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${barWidth}%`,
                    height: "100%",
                    backgroundColor: item.color || barColor,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: 8,
                  }}
                >
                  {showValues && barWidth > 15 && (
                    <span
                      style={{
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        opacity,
                      }}
                    >
                      ${(item.value / 1000000).toFixed(2)}M
                    </span>
                  )}
                </div>
              </div>
              {showValues && barWidth <= 15 && (
                <span
                  style={{
                    color: COLOR_MUTED,
                    fontSize: 12,
                    opacity,
                    minWidth: 60,
                  }}
                >
                  ${(item.value / 1000000).toFixed(2)}M
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          height: 1,
          backgroundColor: COLOR_AXIS,
          marginTop: 16,
        }}
      />
    </div>
  );
};
