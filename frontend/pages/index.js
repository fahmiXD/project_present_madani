import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl p-8 bg-white shadow rounded">
        <h1 className="text-2xl font-semibold mb-4">Presensi Madani Creative</h1>
        <p className="mb-6">Modern attendance system — demo dashboard.</p>
        <div className="flex gap-3">
          <Link href="/login"><a className="px-4 py-2 bg-indigo-600 text-white rounded">Login</a></Link>
          <Link href="/presensi"><a className="px-4 py-2 border border-gray-200 rounded">Go to Presensi</a></Link>
        </div>
      </div>
    </div>
  )
}
