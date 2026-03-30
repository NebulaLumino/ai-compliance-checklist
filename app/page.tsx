'use client';

import { useState } from 'react';

const ACCENT = 'hsl(150, 70%, 45%)';
const ACCENT_LIGHT = 'hsl(150, 70%, 55%)';

const FRAMEWORKS = [
  'SOC 2 Type II',
  'SOC 2 Type I',
  'ISO 27001',
  'ISO 27701',
  'HIPAA / HITECH',
  'GDPR',
  'PCI DSS',
  'NIST Cybersecurity Framework',
  'CIS Controls',
  'COBIT',
  'FedRAMP (Moderate)',
  'Custom / Multi-Framework',
];

const ORG_TYPES = [
  'SaaS / Cloud Provider',
  'Healthcare / Health Tech',
  'Financial Services / FinTech',
  'E-commerce / Retail',
  'Media / Content Platform',
  'Government / Public Sector',
  'Startup / Early Stage',
  'Enterprise / Large Corporation',
  'Managed Service Provider (MSP)',
  'Other',
];

export default function ComplianceChecklistPage() {
  const [orgDescription, setOrgDescription] = useState('');
  const [framework, setFramework] = useState('SOC 2 Type II');
  const [orgType, setOrgType] = useState('SaaS / Cloud Provider');
  const [dataProcessed, setDataProcessed] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgDescription, framework, orgType, dataProcessed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setOutput(data.output);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-gray-100">
      <div className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold" style={{ backgroundColor: ACCENT }}>
              ✅
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Compliance Checklist Builder</h1>
              <p className="text-sm text-gray-400">SOC2 · ISO27001 · HIPAA · GDPR</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Compliance Framework</label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': ACCENT } as React.CSSProperties}
              >
                {FRAMEWORKS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Organization Type</label>
              <select
                value={orgType}
                onChange={(e) => setOrgType(e.target.value)}
                className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': ACCENT } as React.CSSProperties}
              >
                {ORG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Organization Description</label>
            <textarea
              value={orgDescription}
              onChange={(e) => setOrgDescription(e.target.value)}
              placeholder="Describe your organization, what you do, your tech stack, and how you handle data..."
              className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 resize-none"
              style={{ '--tw-ring-color': ACCENT } as React.CSSProperties}
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Data Types Processed</label>
            <textarea
              value={dataProcessed}
              onChange={(e) => setDataProcessed(e.target.value)}
              placeholder="e.g. PII (names, emails), payment data, health records, employee data, system logs..."
              className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 resize-none"
              style={{ '--tw-ring-color': ACCENT } as React.CSSProperties}
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:brightness-95"
            style={{ backgroundColor: loading ? ACCENT_LIGHT : ACCENT }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating Compliance Checklist…
              </span>
            ) : 'Generate Compliance Checklist'}
          </button>

          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-xl px-4 py-3 text-sm text-red-300">{error}</div>
          )}
        </form>

        <div>
          {output ? (
            <div className="bg-gray-900/80 border border-gray-700 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Compliance Checklist</span>
                <button
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="text-xs px-3 py-1.5 rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  Copy
                </button>
              </div>
              <div className="p-6 overflow-y-auto" style={{ maxHeight: '600px', color: '#e5e7eb' }}>
                {output.split('\n').map((line, i) => (
                  <p key={i} className="mb-3 leading-relaxed whitespace-pre-wrap">{line}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center min-h-80 rounded-2xl border border-dashed border-gray-700 text-gray-500 text-sm text-center p-8">
              <div className="text-4xl mb-4 opacity-30">✅</div>
              <p className="font-medium text-gray-400 mb-1">No checklist generated yet</p>
              <p className="text-xs text-gray-600">Fill in the form and click generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
