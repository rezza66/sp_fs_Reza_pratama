'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import type { Member } from '@/types'

type Props = {
  onSuccess: (newMember: Member) => void
}

export default function InviteMemberForm({ onSuccess }: Props) {
  const { id } = useParams()
  const [email, setEmail] = useState('')
  const [suggestions, setSuggestions] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    if (value.length > 1) {
      try {
        const res = await api.get(`/users/search?email=${value}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        setSuggestions(res.data.data)
      } catch {
        setSuggestions([])
      }
    } else {
      setSuggestions([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await api.post(
        `/projects/${id}/invite`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      alert('Berhasil mengundang member')
      onSuccess(res.data.data)
      setEmail('')
      setSuggestions([])
    } catch {
      alert('Gagal mengundang member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative mb-6 space-y-3">
      <h2 className="font-semibold">Undang Member</h2>
      <input
        type="email"
        placeholder="Cari email user"
        value={email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded shadow w-full max-h-40 overflow-y-auto">
          {suggestions.map(user => (
            <li
              key={user.id}
              onClick={() => {
                setEmail(user.email)
                setSuggestions([])
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {user.email}
            </li>
          ))}
        </ul>
      )}
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Mengundang...' : 'Invite'}
      </button>
    </form>
  )
}
