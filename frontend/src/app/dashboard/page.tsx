'use client'

import { useEffect, useState } from "react"
import ProjectCard from "@/components/projectCard"
import { Project } from "@/types"
import { api } from "@/lib/api"
import Navbar from "@/components/navbar"

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await api.get('/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setProjects(res.data.data)
    } catch (err) {
      console.error(err)
      alert('Gagal memuat projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const token = localStorage.getItem("token")
      await api.post('/projects', { name }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setName('')
      await fetchProjects()
    } catch (err) {
      console.error(err)
      alert('Gagal membuat project')
    } finally {
      setCreating(false)
    }
  }

  return (
    <>
    <Navbar />
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Form Tambah Project */}
      <form onSubmit={handleCreateProject} className="mb-6 space-y-3 max-w-md">
        <h2 className="font-semibold">Tambah Project</h2>
        <input
          type="text"
          placeholder="Nama Project"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={creating}
        >
          {creating ? 'Membuat...' : 'Tambah Project'}
        </button>
      </form>

      {/* List Project */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </main>
    </>
    
  )
}
