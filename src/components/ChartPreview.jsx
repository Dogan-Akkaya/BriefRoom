import { useMemo, useRef } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#E8463A', '#4B83EE', '#F5A623', '#8B7CF6', '#2DD4A8', '#E8578A', '#60A5FA', '#FBBF24']
const tooltipStyle = { backgroundColor: '#151C2F', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 5, fontSize: 10 }

export default function ChartPreview({ labels, q1, q0, chartType, isDark = true }) {
  const ref = useRef(null)

  const data = useMemo(() =>
    labels.map((label, i) => ({
      name: label,
      current: q1[i],
      previous: q0 ? q0[i] : undefined,
    })),
    [labels, q1, q0]
  )

  const axisColor = isDark ? '#5C6478' : '#6B7280'
  const gridColor = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.06)'
  const barColor = isDark ? '#E8463A' : '#DC2626'
  const barColorDim = isDark ? 'rgba(232,70,58,0.2)' : 'rgba(220,38,38,0.25)'

  if (chartType === 'doughnut') {
    return (
      <div ref={ref} className="w-full h-full min-h-[280px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="current" nameKey="name" cx="50%" cy="50%" innerRadius="50%" outerRadius="80%" paddingAngle={2}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 10, color: axisColor }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (chartType === 'line') {
    return (
      <div ref={ref} className="w-full h-full min-h-[280px]">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: axisColor, fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="current" stroke={barColor} strokeWidth={2} dot={{ r: 2, fill: barColor }} />
            {q0 && <Line type="monotone" dataKey="previous" stroke={barColorDim} strokeWidth={1} strokeDasharray="4 3" dot={false} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (chartType === 'horizontal') {
    return (
      <div ref={ref} className="w-full h-full min-h-[280px]">
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical">
            <CartesianGrid stroke={gridColor} horizontal={false} />
            <XAxis type="number" tick={{ fill: axisColor, fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: axisColor, fontSize: 9 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="current" fill={barColor} radius={[0, 4, 4, 0]} barSize={14} />
            {q0 && <Bar dataKey="previous" fill={barColorDim} radius={[0, 4, 4, 0]} barSize={14} />}
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Default: bar
  return (
    <div ref={ref} className="w-full h-full min-h-[280px]">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke={gridColor} vertical={false} />
          <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: axisColor, fontSize: 9, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="current" fill={barColor} radius={[4, 4, 0, 0]} barSize={20} />
          {q0 && <Bar dataKey="previous" fill={barColorDim} radius={[4, 4, 0, 0]} barSize={20} />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
