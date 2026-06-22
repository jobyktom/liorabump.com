export type PregnancyWeekGuide = {
  week: number;
  title: string;
  summary: string;
  baby: string;
  body: string;
  care: string;
  partner: string;
  checklist: string[];
  questions: string[];
  warning: string;
};

const urgentAdvice = "Call your maternity unit, GP, NHS 111 or emergency services as appropriate if you have bleeding, severe or persistent pain, fluid leaking, fever, chest pain, breathing difficulty, severe headache or visual changes, or anything that feels wrong. Once you know your baby's usual movement pattern, call promptly for reduced or changed movements; do not wait until the next day.";

const highlights: Array<[string, string, string, string]> = [
  ["How pregnancy weeks are counted", "Week 1 is counted from the first day of your last period, before conception has happened.", "You may be having a period or preparing to try for a baby.", "Start folic acid before pregnancy if possible and book a GP or preconception discussion for medicines or long-term conditions."],
  ["Preparing for conception", "Ovulation often happens around this time in a typical cycle, but timing varies.", "Cycle tracking can be useful, but it cannot guarantee conception.", "Avoid alcohol and smoking when trying to conceive, and ask about any regular medicines."],
  ["Early cell development", "After fertilisation, early cells divide as they travel towards the uterus.", "Most people do not notice a reliable physical change this early.", "Use a pregnancy test only when it is due; seek advice if you have pain or bleeding and could be pregnant."],
  ["A missed period may be the first clue", "Implantation may be happening and early pregnancy hormones begin to rise.", "A missed period, tender breasts or tiredness can happen, but symptoms differ widely.", "Contact a GP or midwife service after a positive test to begin antenatal care."],
  ["Early foundations", "The early embryo is developing rapidly, including the beginnings of the nervous system.", "Tiredness, nausea, breast tenderness and frequent urination are common but not universal.", "Continue folic acid and arrange your booking appointment as early as your local service advises."],
  ["Early circulation", "Early heart activity may sometimes be seen on an ultrasound, though scan timing and findings vary.", "Nausea and food aversions can feel intense; small meals and fluids may help.", "Ask for help if vomiting makes it hard to keep fluids down or function day to day."],
  ["Developing limbs and features", "The early structures that become limbs and facial features are developing.", "Hormonal changes can affect mood, sleep and digestion.", "Write down medicines, supplements and health history to discuss at booking."],
  ["A changing first trimester", "Development continues quickly, but external changes may not be obvious yet.", "Bloating, constipation, tiredness or nausea can come and go.", "Choose gentle activity if it feels comfortable and ask what is safe for your circumstances."],
  ["Growth and organisation", "Major body systems are continuing to form and organise.", "Some people feel more queasy in the morning; others feel symptoms at different times.", "Keep hydrated and contact your team for severe nausea, dehydration, pain or bleeding."],
  ["Early antenatal care", "The pregnancy is now often called a fetus, and growth remains rapid.", "You may notice tiredness, mood shifts, vivid dreams or changes in appetite.", "Your booking appointment may include health questions and discussion of screening choices."],
  ["Screening conversations", "Development continues and a dating scan may be approaching, depending on local care.", "Nausea may persist or begin to ease; both can be normal.", "Ask what each screening test can and cannot tell you before deciding."],
  ["Approaching the end of the first trimester", "The placenta is taking on more of the work of supporting the pregnancy.", "Some people begin to regain energy, while others still need plenty of rest.", "Check how and when to get results from any screening offered to you."],
  ["First-trimester transition", "The fetus continues growing and moving, although movement is usually not felt yet.", "Nausea may improve; heartburn, constipation or headaches can still occur.", "Discuss work, travel or exercise questions with your maternity team if they are relevant."],
  ["Second-trimester beginnings", "Facial features and body proportions continue to develop.", "Energy may improve for some people, but there is no required way to feel.", "Use this steadier period to bring questions about sleep, food, movement or mental wellbeing."],
  ["Early movement may be noticed", "The fetus is moving, though first movements can feel like flutters and may not be noticed yet.", "You may feel more comfortable or notice stretching as the uterus grows.", "Ask when your unit expects you to start noticing movements; it varies."],
  ["Growing awareness", "Bones and muscles are developing and movement may become more noticeable soon.", "Round-ligament stretching or mild aches can occur; severe or persistent pain needs advice.", "Consider practical support at home if fatigue or symptoms are affecting daily life."],
  ["Preparation for the anatomy scan", "The fetus is growing and the detailed scan may be scheduled around this stage.", "You may notice changes in posture, skin or appetite.", "Ask what the anatomy scan looks for and how results will be shared."],
  ["Movement can feel more distinct", "Some people begin to recognise gentle movement, particularly in a first pregnancy later than this.", "Backache or pelvic discomfort may come and go as your body changes.", "Keep appointments and ask about pain, work adjustments or mental wellbeing."],
  ["Detailed development check", "An ultrasound around this period may examine anatomy; it is a screening assessment, not a guarantee.", "Your bump may become more visible and sleep positions may need adjustment for comfort.", "Bring questions to the scan and ask who to contact if anything is unclear afterwards."],
  ["Movement patterns begin to emerge", "The fetus is practising movements, although their pattern is still developing.", "Heartburn, constipation and backache can become more noticeable.", "Plan simple meals, rest and movement breaks that suit your routine."],
  ["Mid-pregnancy growth", "Growth continues, with senses and movement developing over time.", "You may notice movement more often, but there is no universal number to count at this stage.", "Ask about your next appointments and any tests recommended for you."],
  ["A more active stage", "The fetus may have active and quieter periods as sleep-wake patterns develop.", "Leg cramps, heartburn or trouble sleeping can be frustrating but deserve discussion if persistent.", "A partner can take on one practical task this week and help protect rest."],
  ["Viability discussions can be emotional", "The fetus continues to develop rapidly, but every pregnancy and any early birth situation is individual.", "You may feel more movement and more physical demands at the same time.", "Avoid online comparisons; ask your own team about concerns and local support."],
  ["Steady growth", "The fetus is gaining weight and developing further body systems.", "Braxton Hicks tightenings can occur, but painful, regular or worrying contractions need advice.", "Discuss any new itching, swelling, headaches or changes that concern you."],
  ["Everyday adjustments", "The fetus continues to grow and move within a changing amount of space.", "You may need more frequent breaks, supportive footwear or different sleeping arrangements.", "Start a shared list for baby essentials, leave arrangements and appointments."],
  ["Glucose screening may be discussed", "Development continues and the fetus may respond to sounds.", "Some people are offered testing for gestational diabetes based on individual factors.", "Ask why a test is offered, what it involves and how results will guide care."],
  ["Late second trimester", "The fetus is growing steadily and movement may be more recognisable to you.", "Backache, reflux and tiredness are common reasons to ask for practical support.", "Learn your maternity unit's advice about your baby's usual movements."],
  ["A useful planning point", "The fetus continues to add body fat and develop organs for later pregnancy.", "Your body may feel heavier, and breathlessness on exertion can occur.", "Discuss birth education, feeding support and any work or travel plans."],
  ["Third-trimester transition", "The fetus is continuing to mature and gain weight.", "You may have more frequent urination, sleep disruption or pelvic pressure.", "Make sure you know how to contact maternity triage out of hours."],
  ["Movement awareness matters", "Movements may feel different as space changes, but they should not simply reduce because of late pregnancy.", "Tiredness and discomfort can increase; ask for individual advice rather than pushing through.", "Review the urgent-contact plan together and save key numbers."],
  ["Preparing for birth conversations", "The fetus is practising breathing movements and continuing to mature.", "Braxton Hicks can become more noticeable; call for advice if contractions are regular, painful or you are unsure.", "Discuss birth preferences as flexible prompts, not a fixed test of success."],
  ["Growth and positioning", "The fetus may move into a head-down position, but position can still change.", "Pelvic pressure, backache and shortness of breath can affect daily comfort.", "Ask what support is available for pelvic pain, sleep or anxiety."],
  ["Nearing full term", "The fetus continues gaining weight and maturing for life after birth.", "You may find it harder to get comfortable; rest and gentle movement can be balanced around your needs.", "Check your hospital bag, transport options and care arrangements without assuming labour timing."],
  ["Birth preparation", "The fetus continues to mature; estimated size and position are assessed individually when needed.", "Vaginal discharge can change; fluid leakage, bleeding or a concern about labour needs a call.", "Confirm who will be with you, how to contact the unit and what to do if plans change."],
  ["Early-term pregnancy", "Many babies do well when born in this window, but your team will guide care based on your circumstances.", "You may be ready for labour or simply waiting; both can be emotionally demanding.", "Talk through pain-relief options, feeding plans and support after birth."],
  ["Full-term transition", "The fetus is continuing final maturation and weight gain.", "Tightenings, sleep disruption and impatience can all be part of this stage.", "Keep following your unit's individual advice about appointments and movements."],
  ["Waiting with support", "The fetus continues to grow, and individual monitoring may be offered depending on your care plan.", "It is normal to have questions about induction, sweeps or changing plans.", "Ask for balanced explanations of benefits, risks and alternatives that apply to you."],
  ["Planning beyond the due date", "A due date is an estimate; your maternity team will explain monitoring and options if pregnancy continues.", "You may feel physically and emotionally ready for birth; contact your team for any change in wellbeing.", "Review transport, childcare and post-birth support so decisions do not sit with one person."],
  ["Individualised late-pregnancy care", "The fetus continues to be assessed through your own care plan rather than an app prediction.", "Your appointments may become more frequent or include conversations about induction.", "Ask how your preferences and medical needs are being considered in the plan."],
  ["Extended pregnancy care", "Your maternity team will advise on monitoring and timing of birth based on your individual situation.", "Keep reporting movements in the usual way and seek advice for any change.", "Bring a support person to planning conversations if you want help remembering information."],
  ["Close maternity-team contact", "Care at this stage is highly individual and should be led by your maternity team.", "Do not rely on general timeline information for decisions about labour or induction.", "Keep your phone available and follow the contact plan your team has given you."],
  ["Care beyond 41 weeks", "Your team will discuss monitoring and birth options that are appropriate for you and your baby.", "Any concern about movements, bleeding, fluid loss, pain or your wellbeing still needs prompt contact.", "Focus on communication, rest and practical support while your care plan is finalised."]
];

export const pregnancyWeeks: PregnancyWeekGuide[] = highlights.map(([title, baby, body, care], index) => {
  const week = index + 1;
  return {
    week,
    title,
    summary: `Week ${week}: ${title.toLowerCase()}. Evidence-informed information to help you prepare questions for your maternity team.`,
    baby,
    body,
    care,
    partner: "Ask what would feel useful this week, take one practical task without being asked, and support any decision to contact the maternity team.",
    checklist: ["Notice what is changing without comparing your pregnancy to anyone else's.", "Add one question or symptom pattern to your next-appointment notes.", "Make time for food, fluids and rest in a way that works for you.", "Check that a partner or trusted person knows how to reach the maternity unit."],
    questions: ["Is this symptom or change something you want me to monitor?", "What should I expect before my next appointment?", "Who should I contact outside normal hours if I am worried?"],
    warning: urgentAdvice
  };
});

export const pregnancySources = [
  { label: "NHS: Pregnancy week by week", href: "https://www.nhs.uk/pregnancy/week-by-week/" },
  { label: "NHS: Your antenatal appointments", href: "https://www.nhs.uk/pregnancy/your-pregnancy-care/your-antenatal-appointments/" },
  { label: "NHS: Your baby's movements", href: "https://www.nhs.uk/pregnancy/keeping-well/your-babys-movements/" },
  { label: "NHS: When to contact a midwife or maternity unit", href: "https://www.nhs.uk/pregnancy/labour-and-birth/what-happens/when-to-go-to-hospital-or-midwifery-unit/" }
];
