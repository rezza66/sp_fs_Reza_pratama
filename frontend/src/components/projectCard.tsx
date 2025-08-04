'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import type { Project } from '@/types'

export default function ProjectCard({ project }: { project: Project }) {
  const router = useRouter()

  return (
    <div className="p-4 bg-amber-200 shadow rounded space-y-2 hover:shadow-lg transition">
      <h3 className="text-lg font-bold">{project.name}</h3>
      <p className="text-sm text-gray-700">Owner: {project.owner.email}</p>
      <p className="text-sm text-gray-700">Members: {project.members.length}</p>
      <p className="text-sm text-gray-700">Tasks: {project._count.tasks}</p>

      <div className="flex space-x-2 pt-2">
        <button
          onClick={() => router.push(`/projects/${project.id}`)}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded"
        >
          Lihat
        </button>
        <button
          onClick={() => router.push(`/projects/${project.id}/settings`)}
          className="px-3 py-1 bg-gray-700 text-white text-sm rounded"
        >
          Setting
        </button>
      </div>
    </div>
  )
}
