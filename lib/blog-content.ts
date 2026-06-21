export type BlogArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readingTime: string;
  updatedAt: string;
  intro: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
  caution: string;
  faqs: Array<{ question: string; answer: string }>;
  sources: Array<{ label: string; href: string }>;
};

export const blogArticles: BlogArticle[] = [
  {
    slug: "pregnancy-week-by-week",
    title: "Pregnancy week by week: a practical guide to the changing months",
    description: "A calm, evidence-led way to follow pregnancy milestones, appointments and questions for your maternity team.",
    category: "Pregnancy guide",
    readingTime: "6 min read",
    updatedAt: "21 June 2026",
    intro:
      "A week-by-week tracker is most useful when it helps you notice patterns, prepare questions and make room for rest. It cannot predict exactly how any one pregnancy will feel or develop.",
    sections: [
      {
        heading: "Use weeks as a planning rhythm, not a scorecard",
        paragraphs: [
          "Pregnancy dating is usually based on the first day of the last menstrual period and may be adjusted after an ultrasound scan. Due dates are estimates, so being a few days or weeks either side of a milestone is common.",
          "Your midwife or obstetric team will tailor appointments and screening to your health, history and local service. Keep a short list of symptoms, medications and questions between visits so the appointment is about what matters to you."
        ],
        bullets: [
          "First trimester: arrange antenatal care early, discuss supplements and ask about screening options.",
          "Second trimester: many people begin to notice movement; ask how your maternity unit wants you to respond to changes later in pregnancy.",
          "Third trimester: discuss birth preferences, feeding support, travel plans and how to contact the maternity unit day or night."
        ]
      },
      {
        heading: "Track what is useful",
        paragraphs: [
          "A simple record can be more useful than trying to log every sensation. Note sleep, mood, persistent symptoms, blood pressure readings only if your clinician has asked you to monitor them, and questions for your next appointment.",
          "Movement does not follow one universal daily number. From the point you are familiar with your baby's usual pattern, a noticeable reduction or change is a reason to contact your maternity unit promptly rather than waiting for the next day."
        ],
        bullets: [
          "Save the phone number for your maternity triage or assessment unit.",
          "Bring your current medicines and supplements list to appointments.",
          "Use a partner check-in to agree practical support for the week ahead."
        ]
      },
      {
        heading: "Keep the information local",
        paragraphs: [
          "Screening, vaccination and appointment schedules vary by country and sometimes by individual risk. Use a reputable national health service source for your location, then confirm anything personal with your own care team.",
          "An app can help you prepare, but it should never delay care. If something feels wrong, contacting a professional is the right next step."
        ]
      }
    ],
    caution:
      "Seek urgent maternity advice for vaginal bleeding, severe or persistent abdominal pain, severe headache or visual changes, fever, fluid leaking from the vagina, chest pain, trouble breathing, or reduced or changed fetal movement once you know your baby's usual pattern.",
    faqs: [
      { question: "Is my due date exact?", answer: "No. It is an estimate used to guide care and planning. Your maternity team can explain how yours was calculated." },
      { question: "When should I call about movements?", answer: "Call your maternity unit promptly if movements are reduced or have changed from your baby's usual pattern. Do not wait until the following day." }
    ],
    sources: [
      { label: "NHS: Pregnancy week by week", href: "https://www.nhs.uk/pregnancy/week-by-week/" },
      { label: "NHS: Your antenatal appointments", href: "https://www.nhs.uk/pregnancy/your-pregnancy-care/your-antenatal-appointments/" },
      { label: "NHS: Your baby's movements", href: "https://www.nhs.uk/pregnancy/keeping-well/your-babys-movements/" }
    ]
  },
  {
    slug: "foods-to-avoid-in-pregnancy",
    title: "Foods to avoid in pregnancy: a practical UK safety guide",
    description: "Make safer food choices without fear, using the NHS approach to food hygiene, alcohol and higher-risk foods.",
    category: "Food",
    readingTime: "7 min read",
    updatedAt: "21 June 2026",
    intro:
      "Most everyday foods are compatible with pregnancy. The aim is not perfection: it is lowering avoidable infection and contaminant risks while keeping meals varied, nourishing and manageable.",
    sections: [
      {
        heading: "The highest-value changes",
        paragraphs: [
          "In the UK, NHS guidance advises avoiding alcohol in pregnancy because there is no known safe amount. It also highlights foods that can carry a higher risk of listeria, toxoplasmosis or other food-borne illness, plus foods high in vitamin A.",
          "Food guidance changes between countries, especially for eggs, cheese and fish. This article follows UK NHS guidance; use your local public-health advice if you live elsewhere."
        ],
        bullets: [
          "Avoid liver and liver products, which can contain high levels of vitamin A.",
          "Avoid unpasteurised milk and mould-ripened soft cheeses unless they are thoroughly cooked until steaming hot.",
          "Avoid raw or undercooked meat and raw shellfish; wash fruit, vegetables and salad carefully.",
          "Avoid shark, swordfish and marlin; follow current guidance on oily fish and tuna limits."
        ]
      },
      {
        heading: "Make food hygiene the default",
        paragraphs: [
          "Separate raw meat from ready-to-eat food, wash hands and utensils, cook food thoroughly and refrigerate leftovers promptly. These small habits prevent more problems than a long list of restrictive rules.",
          "Check labels for pasteurisation and cooking instructions. If you are unsure about a restaurant dish, ask whether it contains raw egg, raw shellfish, unpasteurised dairy or undercooked meat."
        ],
        bullets: [
          "Reheat leftovers until piping hot and avoid food that has been left at room temperature for long periods.",
          "Use a clean chopping board for ready-to-eat foods after preparing raw meat.",
          "Discuss supplements with your midwife or pharmacist; do not take vitamin A supplements in pregnancy."
        ]
      },
      {
        heading: "Build meals around what you can manage",
        paragraphs: [
          "Nausea, food aversions and fatigue can make idealised meal plans unrealistic. Small, regular meals and easy sources of protein, fibre and fluids can be a kinder starting point. If you cannot keep fluids down, are losing weight, or have persistent vomiting, contact your maternity team.",
          "A prenatal supplement may be recommended, but it does not replace food. Your clinician can advise on folic acid, vitamin D, iron or other needs based on your diet and health."
        ]
      }
    ],
    caution:
      "Contact a healthcare professional urgently if you cannot keep fluids down, have signs of dehydration, or are worried about severe vomiting. Ask your midwife or pharmacist before starting supplements or herbal products.",
    faqs: [
      { question: "Can I eat eggs in pregnancy?", answer: "Guidance depends on the country and production standard. In the UK, hen eggs with the British Lion mark can be eaten runny; check current local guidance elsewhere." },
      { question: "Do I need to eat perfectly?", answer: "No. Aim for safer handling and a varied pattern over time. Ask for individual support if nausea, allergies, diabetes or dietary restrictions make eating difficult." }
    ],
    sources: [
      { label: "NHS: Foods to avoid in pregnancy", href: "https://www.nhs.uk/pregnancy/keeping-well/foods-to-avoid/" },
      { label: "NHS: Healthy eating in pregnancy", href: "https://www.nhs.uk/pregnancy/keeping-well/have-a-healthy-diet/" },
      { label: "Food Standards Agency: Pregnancy food safety", href: "https://www.food.gov.uk/safety-hygiene/food-safety-for-pregnant-women" }
    ]
  },
  {
    slug: "hospital-bag-checklist",
    title: "Hospital bag checklist: pack for comfort, not perfection",
    description: "A sensible hospital-bag checklist for the birthing parent, baby and support person, with room for local guidance.",
    category: "Planning",
    readingTime: "5 min read",
    updatedAt: "21 June 2026",
    intro:
      "A hospital bag is a comfort kit, not a test of preparedness. Your maternity unit may provide some items and ask you to bring others, so start with their guidance and pack in small, easy-to-find groups.",
    sections: [
      {
        heading: "Start with the essentials",
        paragraphs: [
          "Keep documents, contact numbers and any medicines you have been told to bring together in one pouch. A charger with a long cable, drinks bottle, snacks your unit permits, comfortable clothes and toiletries are common practical choices.",
          "Pack early enough that you can revise the bag without pressure. A partner or support person should know where it is and what is inside."
        ],
        bullets: [
          "Maternity notes, birth preferences and a list of regular medicines.",
          "Phone, charger, glasses or contact-lens supplies, and a small amount of money or parking information.",
          "Comfortable clothes, underwear, maternity pads and toiletries.",
          "Water bottle and permitted snacks for the birthing parent and support person."
        ]
      },
      {
        heading: "For baby and the journey home",
        paragraphs: [
          "Many parents pack a few newborn-size and 0-3 month outfits because babies vary in size. Include nappies and cotton wool or wipes if your unit asks you to bring them. A correctly fitted, suitable car seat is essential for a car journey home.",
          "Avoid buying a large number of special products before you know what you will use. Your midwife can advise on feeding and skin-care needs."
        ],
        bullets: [
          "Two or three simple outfits, hats only for outdoor travel, and blankets appropriate for the weather.",
          "Nappies and changing supplies according to local unit guidance.",
          "A car seat installed and checked before the due date if travelling by car."
        ]
      },
      {
        heading: "Make a handover plan",
        paragraphs: [
          "The most useful preparation is often the unglamorous kind: transport, childcare, pet care, a contact list and a plan for food after birth. Put these in a shared note rather than relying on memory during labour.",
          "Hospital policies can change, including visiting, food and what your support person can bring. Check close to your due date."
        ]
      }
    ],
    caution:
      "Follow your own maternity unit's instructions first. Contact the unit before travelling if you think labour has started, your waters break, you have bleeding, or you are worried about movements or your health.",
    faqs: [
      { question: "When should I pack my hospital bag?", answer: "There is no fixed deadline. Many people begin in the third trimester so it can be adjusted calmly before birth." },
      { question: "Will the hospital provide nappies and pads?", answer: "It varies. Check your maternity unit's current list rather than relying on a generic checklist." }
    ],
    sources: [
      { label: "NHS: Packing your bag for labour", href: "https://www.nhs.uk/pregnancy/labour-and-birth/preparing-for-the-birth/packing-your-bag-for-labour/" },
      { label: "NHS: When to go to hospital or a midwifery unit", href: "https://www.nhs.uk/pregnancy/labour-and-birth/what-happens/when-to-go-to-hospital-or-midwifery-unit/" }
    ]
  },
  {
    slug: "fathers-pregnancy-guide",
    title: "A practical pregnancy guide for fathers and partners",
    description: "Useful, consent-led ways to share the mental load, prepare for appointments and support the birthing parent.",
    category: "Partners",
    readingTime: "6 min read",
    updatedAt: "21 June 2026",
    intro:
      "Good support is less about finding the perfect sentence and more about being reliably useful. Ask what help is wanted, respect changing preferences and make practical tasks visible.",
    sections: [
      {
        heading: "Share the invisible work",
        paragraphs: [
          "Pregnancy often creates a stream of decisions, appointments and household tasks. A shared list can reduce the need for one person to remember everything and ask repeatedly for help.",
          "Offer concrete options: take on dinner, arrange transport, handle a call, collect a prescription, or protect rest time. Then accept the answer if the birthing parent would rather do something differently."
        ],
        bullets: [
          "Keep a shared appointment and preparation list.",
          "Ask before touching the bump, sharing news or posting photos.",
          "Learn the maternity-unit contact number and where the notes are kept.",
          "Plan practical support for the first two weeks after birth."
        ]
      },
      {
        heading: "Use appointments well",
        paragraphs: [
          "If invited and able to attend, ask whether there are questions your partner wants help remembering. Take notes only with consent, and leave room for private conversations with the clinician when needed.",
          "A support person should not speak over the pregnant person. Their useful role is to listen, help clarify information and support the decisions being made."
        ]
      },
      {
        heading: "Protect both people's wellbeing",
        paragraphs: [
          "Anxiety, low mood and adjustment can affect partners too. Talk early about sleep, finances, leave, visitors and what support would feel helpful. If either person is struggling, ask a GP, midwife or health visitor where to get support.",
          "After birth, small reliable actions matter: bring food and water, make space for recovery, take over practical jobs and encourage help-seeking when something is not right."
        ]
      }
    ],
    caution:
      "If the birthing parent has urgent symptoms, contact the maternity team rather than trying to troubleshoot at home. If anyone is at immediate risk of harm, contact emergency services.",
    faqs: [
      { question: "Can partners attend every appointment?", answer: "Policies and individual preferences vary. Ask the maternity unit and the pregnant person rather than assuming." },
      { question: "What is the most useful question to ask?", answer: "Try: 'What would make today easier?' Specific, practical help is often more useful than general offers." }
    ],
    sources: [
      { label: "NHS: Your mental health in pregnancy", href: "https://www.nhs.uk/pregnancy/keeping-well/mental-health/" },
      { label: "NHS: Mental health after the birth", href: "https://www.nhs.uk/pregnancy/labour-and-birth/after-the-birth/your-mental-health-after-the-birth/" },
      { label: "NHS: Your antenatal appointments", href: "https://www.nhs.uk/pregnancy/your-pregnancy-care/your-antenatal-appointments/" }
    ]
  },
  {
    slug: "baby-milestones",
    title: "Baby milestones from birth to 24 months: notice, record, ask",
    description: "A gentle, evidence-led way to use developmental milestones without turning them into a race.",
    category: "Baby",
    readingTime: "6 min read",
    updatedAt: "21 June 2026",
    intro:
      "Milestones describe skills many children develop around a particular age. They are useful prompts for noticing development and starting conversations, not a pass-or-fail test of a child or parent.",
    sections: [
      {
        heading: "Look for progress across everyday life",
        paragraphs: [
          "Development includes movement, communication, play, learning and social connection. Recording a short observation, such as a new sound, a favourite game or how your baby reaches for an object, is often more meaningful than ticking a single box.",
          "Children develop at different rates. For babies born prematurely, professionals may use corrected age for developmental discussion. Your health visitor, GP or paediatric team can explain what this means for your child."
        ],
        bullets: [
          "Capture ordinary moments as well as firsts.",
          "Note skills that are emerging, not only those that feel complete.",
          "Bring a short list of observations to health visits if you have questions."
        ]
      },
      {
        heading: "When to start a conversation",
        paragraphs: [
          "Trust the people who know your child best. If you notice a loss of skills, have a persistent concern about hearing, vision, movement, feeding or interaction, or simply feel something is different, contact your health visitor or GP.",
          "Early support is about understanding your child, not applying a label. Assessment and advice are individual, and asking does not mean you have done anything wrong."
        ]
      },
      {
        heading: "Use the record as a memory, too",
        paragraphs: [
          "Milestone notes can become a warm family archive: first smiles, ways your child communicates, favourite songs, funny habits and the people who were there. Keep private information protected and share only with consent.",
          "For structured age-based checklists, use a public-health source rather than social media comparison posts."
        ]
      }
    ],
    caution:
      "Contact a health visitor, GP or paediatric clinician if your child loses a skill, if you have a developmental concern, or if something about feeding, breathing, alertness or wellbeing feels urgent.",
    faqs: [
      { question: "Are milestone ages exact?", answer: "No. They are approximate ranges and should be interpreted in context, including prematurity and individual development." },
      { question: "What if my child is not doing what another child can do?", answer: "Comparison is rarely helpful. Discuss a specific concern with your health visitor or GP, who can consider the full picture." }
    ],
    sources: [
      { label: "NHS: Your baby's development", href: "https://www.nhs.uk/conditions/baby/development/" },
      { label: "CDC: Developmental milestones", href: "https://www.cdc.gov/act-early/milestones/index.html" },
      { label: "NHS: Health visitor checks", href: "https://www.nhs.uk/conditions/baby/health-visitor-checks/" }
    ]
  },
  {
    slug: "postpartum-recovery-guide",
    title: "Postpartum recovery: gentle support for the weeks after birth",
    description: "Practical recovery prompts, clear red flags and a reminder that physical and emotional healing both deserve care.",
    category: "Wellbeing",
    readingTime: "7 min read",
    updatedAt: "21 June 2026",
    intro:
      "Recovery after birth is not a deadline. Bodies, births, feeding experiences and support networks differ. A useful plan makes space for rest, food, pain relief advice, follow-up care and honest conversations about mood.",
    sections: [
      {
        heading: "Make the first days smaller",
        paragraphs: [
          "In the early weeks, lower the bar for non-essential tasks. Recovery support can be very practical: regular meals, water within reach, help with laundry, protected rest and someone who can listen without trying to fix everything.",
          "If you had a tear, caesarean birth, significant bleeding or a complicated birth, follow the advice from your own team about wound care, activity and medication."
        ],
        bullets: [
          "Keep discharge information and contact numbers accessible.",
          "Accept or arrange practical help before visitors arrive.",
          "Write down questions about pain, bleeding, feeding, sleep or mood for your postnatal check."
        ]
      },
      {
        heading: "Your emotional wellbeing matters",
        paragraphs: [
          "Tearfulness and mood changes can happen after birth, but persistent low mood, severe anxiety, frightening thoughts or feeling unable to cope deserve support. Tell a midwife, health visitor or GP what is happening; you do not need to wait for a routine appointment.",
          "Partners and family members can help by taking concerns seriously, reducing practical load and helping arrange care."
        ]
      },
      {
        heading: "Know when to seek urgent help",
        paragraphs: [
          "Some postnatal symptoms need urgent assessment. Heavy bleeding, chest pain, breathing difficulty, fever, severe headache, worsening abdominal pain, a painful swollen leg or a wound that is increasingly painful or leaking should not be managed through an app or ordinary online advice.",
          "If there is an immediate danger to you or someone else, call emergency services."
        ]
      }
    ],
    caution:
      "Seek urgent medical help for heavy bleeding, chest pain, shortness of breath, seizures, severe headache or visual changes, fever with feeling unwell, a painful swollen leg, or thoughts of harming yourself or someone else.",
    faqs: [
      { question: "How long does postpartum recovery take?", answer: "There is no single timetable. Your recovery depends on your birth, health and support. Ask your own clinician about activity, pain and follow-up." },
      { question: "Is it okay to ask for help with my mood?", answer: "Yes. Postnatal mental health support is healthcare, not a failure. Tell a midwife, health visitor or GP as early as you can." }
    ],
    sources: [
      { label: "NHS: Your body after the birth", href: "https://www.nhs.uk/pregnancy/labour-and-birth/after-the-birth/your-body-after-the-birth/" },
      { label: "NHS: Your mental health after the birth", href: "https://www.nhs.uk/pregnancy/labour-and-birth/after-the-birth/your-mental-health-after-the-birth/" },
      { label: "NHS: Postnatal care", href: "https://www.nhs.uk/pregnancy/labour-and-birth/after-the-birth/postnatal-care/" }
    ]
  }
];
