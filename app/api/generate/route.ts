import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are a compliance officer and regulatory expert. Generate a comprehensive compliance audit checklist tailored to the organization and framework described.

For the specified framework, produce:

1. **Framework Overview** - what the framework covers and its key requirements
2. **Audit Readiness Scorecard** - current state assessment framework
3. **Phase 1: Pre-Assessment** (Days 1-30)
   - Gap analysis tasks
   - Documentation collection checklist
   - Stakeholder interviews
4. **Phase 2: Implementation** (Days 31-90)
   - Control implementation checklist
   - Policy updates required
   - Technical control requirements
5. **Phase 3: Testing** (Days 91-120)
   - Evidence collection checklist
   - Control testing procedures
   - Remediation tracking
6. **Phase 4: Audit** (Days 121+)
   - Auditor preparation
   - Support documentation ready
   - Interview preparation
7. **Control Mapping** - which controls satisfy which framework requirements
8. **Evidence Repository** - what documentation to prepare for each control
9. **Common Findings** - typical auditor objections and how to address them
10. **Critical vs. Non-Critical Deficiencies** - prioritization

Frameworks to support: SOC 2, ISO 27001, HIPAA, SOX, GDPR, PCI DSS, NIST CSF, FedRAMP, CMMC.`,
        },
        {
          role: "user",
          content: `Build a compliance audit checklist for:\n\n${prompt}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2500,
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      return NextResponse.json({ error: "No response from model" }, { status: 500 });
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
  }
}
