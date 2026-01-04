import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

export default function Presensi() {
  const videoRef = useRef(null)
  const [streamOk, setStreamOk] = useState(false)
  const [latLng, setLatLng] = useState(null)
  const canvasRef = useRef(null)

  useEffect(()=>{
    // request camera
    const start = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true })
        videoRef.current.srcObject = s
        videoRef.current.play()
        setStreamOk(true)
      } catch (e) { console.error(e) }
    }
    start()
    // request location
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p=>setLatLng({lat:p.coords.latitude, lon:p.coords.longitude, ts:p.timestamp}), err=>console.error(err))
  }, [])

  const capture = () => {
    const v = videoRef.current
    const c = canvasRef.current
    c.width = v.videoWidth
    c.height = v.videoHeight
    const ctx = c.getContext('2d')
    ctx.drawImage(v, 0, 0)
    return c.toDataURL('image/jpeg', 0.8)
  }

  const doCheckin = async () => {
    const photo = capture()
    const payload = { userId: 1, lat: latLng?.lat || 0, lon: latLng?.lon || 0, photo }
    const res = await axios.post((process.env.NEXT_PUBLIC_API_URL||'http://localhost:4000') + '/attendance/checkin', payload)
    alert('Check-in result: ' + JSON.stringify(res.data))
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-xl font-semibold mb-4">Presensi</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <video ref={videoRef} className="w-full rounded" />
          <canvas ref={canvasRef} style={{display:'none'}} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p>Location: {latLng ? `${latLng.lat}, ${latLng.lon}` : 'Fetching...'}</p>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded" onClick={doCheckin}>Check In</button>
        </div>
      </div>
    </div>
  )
}
