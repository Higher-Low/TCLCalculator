import { useState } from 'react'

export default function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      // setTimeout(() => setCopied(false), 2000); // reset après 2s
    } catch (err) {
      console.error('Erreur de copie : ', err)
    }
  }

  return (
    <button className='copy-button' onClick={handleCopy}>
      {copied ? '✅' : '📋'}
    </button>
  )
}
