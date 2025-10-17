export const DUMMY_QUESTIONS = [
  // Cost & Value (3 questions)
  {
    id: "q1",
    text: "Why is this therapy so expensive compared to existing treatments?",
    category: "Cost & Value",
    difficulty: "Hard",
    estimatedTime: "90 seconds",
    context: "Physician is concerned about insurance coverage and patient affordability",
    themes: ["Cost-effectiveness", "Value proposition", "Insurance coverage"],
    sampleResponse:
      "I understand cost is a critical concern. While the upfront cost is higher, studies show a 40% reduction in hospitalizations, which translates to significant long-term savings. Additionally, our patient assistance program covers 85% of out-of-pocket costs for eligible patients.",
    keyPoints: [
      "Acknowledge the concern directly",
      "Present total cost of care, not just drug cost",
      "Highlight patient assistance programs",
      "Share real-world economic data",
    ],
  },
  {
    id: "q2",
    text: "How do you justify the price when generic alternatives exist?",
    category: "Cost & Value",
    difficulty: "Hard",
    estimatedTime: "90 seconds",
    context: "Physician is comparing to older, cheaper medications",
    themes: ["Value differentiation", "Clinical superiority", "Patient outcomes"],
    sampleResponse:
      "The key difference is efficacy and safety profile. Our therapy shows 60% better response rates with 50% fewer adverse events compared to generics. For patients who don't respond to generics, this represents their best chance at disease control.",
    keyPoints: [
      "Focus on clinical differentiation",
      "Quantify outcome improvements",
      "Discuss patient quality of life",
      "Address treatment failure costs",
    ],
  },
  {
    id: "q3",
    text: "My patients can't afford this. What can you do about it?",
    category: "Cost & Value",
    difficulty: "Medium",
    estimatedTime: "60 seconds",
    context: "Physician serves underserved population with limited resources",
    themes: ["Patient access", "Financial assistance", "Healthcare equity"],
    sampleResponse:
      "Patient access is our top priority. We offer a comprehensive support program including copay cards reducing costs to $0-$10 for insured patients, free medication for uninsured patients earning under 500% of federal poverty level, and a dedicated case manager to navigate insurance approvals.",
    keyPoints: [
      "Show empathy for patient situation",
      "Detail specific assistance programs",
      "Provide contact information for support",
      "Offer to help with individual cases",
    ],
  },

  // Clinical Data & Evidence (4 questions)
  {
    id: "q4",
    text: "Your trial excluded elderly patients. How do I know this works for my population?",
    category: "Clinical Data & Evidence",
    difficulty: "Hard",
    estimatedTime: "90 seconds",
    context: "Physician treats primarily elderly patients not represented in trials",
    themes: ["External validity", "Real-world evidence", "Subgroup analysis"],
    sampleResponse:
      "That's an excellent question. While the pivotal trial had an age cap of 75, our post-marketing surveillance of 5,000 patients includes 2,000 over age 75. The efficacy and safety profile remains consistent, with only a 5% increase in mild adverse events. I can share the real-world evidence publication with you.",
    keyPoints: [
      "Acknowledge trial limitations honestly",
      "Present real-world data if available",
      "Discuss biological plausibility",
      "Offer ongoing monitoring support",
    ],
  },
  {
    id: "q5",
    text: "The study was only 12 weeks. What about long-term safety?",
    category: "Clinical Data & Evidence",
    difficulty: "Medium",
    estimatedTime: "75 seconds",
    context: "Physician concerned about chronic use safety",
    themes: ["Long-term safety", "Extension studies", "Pharmacovigilance"],
    sampleResponse:
      "The 12-week primary endpoint was for regulatory approval, but we have 3-year extension data on 80% of patients showing sustained efficacy with no new safety signals. Additionally, our ongoing registry study tracks 10,000 patients for 5 years, and current 2-year data confirms the favorable safety profile.",
    keyPoints: [
      "Explain trial design rationale",
      "Present extension study data",
      "Discuss post-marketing surveillance",
      "Address specific safety concerns",
    ],
  },
  {
    id: "q6",
    text: "Your competitor's trial had better results. Why should I use yours?",
    category: "Clinical Data & Evidence",
    difficulty: "Hard",
    estimatedTime: "90 seconds",
    context: "Physician comparing head-to-head with competitor",
    themes: ["Comparative effectiveness", "Trial design differences", "Patient selection"],
    sampleResponse:
      "Direct comparison is challenging due to different trial designs and patient populations. Their trial excluded patients with comorbidities, while ours included real-world patients. When you look at similar patient subgroups, efficacy is comparable, but our safety profile shows 30% fewer serious adverse events, which matters for long-term treatment.",
    keyPoints: [
      "Avoid disparaging competitors",
      "Highlight trial design differences",
      "Focus on your product's strengths",
      "Offer to review data together",
    ],
  },
  {
    id: "q7",
    text: "I need to see the actual data, not just your marketing materials.",
    category: "Clinical Data & Evidence",
    difficulty: "Medium",
    estimatedTime: "60 seconds",
    context: "Physician wants primary literature and detailed analysis",
    themes: ["Scientific credibility", "Data transparency", "Evidence-based medicine"],
    sampleResponse:
      "Absolutely, I appreciate your evidence-based approach. I have the full publications from NEJM and Lancet, the FDA medical review, and our detailed clinical study reports. I can also arrange a call with our medical affairs team or the principal investigator if you'd like to discuss specific endpoints or methodology.",
    keyPoints: [
      "Respect the scientific approach",
      "Provide primary literature immediately",
      "Offer medical affairs support",
      "Be transparent about limitations",
    ],
  },

  // Patient Acceptance & Treatment Burden (4 questions)
  {
    id: "q8",
    text: "My patients won't comply with this complex regimen.",
    category: "Patient Acceptance & Treatment Burden",
    difficulty: "Medium",
    estimatedTime: "75 seconds",
    context: "Physician concerned about adherence with complicated dosing",
    themes: ["Adherence", "Patient support", "Regimen simplification"],
    sampleResponse:
      "Adherence is critical for outcomes. We provide free smartphone apps with reminders, pre-filled syringes to simplify administration, and nurse educators who train patients at home. In our real-world study, 85% of patients maintained >80% adherence at 6 months with these support tools.",
    keyPoints: [
      "Acknowledge adherence challenges",
      "Detail support programs available",
      "Share real-world adherence data",
      "Offer to connect patients with resources",
    ],
  },
  {
    id: "q9",
    text: "The side effects will scare my patients away.",
    category: "Patient Acceptance & Treatment Burden",
    difficulty: "Medium",
    estimatedTime: "75 seconds",
    context: "Physician worried about patient tolerance and discontinuation",
    themes: ["Side effect management", "Patient education", "Risk-benefit"],
    sampleResponse:
      "Most side effects are mild and manageable. We provide patients with a detailed guide on what to expect and how to manage symptoms. 90% of side effects resolve within 2 weeks, and only 5% of patients discontinue due to tolerability. Our nurse support line is available 24/7 to address concerns immediately.",
    keyPoints: [
      "Put side effects in context",
      "Emphasize manageability",
      "Provide patient education materials",
      "Highlight support resources",
    ],
  },
  {
    id: "q10",
    text: "This requires too much monitoring. I don't have the resources.",
    category: "Patient Acceptance & Treatment Burden",
    difficulty: "Hard",
    estimatedTime: "90 seconds",
    context: "Physician in resource-limited practice setting",
    themes: ["Practice burden", "Monitoring requirements", "Resource support"],
    sampleResponse:
      "We understand practice constraints. Our monitoring requirements are actually less intensive than standard of care - just baseline and month 3 labs. We also offer free point-of-care testing kits and a nurse coordinator who can help schedule and track monitoring, reducing your staff burden.",
    keyPoints: [
      "Acknowledge practice limitations",
      "Compare to current standard of care",
      "Offer practice support resources",
      "Simplify monitoring when possible",
    ],
  },
  {
    id: "q11",
    text: "Patients complain about injection site reactions. What can I tell them?",
    category: "Patient Acceptance & Treatment Burden",
    difficulty: "Easy",
    estimatedTime: "60 seconds",
    context: "Physician dealing with common tolerability issue",
    themes: ["Side effect management", "Patient counseling", "Expectation setting"],
    sampleResponse:
      "Injection site reactions occur in about 30% of patients but are typically mild and resolve in 24-48 hours. We recommend rotating injection sites, applying ice before injection, and warming the medication to room temperature. These simple techniques reduce reactions by 60%. I can provide patient instruction cards.",
    keyPoints: [
      "Normalize the experience",
      "Provide practical management tips",
      "Quantify expected duration",
      "Offer patient education materials",
    ],
  },

  // Clinical Decision-Making & Time Constraints (3 questions)
  {
    id: "q12",
    text: "I don't have time for this! The treatment decision is complex enough already.",
    category: "Clinical Decision-Making & Time Constraints",
    difficulty: "Hard",
    estimatedTime: "60 seconds",
    context: "Busy physician with limited time for new information",
    themes: ["Time efficiency", "Decision support", "Practical application"],
    sampleResponse:
      "I respect your time. Here's the 30-second version: For patients failing current therapy, our drug offers 50% better response with once-weekly dosing. I'll leave a one-page prescribing guide and my cell number. I can also provide a 5-minute video for your staff to review.",
    keyPoints: [
      "Be concise and respectful",
      "Lead with most important information",
      "Provide quick reference materials",
      "Offer flexible follow-up options",
    ],
  },
  {
    id: "q13",
    text: "I need a simple algorithm. When exactly should I use this?",
    category: "Clinical Decision-Making & Time Constraints",
    difficulty: "Medium",
    estimatedTime: "75 seconds",
    context: "Physician wants clear treatment positioning",
    themes: ["Treatment algorithm", "Patient selection", "Clinical positioning"],
    sampleResponse:
      "Clear positioning: Use for patients who've failed or can't tolerate first-line therapy, have moderate to severe disease, and no contraindications. I have a one-page treatment algorithm developed with key opinion leaders that shows exactly where this fits in your current workflow.",
    keyPoints: [
      "Provide clear patient selection criteria",
      "Show treatment sequence positioning",
      "Offer visual decision aids",
      "Align with current guidelines",
    ],
  },
  {
    id: "q14",
    text: "How is this different from what I'm already using?",
    category: "Clinical Decision-Making & Time Constraints",
    difficulty: "Medium",
    estimatedTime: "60 seconds",
    context: "Physician needs quick differentiation",
    themes: ["Product differentiation", "Comparative positioning", "Value proposition"],
    sampleResponse:
      "Three key differences: First, 40% faster onset of action - patients see results in 2 weeks vs 6 weeks. Second, once-weekly dosing vs daily. Third, no drug interactions with common medications. It's ideal for patients needing rapid improvement or taking multiple medications.",
    keyPoints: [
      "Highlight 2-3 key differentiators",
      "Use concrete comparisons",
      "Connect to patient types",
      "Keep it memorable and actionable",
    ],
  },

  // Data Validity & Study Design (2 questions)
  {
    id: "q15",
    text: "Your study design has serious flaws. How can I trust these results?",
    category: "Data Validity & Study Design",
    difficulty: "Hard",
    estimatedTime: "90 seconds",
    context: "Physician with methodological concerns about trial design",
    themes: ["Study methodology", "Scientific rigor", "Data integrity"],
    sampleResponse:
      "I appreciate your critical evaluation. You're right that the open-label design is a limitation. However, the primary endpoint was objective tumor response confirmed by independent radiology review, minimizing bias. The FDA required additional randomized data, which confirmed the findings. I can share the methodological discussion from the publication.",
    keyPoints: [
      "Acknowledge limitations honestly",
      "Explain design rationale",
      "Highlight objective endpoints",
      "Offer detailed methodology review",
    ],
  },
  {
    id: "q16",
    text: "The placebo response rate seems suspiciously low.",
    category: "Data Validity & Study Design",
    difficulty: "Hard",
    estimatedTime: "90 seconds",
    context: "Physician questioning data validity",
    themes: ["Data integrity", "Study conduct", "Comparative context"],
    sampleResponse:
      "That's a thoughtful observation. The placebo rate of 8% is actually consistent with other trials in this disease state using the same endpoint. The trial was conducted at 50 sites across 12 countries with independent monitoring and FDA inspection. All data is publicly available in the clinical study report.",
    keyPoints: [
      "Take concern seriously",
      "Provide comparative context",
      "Emphasize data integrity measures",
      "Offer transparency and access to data",
    ],
  },

  // Treatment Practicality (3 questions)
  {
    id: "q17",
    text: "My infusion center can't handle another complex protocol.",
    category: "Treatment Practicality",
    difficulty: "Medium",
    estimatedTime: "75 seconds",
    context: "Physician concerned about operational feasibility",
    themes: ["Practice integration", "Operational support", "Workflow"],
    sampleResponse:
      "We've designed this to minimize practice burden. It's a standard 30-minute infusion with no premedication or special monitoring. We provide free staff training, infusion center setup support, and reimbursement specialists to handle billing. Over 500 community practices have successfully integrated it.",
    keyPoints: [
      "Emphasize simplicity",
      "Offer operational support",
      "Share implementation success stories",
      "Provide practice resources",
    ],
  },
  {
    id: "q18",
    text: "What if my patient has a reaction during infusion?",
    category: "Treatment Practicality",
    difficulty: "Medium",
    estimatedTime: "75 seconds",
    context: "Physician concerned about safety management",
    themes: ["Safety management", "Adverse event handling", "Clinical support"],
    sampleResponse:
      "Infusion reactions occur in less than 5% of patients and are typically mild. We provide a detailed reaction management protocol and 24/7 medical affairs support. Most reactions resolve with slowing the infusion rate. Severe reactions are rare (0.1%) and managed with standard protocols your team already knows.",
    keyPoints: [
      "Quantify risk accurately",
      "Provide management protocols",
      "Offer real-time support",
      "Build confidence in safety",
    ],
  },
  {
    id: "q19",
    text: "Insurance won't cover this without prior authorization. That takes weeks!",
    category: "Treatment Practicality",
    difficulty: "Hard",
    estimatedTime: "90 seconds",
    context: "Physician frustrated with access barriers",
    themes: ["Insurance coverage", "Prior authorization", "Access support"],
    sampleResponse:
      "We have a dedicated reimbursement team that handles prior authorizations for you - average approval time is 3 days. For urgent cases, we can get same-day approvals. We also offer free drug while authorization is pending for eligible patients. Our approval rate is 95% on first submission.",
    keyPoints: [
      "Acknowledge the frustration",
      "Offer concrete support services",
      "Provide realistic timelines",
      "Share success metrics",
    ],
  },

  // Skepticism & Pushback (1 question)
  {
    id: "q20",
    text: "I've heard this all before from drug reps. Why should I believe you?",
    category: "Skepticism & Pushback",
    difficulty: "Hard",
    estimatedTime: "90 seconds",
    context: "Physician skeptical of pharmaceutical industry claims",
    themes: ["Credibility", "Trust building", "Scientific integrity"],
    sampleResponse:
      "I understand your skepticism - it's warranted. I'm not here to sell you anything. I'm a PhD scientist, and my role is to provide accurate scientific information. Everything I share is from peer-reviewed publications or FDA documents. If you prefer, I can connect you directly with investigators who ran the trials or physicians using it in practice.",
    keyPoints: [
      "Validate their skepticism",
      "Establish scientific credibility",
      "Offer third-party validation",
      "Focus on education, not sales",
    ],
  },
]

export const DUMMY_PERSONAS = [
  {
    id: "persona1",
    name: "Dr. Sarah Chen",
    title: "Academic Oncologist",
    specialty: "Oncology",
    practiceType: "Academic Medical Center",
    yearsExperience: 15,
    avatar: "/professional-avatar.png",
    background:
      "Triple board-certified in medical oncology, hematology, and internal medicine. Leads a busy academic practice seeing 50+ patients weekly while conducting clinical trials. Published over 100 peer-reviewed papers.",
    priorities: [
      "Evidence-based medicine with rigorous data",
      "Clinical trial opportunities for patients",
      "Cost-effectiveness and value-based care",
      "Teaching residents and fellows",
    ],
    challenges: [
      "Limited time - 15 minutes per patient visit",
      "Pressure to enroll patients in trials",
      "Insurance authorization delays",
      "Keeping up with rapidly evolving treatment landscape",
    ],
    communicationStyle:
      "Direct, data-driven, appreciates scientific rigor. Asks probing questions about methodology. Values efficiency and respects her time.",
    decisionFactors: [
      "Level 1 evidence (randomized controlled trials)",
      "Guideline recommendations",
      "Safety profile in vulnerable populations",
      "Institutional formulary status",
    ],
    typicalQuestions: [
      "What's the NNT (number needed to treat)?",
      "How does this compare to current standard of care?",
      "What are the long-term safety data?",
      "Is this on our formulary?",
    ],
    engagementTips: [
      "Lead with data and evidence",
      "Be prepared for methodological questions",
      "Respect time constraints",
      "Offer to connect with medical affairs or investigators",
      "Provide peer-reviewed publications",
    ],
  },
  {
    id: "persona2",
    name: "Dr. Michael Torres",
    title: "Community Cardiologist",
    specialty: "Cardiology",
    practiceType: "Private Practice",
    yearsExperience: 22,
    avatar: "/professional-avatar.png",
    background:
      "Runs a successful 4-physician cardiology practice in suburban setting. Sees 30-40 patients daily. Focuses on preventive cardiology and chronic disease management. Active in local medical society.",
    priorities: [
      "Patient safety and minimizing risk",
      "Workflow efficiency and practice management",
      "Clear reimbursement and prior authorization process",
      "Long-term patient relationships",
    ],
    challenges: [
      "Managing complex patients with multiple comorbidities",
      "Insurance company restrictions and formularies",
      "Staff training on new medications",
      "Balancing quality care with practice profitability",
    ],
    communicationStyle:
      "Practical, risk-averse, values real-world applicability. Wants to know how it fits into current practice. Concerned about operational impact.",
    decisionFactors: [
      "Safety profile and contraindications",
      "Insurance coverage and patient out-of-pocket costs",
      "Ease of use and monitoring requirements",
      "Practice support and resources available",
    ],
    typicalQuestions: [
      "How does this work with my current patients?",
      "What's the prior authorization process like?",
      "What monitoring do I need to do?",
      "What support do you provide for my staff?",
    ],
    engagementTips: [
      "Focus on practical application",
      "Emphasize safety and tolerability",
      "Provide clear patient selection criteria",
      "Offer practice support resources",
      "Share real-world evidence and case studies",
    ],
  },
  {
    id: "persona3",
    name: "Dr. Jennifer Williams",
    title: "Community Neurologist",
    specialty: "Neurology",
    practiceType: "Hospital-Employed",
    yearsExperience: 8,
    avatar: "/professional-avatar.png",
    background:
      "Hospital-employed neurologist in underserved community. Treats diverse patient population with limited resources. Passionate about health equity and patient advocacy. Balances clinical care with administrative duties.",
    priorities: [
      "Patient access and affordability",
      "Health equity and reducing disparities",
      "Patient and caregiver support",
      "Evidence-based but practical solutions",
    ],
    challenges: [
      "Patients with limited insurance or no insurance",
      "Language and cultural barriers",
      "Limited specialist support and resources",
      "High patient volume with complex needs",
    ],
    communicationStyle:
      "Empathetic, patient-centered, skeptical of high-cost therapies. Wants to understand real-world applicability for her diverse patient population.",
    decisionFactors: [
      "Patient affordability and access programs",
      "Real-world effectiveness in diverse populations",
      "Patient and caregiver burden",
      "Support resources for underserved patients",
    ],
    typicalQuestions: [
      "Can my patients actually afford this?",
      "What if they don't have insurance?",
      "How do I help non-English speaking patients?",
      "What support is available for caregivers?",
    ],
    engagementTips: [
      "Lead with patient assistance programs",
      "Emphasize health equity commitment",
      "Provide multilingual patient materials",
      "Offer case-by-case support",
      "Share success stories from similar communities",
    ],
  },
]

export const DUMMY_SESSIONS = [
  {
    id: "session1",
    userId: "user1",
    questionId: "q1",
    personaId: "persona1",
    status: "completed",
    confidenceRating: 4,
    qualityRating: 4,
    notes: "Good explanation of value proposition, could improve on specific cost data",
    duration: 95,
    videoUrl: "/professional-medical-science-liaison-practicing-pr.jpg",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    analysis: {
      overallScore: 82,
      strengths: [
        "Clear and confident delivery",
        "Good use of data to support claims",
        "Acknowledged physician's concern directly",
      ],
      improvements: [
        "Could provide more specific cost-effectiveness data",
        "Mention patient assistance programs earlier",
        "Practice smoother transitions between points",
      ],
      metrics: {
        clarity: 85,
        confidence: 80,
        dataUsage: 78,
        empathy: 85,
        structure: 82,
      },
    },
  },
  {
    id: "session2",
    userId: "user1",
    questionId: "q8",
    personaId: "persona2",
    status: "completed",
    confidenceRating: 5,
    qualityRating: 5,
    notes: "Excellent session - felt very natural and covered all key points",
    duration: 78,
    videoUrl: "/confident-medical-professional-presenting-to-docto.jpg",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    analysis: {
      overallScore: 92,
      strengths: [
        "Excellent empathy and understanding of patient challenges",
        "Comprehensive coverage of support programs",
        "Strong use of real-world adherence data",
        "Natural and conversational tone",
      ],
      improvements: ["Could be slightly more concise", "Consider leading with the most impactful support program"],
      metrics: {
        clarity: 90,
        confidence: 95,
        dataUsage: 88,
        empathy: 95,
        structure: 92,
      },
    },
  },
  {
    id: "session3",
    userId: "user1",
    questionId: "q12",
    personaId: "persona3",
    status: "completed",
    confidenceRating: 3,
    qualityRating: 4,
    notes: "Need to work on being more concise - took too long to get to the point",
    duration: 105,
    videoUrl: "/medical-science-liaison-video-recording-session.jpg",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    analysis: {
      overallScore: 75,
      strengths: [
        "Respected physician's time constraints",
        "Provided clear next steps",
        "Good offer of alternative formats",
      ],
      improvements: [
        "Response was too long for a time-pressed physician",
        "Lead with the 30-second version immediately",
        "Practice more concise delivery",
        "Reduce filler words",
      ],
      metrics: {
        clarity: 72,
        confidence: 70,
        dataUsage: 75,
        empathy: 80,
        structure: 78,
      },
    },
  },
  {
    id: "session4",
    userId: "user1",
    questionId: "q4",
    personaId: "persona1",
    status: "completed",
    confidenceRating: 4,
    qualityRating: 4,
    notes: "Good handling of difficult question about trial limitations",
    duration: 88,
    videoUrl: "/professional-medical-presentation-recording.jpg",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    analysis: {
      overallScore: 85,
      strengths: [
        "Honest acknowledgment of trial limitations",
        "Strong use of real-world evidence",
        "Offered additional resources",
        "Maintained scientific credibility",
      ],
      improvements: ["Could quantify the safety difference more clearly", "Practice smoother delivery of complex data"],
      metrics: {
        clarity: 82,
        confidence: 85,
        dataUsage: 90,
        empathy: 80,
        structure: 88,
      },
    },
  },
  {
    id: "session5",
    userId: "user1",
    questionId: "q20",
    personaId: "persona2",
    status: "completed",
    confidenceRating: 5,
    qualityRating: 5,
    notes: "Handled skepticism really well - felt authentic",
    duration: 82,
    videoUrl: "/medical-science-liaison-confident-presentation.jpg",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    analysis: {
      overallScore: 94,
      strengths: [
        "Excellent validation of physician's skepticism",
        "Strong establishment of scientific credibility",
        "Authentic and genuine tone",
        "Great offer of third-party validation",
        "Positioned as educator, not salesperson",
      ],
      improvements: ["Minor: Could mention specific publications by name"],
      metrics: {
        clarity: 92,
        confidence: 95,
        dataUsage: 90,
        empathy: 98,
        structure: 95,
      },
    },
  },
]

export const getCategoryStats = (sessions: any[]) => {
  const categories = [
    "Cost & Value",
    "Clinical Data & Evidence",
    "Patient Acceptance & Treatment Burden",
    "Clinical Decision-Making & Time Constraints",
    "Data Validity & Study Design",
    "Treatment Practicality",
    "Skepticism & Pushback",
  ]

  return categories.map((category) => {
    const categoryQuestions = DUMMY_QUESTIONS.filter((q) => q.category === category)
    const categorySessions = sessions.filter((s) => {
      const question = DUMMY_QUESTIONS.find((q) => q.id === s.questionId)
      return question?.category === category
    })

    const avgConfidence =
      categorySessions.length > 0
        ? categorySessions.reduce((sum, s) => sum + (s.confidenceRating || 0), 0) / categorySessions.length
        : 0

    return {
      category,
      sessionsCompleted: categorySessions.length,
      totalQuestions: categoryQuestions.length,
      avgConfidence: Number(avgConfidence.toFixed(1)),
      progress: (categorySessions.length / categoryQuestions.length) * 100,
    }
  })
}

export const getStreakData = (sessions: any[]) => {
  if (sessions.length === 0) return { currentStreak: 0, longestStreak: 0, lastPracticeDate: null }

  const sortedSessions = [...sessions]
    .filter((s) => s.completedAt)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

  const dates = sortedSessions.map((s) => {
    const date = new Date(s.completedAt)
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  })

  const uniqueDates = [...new Set(dates)].sort((a, b) => b - a)

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 1

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTime = today.getTime()
  const oneDayMs = 24 * 60 * 60 * 1000

  // Calculate current streak
  if (uniqueDates.length > 0) {
    const mostRecentDate = uniqueDates[0]
    const daysSinceLastPractice = Math.floor((todayTime - mostRecentDate) / oneDayMs)

    if (daysSinceLastPractice <= 1) {
      currentStreak = 1
      for (let i = 1; i < uniqueDates.length; i++) {
        const dayDiff = Math.floor((uniqueDates[i - 1] - uniqueDates[i]) / oneDayMs)
        if (dayDiff === 1) {
          currentStreak++
        } else {
          break
        }
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < uniqueDates.length; i++) {
    const dayDiff = Math.floor((uniqueDates[i - 1] - uniqueDates[i]) / oneDayMs)
    if (dayDiff === 1) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 1
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak)

  return {
    currentStreak,
    longestStreak,
    lastPracticeDate: uniqueDates.length > 0 ? new Date(uniqueDates[0]) : null,
  }
}
