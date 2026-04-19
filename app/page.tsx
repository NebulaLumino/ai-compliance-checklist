"use client";

import { useState } from "react";

export default function ComplianceChecklistPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">AI Compliance Audit Checklist Builder</h1>
          </div>
          <p className="text-gray-400 text-lg">Generate comprehensive regulatory compliance checklists for SOX, HIPAA, ISO 27001, SOC 2, and more</p>
        </header>

        <div className="space-y-4 mb-6">
          <label className="block text-sm font-medium text-gray-300">Organization Context / Regulatory Framework</label>
          <textarea
            className="w-full h-48 bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none"
            placeholder="Describe your organization and the compliance framework needed...&#10;&#10;Example:&#10;Organization: SaaS company with 200 employees, handles payment data&#10;Framework: SOC 2 Type II&#10;Data handled: PII, payment card data&#10;Industry: Fintech&#10;Prior audit findings: Access control gaps identified in last review"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <button
          onClick={analyze}
          disabled={loading || !input.trim()}
          className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Building Checklist...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Build Compliance Checklist
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-700/50 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-200 mb-3">Compliance Audit Checklist</h2>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
              {result}
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-gray-600 text-xs">
          Powered by DeepSeek AI · Not a substitute for professional audit · Not legal advice
        </footer>
      </div>
    </main>
  );
}
