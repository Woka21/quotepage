import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Logo } from '@/components/qp/Logo'
import { StatusPill } from '@/components/qp/StatusPill'
import { toast } from 'sonner'

export default function PublicQuote() {
  const { token } = useParams<{ token: string }>()
  const [copied, setCopied] = useState(false)

  // Mock data - replace with actual API calls
  const quote = {
    token,
    quote_number: 'Q001',
    status: 'sent',
    validity_days: 14,
    created_at: new Date().toISOString(),
    business: {
      name: 'Your Business',
      accent_color: '#2B7A6F',
      logo_url: null,
      tax_enabled: false,
      tax_rate: 0,
    },
    customer: {
      name: 'Customer Name',
      address: '123 Main St',
      email: 'customer@example.com',
    },
    job_type: 'Service',
    line_items: [],
    notes: '',
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const expired = false
  const finalized = false

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Logo />
          <StatusPill kind="quote" status={expired && !finalized ? 'expired' : quote.status} />
        </div>

        <div className="qp-glass-strong overflow-hidden">
          <div className="h-2" style={{ backgroundColor: quote.business.accent_color || '#2B7A6F' }} />
          <div className="p-8 md:p-10 bg-white/40">
            <p style={{ fontWeight: 500, color: '#1C1C1A', fontSize: '1.1rem' }}>{quote.business.name}</p>
            <p>Quote: {quote.quote_number}</p>
            <p style={{ color: '#6B6B67' }}>Loading quote details...</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-[10px]" style={{ color: '#9b9b96' }}>Made with QuotePage</p>
          <button onClick={copyLink} className="text-xs" style={{ color: '#6B6B67' }}>
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      </div>
    </div>
  )
}
