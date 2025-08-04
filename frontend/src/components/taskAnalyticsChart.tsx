'use client'

import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { Task } from '@/types'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function TaskAnalyticsChart({ tasks }: { tasks: Task[] }) {
  const counts = {
    TODO: tasks.filter(t => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    DONE: tasks.filter(t => t.status === 'DONE').length,
  }

  const data = {
    labels: ['TODO', 'IN_PROGRESS', 'DONE'],
    datasets: [
      {
        data: [counts.TODO, counts.IN_PROGRESS, counts.DONE],
        backgroundColor: ['#f87171', '#facc15', '#34d399'],
      },
    ],
  }

  return <Pie data={data} />
}
