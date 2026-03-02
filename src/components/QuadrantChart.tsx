import { type ScoreResult } from '@/lib/scoring';
import { QUADRANTS } from '@/lib/quadrants';

interface QuadrantChartProps {
  result: ScoreResult | null;
  orgName: string;
}

/**
 * Accessible SVG quadrant chart.
 * Plots the organisation as a point on a 2×2 grid with labelled quadrants.
 */
export default function QuadrantChart({ result, orgName }: QuadrantChartProps) {
  // Chart dimensions
  const padding = 60;
  const chartSize = 400;
  const totalSize = chartSize + padding * 2;

  const toX = (score: number) => padding + (score / 100) * chartSize;
  const toY = (score: number) => padding + ((100 - score) / 100) * chartSize; // invert Y

  const midX = toX(50);
  const midY = toY(50);

  return (
    <div className="mb-6">
      <h2 className="govuk-heading-m">Quadrant chart</h2>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${totalSize} ${totalSize}`}
          width="100%"
          style={{ maxWidth: '560px' }}
          role="img"
          aria-label={
            result
              ? `Quadrant chart showing ${orgName || 'organisation'} at X=${result.xScore}, Y=${result.yScore} in the "${QUADRANTS[result.quadrant].label}" quadrant.`
              : 'Empty quadrant chart. Submit scores to plot an organisation.'
          }
        >
          {/* Background quadrants */}
          {/* Bottom-left: Not ready (low X, low Y) */}
          <rect x={padding} y={midY} width={chartSize / 2} height={chartSize / 2} fill="hsl(9, 60%, 94%)" />
          {/* Bottom-right: Capability present (high X, low Y) */}
          <rect x={midX} y={midY} width={chartSize / 2} height={chartSize / 2} fill="hsl(35, 80%, 93%)" />
          {/* Top-left: Leadership ready (low X, high Y) */}
          <rect x={padding} y={padding} width={chartSize / 2} height={chartSize / 2} fill="hsl(210, 60%, 93%)" />
          {/* Top-right: Ready (high X, high Y) */}
          <rect x={midX} y={padding} width={chartSize / 2} height={chartSize / 2} fill="hsl(153, 60%, 92%)" />

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(v => (
            <g key={v}>
              <line
                x1={toX(v)} y1={padding} x2={toX(v)} y2={padding + chartSize}
                stroke="hsl(210, 3%, 70%)" strokeWidth={v === 50 ? 2 : 0.5} strokeDasharray={v === 50 ? undefined : '4,4'}
              />
              <line
                x1={padding} y1={toY(v)} x2={padding + chartSize} y2={toY(v)}
                stroke="hsl(210, 3%, 70%)" strokeWidth={v === 50 ? 2 : 0.5} strokeDasharray={v === 50 ? undefined : '4,4'}
              />
              {/* X axis labels */}
              <text x={toX(v)} y={padding + chartSize + 20} textAnchor="middle" fontSize="12" fill="hsl(200, 9%, 34%)">
                {v}
              </text>
              {/* Y axis labels */}
              <text x={padding - 10} y={toY(v) + 4} textAnchor="end" fontSize="12" fill="hsl(200, 9%, 34%)">
                {v}
              </text>
            </g>
          ))}

          {/* Outer border */}
          <rect x={padding} y={padding} width={chartSize} height={chartSize} fill="none" stroke="hsl(180, 7%, 4%)" strokeWidth="2" />

          {/* Quadrant labels */}
          <text x={padding + chartSize * 0.75} y={padding + chartSize * 0.15} textAnchor="middle" fontSize="11" fontWeight="700" fill="hsl(153, 100%, 22%)">
            Ready for NewCo
          </text>
          <text x={padding + chartSize * 0.25} y={padding + chartSize * 0.15} textAnchor="middle" fontSize="10" fontWeight="700" fill="hsl(210, 73%, 42%)">
            <tspan x={padding + chartSize * 0.25} dy="0">Leadership ready,</tspan>
            <tspan x={padding + chartSize * 0.25} dy="14">enablement needed</tspan>
          </text>
          <text x={padding + chartSize * 0.75} y={padding + chartSize * 0.85} textAnchor="middle" fontSize="10" fontWeight="700" fill="hsl(35, 80%, 40%)">
            <tspan x={padding + chartSize * 0.75} dy="0">Capability present,</tspan>
            <tspan x={padding + chartSize * 0.75} dy="14">governance risk</tspan>
          </text>
          <text x={padding + chartSize * 0.25} y={padding + chartSize * 0.88} textAnchor="middle" fontSize="11" fontWeight="700" fill="hsl(9, 77%, 47%)">
            Not ready yet
          </text>

          {/* Axis labels */}
          <text x={padding + chartSize / 2} y={totalSize - 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="hsl(180, 7%, 4%)">
            Delivery &amp; platform enablement →
          </text>
          <text
            transform={`rotate(-90, 14, ${padding + chartSize / 2})`}
            x={14} y={padding + chartSize / 2}
            textAnchor="middle" fontSize="13" fontWeight="700" fill="hsl(180, 7%, 4%)"
          >
            Governance &amp; change readiness →
          </text>

          {/* Plot point */}
          {result && (
            <g>
              {/* Crosshair lines */}
              <line x1={toX(result.xScore)} y1={padding} x2={toX(result.xScore)} y2={padding + chartSize}
                stroke="hsl(180, 7%, 4%)" strokeWidth="1" strokeDasharray="6,3" opacity="0.6" />
              <line x1={padding} y1={toY(result.yScore)} x2={padding + chartSize} y2={toY(result.yScore)}
                stroke="hsl(180, 7%, 4%)" strokeWidth="1" strokeDasharray="6,3" opacity="0.6" />

              {/* Point */}
              <circle
                cx={toX(result.xScore)}
                cy={toY(result.yScore)}
                r="8"
                fill="hsl(180, 7%, 4%)"
                stroke="white"
                strokeWidth="2"
              />

              {/* Score label */}
              <text
                x={toX(result.xScore) + 12}
                y={toY(result.yScore) - 12}
                fontSize="12"
                fontWeight="700"
                fill="hsl(180, 7%, 4%)"
              >
                ({result.xScore}, {result.yScore})
              </text>

              {/* Org name label */}
              {orgName && (
                <text
                  x={toX(result.xScore) + 12}
                  y={toY(result.yScore) + 2}
                  fontSize="11"
                  fill="hsl(200, 9%, 34%)"
                >
                  {orgName}
                </text>
              )}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
