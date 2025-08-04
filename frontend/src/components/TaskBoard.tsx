'use client'

import { Task } from '@/types'

type Props = {
  tasks: Task[]
  onStatusChange?: (taskId: string, newStatus: string) => void
}

export default function TaskBoard({ tasks, onStatusChange }: Props) {
  const grouped = {
    TODO: tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
    DONE: tasks.filter(t => t.status === 'DONE'),
  }

  const handleDrop = (task: Task, newStatus: string) => {
    if (task.status !== newStatus && onStatusChange) {
      onStatusChange(task.id, newStatus)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(grouped).map(([status, items]) => (
        <div
          key={status}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const task = JSON.parse(e.dataTransfer.getData("task"))
            handleDrop(task, status)
          }}
          className="bg-gray-100 p-4 rounded min-h-[200px]"
        >
          <h2 className="font-semibold mb-2">{status.replace("_", " ")}</h2>
          <div className="space-y-2">
            {items.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("task", JSON.stringify(task))
                }}
                className="p-4 bg-white rounded shadow cursor-move"
              >
                <h3 className="font-bold">{task.title}</h3>
                <p className="text-sm text-gray-500">{task.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Assignee: {task.assignee?.email ?? "Belum ditugaskan"}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
