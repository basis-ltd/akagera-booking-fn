import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface DashboardGraphProps {
  data: {
    date: string;
    value: number;
  }[];
  dataKey: string;
  height?: string;
  width?: string;
  type?:
    | 'basis'
    | 'basisClosed'
    | 'basisOpen'
    | 'linear'
    | 'monotone'
    | 'natural'
    | 'step'
    | 'stepAfter'
    | 'stepBefore';
  vertical?: boolean;
  fill?: string;
  strokeWidth?: number;
}

const DashboardGraph = ({
  data,
  dataKey,
  height = '90%',
  width = '100%',
  type = 'natural',
  vertical = false,
  fill = '#EAFAFE',
  strokeWidth = 2,
}: DashboardGraphProps) => {
  return (
    <ResponsiveContainer height={height} width={width}>
      <ComposedChart compact data={data}>
        <Area
          connectNulls
          dataKey="value"
          fill={fill}
          stackId={1}
          fillOpacity={0.8}
          strokeWidth={strokeWidth}
          stroke="#056025"
          type={type || 'natural'}
        />
        <XAxis dataKey={dataKey} />
        <Legend />
        <YAxis
          allowDataOverflow
          tickSize={10}
          tickMargin={20}
          className="!text-[12px]"
          style={{
            fontSize: '12px',
          }}
        />
        <Tooltip />
        <CartesianGrid strokeDasharray={'5 5'} y={0} vertical={vertical} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default DashboardGraph;
