import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { orgDescription, framework, orgType, dataProcessed } = await req.json();

    if (!orgDescription) {
      return NextResponse.json({ error: 'Organization description is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is not configured' }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: 'https://api.deepseek.com/v1',
    });

    const prompt = `You are an expert compliance officer and information security consultant. Generate a comprehensive, actionable compliance checklist for the following organization.

ORGANIZATION: ${orgDescription}
ORGANIZATION TYPE: ${orgType}
COMPLIANCE FRAMEWORK: ${framework}
DATA TYPES PROCESSED: ${dataProcessed || 'Not specified'}

Generate a structured compliance checklist that includes:

## ASSESSMENT OVERVIEW
- Scope of compliance
- Key stakeholders involved
- Estimated timeline for full compliance
- Key risk areas

## PREPARATION PHASE CHECKLIST
Numbered checklist items covering:
- Gap assessment (current state vs. requirements)
- Stakeholder alignment and governance setup
- Resource and budget planning
- Documentation requirements

## TECHNICAL CONTROLS CHECKLIST
Specific technical requirements from the ${framework} framework, grouped by domain:
- Access control requirements
- Data encryption requirements (at rest and in transit)
- Network security controls
- Endpoint and device security
- Logging and monitoring requirements
- Backup and disaster recovery
- Vulnerability management

## ORGANIZATIONAL / PROCESS CONTROLS CHECKLIST
- Security policies and procedures
- Incident response plan
- Vendor/third-party management
- Employee training and awareness
- Background screening
- Change management

## DOCUMENTATION REQUIREMENTS
- Required policies
- Required records and evidence
- Audit-ready documentation structure

## REMEDIATION PRIORITY MATRIX
For each control area: PRIORITY (High/Medium/Low), COMPLEXITY (Easy/Medium/Hard), ESTIMATED EFFORT

## AUDIT PREPARATION TIPS
Practical tips for passing the compliance audit or certification assessment

Format the checklist with checkboxes (e.g., "[ ]") for each actionable item. Group by category. Be specific and actionable — not just "implement security controls" but what specifically needs to be done.`;

    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a senior compliance officer and information security consultant with deep expertise in SOC 2, ISO 27001, HIPAA, GDPR, PCI DSS, and NIST frameworks. Generate thorough, accurate, and actionable compliance checklists. Be specific about what controls are required and how to implement them.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.6,
      max_tokens: 3500,
    });

    const output = completion.choices[0]?.message?.content || 'No output generated.';

    return NextResponse.json({ output });
  } catch (err: unknown) {
    console.error('Compliance checklist generation error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
