'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { Member, Project } from '@/types'
import InviteMemberForm from '@/components/inviteMemberForm'
import Navbar from '@/components/navbar'

export default function ProjectSettingsPage() {
  const { id } = useParams()
  const router = useRouter()

  const [project, setProject] = useState<Project | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')

        const res = await api.get(`/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setProject(res.data.data)
        setMembers(res.data.data.members)
      } catch (err) {
        alert('Gagal memuat detail project')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchData()
  }, [id])

  const handleInviteSuccess = (newMember: Member) => {
    setMembers(prev => [...prev, newMember])
  }

  const handleDelete = async () => {
    const confirm = window.confirm('Yakin ingin menghapus project ini?')
    if (!confirm) return

    setDeleting(true)
    try {
      await api.delete(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      alert('Project berhasil dihapus')
      router.push('/dashboard')
    } catch {
      alert('Gagal menghapus project')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-800">Pengaturan Project</h1>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="px-6 py-4 space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Informasi Project</h2>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium w-32 flex-shrink-0">Nama:</span>
                      <span className="text-gray-800">{project?.name}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium w-32 flex-shrink-0">Total Member:</span>
                      <span className="text-gray-800">{members.length} orang</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Undang Member Baru</h2>
                  <InviteMemberForm onSuccess={handleInviteSuccess} />
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h2 className="text-lg font-medium text-red-800 mb-3">Zona Berbahaya</h2>
                  <p className="text-red-600 mb-4">Hapus project ini secara permanen. Aksi ini tidak dapat dibatalkan.</p>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className={`px-4 py-2 rounded-md text-white ${deleting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} transition-colors`}
                  >
                    {deleting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menghapus...
                      </span>
                    ) : 'Hapus Project'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}