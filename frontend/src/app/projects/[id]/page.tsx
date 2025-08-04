'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import type { Task, Member } from '@/types'
import AddTaskForm from '@/components/addTaskForm'
import TaskBoard from '@/components/TaskBoard'
import Navbar from '@/components/navbar'
import TaskAnalyticsChart from '@/components/taskAnalyticsChart'
import { toast, Toaster } from 'react-hot-toast'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await api.get(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const normalizedTasks = res.data.data.tasks.map((task: any) => ({
        ...task,
        status: task.status.toUpperCase(),
      }))
      setTasks(normalizedTasks)
    } catch {
      alert('Gagal memuat task')
    }
  }

  const fetchMembers = async () => {
    try {
      const res = await api.get(`/projects/${id}/members`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      console.log("👥 Members:", res.data.data)
      setMembers(res.data.data)
    } catch {
      alert('Gagal memuat member')
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await api.patch(
        `/tasks/task/${taskId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      fetchTasks()
    } catch {
      alert('Gagal mengubah status')
    }
  }

  useEffect(() => {
    if (id) {
      Promise.all([fetchTasks(), fetchMembers()]).finally(() => setLoading(false))
    }
  }, [id])

  // Fungsi untuk handle success tambah task
  const handleAddTaskSuccess = async () => {
    await fetchTasks()
    toast.success('Task berhasil ditambahkan!', {
      position: 'top-right',
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Toaster /> {/* Komponen untuk menampilkan notifikasi */}
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Task Board
              </h1>
              <p className="text-slate-600 text-lg">Kelola proyek Anda dengan efisien dan terorganisir</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm text-slate-600 font-medium">
                {members.length} Members Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Actions Section */}
        <div className="mb-8">
          {/* Add Task Card - Now full width */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Tambah Task Baru</h2>
            </div>
            <AddTaskForm onSuccess={handleAddTaskSuccess} members={members} />
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin animate-reverse"></div>
            </div>
            <p className="mt-4 text-slate-600 font-medium animate-pulse">Memuat data proyek...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Task Board Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">Task Board</h2>
                  <p className="text-slate-600">Kelola status dan progress task Anda</p>
                </div>
              </div>
              <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} />
            </div>

            {/* Analytics Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">Analytics</h2>
                  <p className="text-slate-600">Visualisasi progress dan statistik proyek</p>
                </div>
              </div>
              <div className='h-64 flex justify-center'>
                <TaskAnalyticsChart tasks={tasks}/>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}