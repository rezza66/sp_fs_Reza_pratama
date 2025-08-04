'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import type { Member } from '@/types'

type Props = {
  onSuccess: () => void
  members: Member[]
}

export default function AddTaskForm({ onSuccess, members }: Props) {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('TODO')
  const [assigneeId, setAssigneeId] = useState('')

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const payload = {
    title,
    description,
    status: status.toLowerCase(),
    assigneeId: assigneeId || null,
  };

  try {
    await api.post(`/tasks/${id}/tasks`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setTitle('');
    setDescription('');
    setStatus('TODO');
    setAssigneeId('');
    onSuccess();
  } catch (err: any) {
    alert("Gagal menambahkan task");
  }
};


  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3">
      <h2 className="font-semibold">Tambah Task</h2>
      <input
        type="text"
        placeholder="Judul"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Deskripsi"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="TODO">Todo</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>

      <select
        value={assigneeId}
        onChange={(e) => setAssigneeId(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">-- Pilih Assignee (Opsional) --</option>
        {members.map((member) => (
          <option key={member.id || member.email} value={member.id}>
            {member.email}
          </option>
        ))}
      </select>

      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Tambah
      </button>
    </form>
  )
}
