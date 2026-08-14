'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Guestbook() {
  const [messages, setMessages] = useState([])
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setMessages(data)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !message) return

    setLoading(true)
    const { error } = await supabase.from('guestbook').insert([
      { name, handle, message }
    ])

    if (!error) {
      setName('')
      setHandle('')
      setMessage('')
      fetchMessages()
    }
    setLoading(false)
  }

  const handleLike = async (id, currentLikes) => {
    const { error } = await supabase
      .from('guestbook')
      .update({ likes: (currentLikes || 0) + 1 })
      .eq('id', id)

    if (!error) {
      fetchMessages()
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="border border-neutral-800 p-6 rounded-xl bg-neutral-900/50">
        <h2 className="text-xl font-semibold mb-4 text-white">Firma el Libro de Visitas</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tu Nombre *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-neutral-600"
              required
            />
            <input
              type="text"
              placeholder="Handle / Redes (ej. @jimmy)"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-neutral-600"
            />
          </div>
          <textarea
            placeholder="Escribe tu mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-neutral-600 h-24"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-medium py-2.5 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Publicar Mensaje'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-neutral-300">Mensajes ({messages.length})</h3>
        {messages.map((item) => (
          <div key={item.id} className="p-4 border border-neutral-800/80 rounded-lg bg-neutral-900/20 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-semibold text-white">{item.name}</span>
                {item.handle && <span className="text-sm text-neutral-400 ml-2">{item.handle}</span>}
              </div>
              <button
                onClick={() => handleLike(item.id, item.likes)}
                className="flex items-center space-x-1 text-xs text-neutral-400 hover:text-white border border-neutral-800 px-2 py-1 rounded"
              >
                <span>❤️</span>
                <span>{item.likes || 0}</span>
              </button>
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed">{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
