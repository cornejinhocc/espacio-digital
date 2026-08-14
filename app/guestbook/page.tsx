import Guestbook from '@/components/Guestbook'
import Link from 'next/link'

export default function GuestbookPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto mb-6">
        <Link href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
          ← Volver al inicio
        </Link>
      </div>
      <Guestbook />
    </main>
  )
}
