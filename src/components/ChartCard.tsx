import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from './ui'

export function ChartCard({
  title,
  subtitle,
  data,
  dataKey,
  color,
  yLabel,
}: {
  title: string
  subtitle: string
  data: Record<string, string | number>[]
  dataKey: string
  color: string
  yLabel: string
}) {
  return (
    <Card>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-ink-400">{subtitle}</p>
      <div className="mt-5 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2c3446" />
            <XAxis
              dataKey="period"
              tick={{ fill: '#838ba3', fontSize: 12 }}
              axisLine={{ stroke: '#2c3446' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#838ba3', fontSize: 12 }}
              axisLine={{ stroke: '#2c3446' }}
              tickLine={false}
              label={{
                value: yLabel,
                angle: -90,
                position: 'insideLeft',
                fill: '#5b6379',
                fontSize: 12,
              }}
            />
            <Tooltip
              contentStyle={{
                background: '#171c28',
                border: '1px solid #2c3446',
                borderRadius: 8,
                fontSize: 12,
                color: '#dde1eb',
              }}
              labelStyle={{ color: '#dde1eb' }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2.5}
              dot={{ r: 3, fill: color }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs italic text-ink-500">
        Illustrative shape, not real market or population data.
      </p>
    </Card>
  )
}
