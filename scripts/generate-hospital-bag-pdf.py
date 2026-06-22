from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

output = "public/downloads/liorabump-hospital-bag-checklist.pdf"
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleLiora", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=28, leading=34, textColor=HexColor("#11233f")))
styles.add(ParagraphStyle(name="SectionLiora", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=15, leading=20, textColor=HexColor("#11233f"), spaceBefore=14, spaceAfter=7))
styles.add(ParagraphStyle(name="BodyLiora", parent=styles["BodyText"], fontSize=10, leading=15, textColor=HexColor("#41536d")))

doc = SimpleDocTemplate(output, pagesize=A4, rightMargin=18*mm, leftMargin=18*mm, topMargin=18*mm, bottomMargin=16*mm)
story = [Paragraph("LioraBump", styles["TitleLiora"]), Paragraph("The calm hospital-bag checklist", styles["TitleLiora"]), Spacer(1, 6), Paragraph("A practical list for the birthing parent, baby and support person. Check your maternity unit's current guidance first.", styles["BodyLiora"])]

sections = {
  "Important documents and essentials": ["Maternity notes, birth preferences and regular medicines", "Phone, long charging cable, glasses or contact-lens supplies", "Maternity-unit contact number and transport plan"],
  "For the birthing parent": ["Comfortable clothes, underwear, maternity pads and toiletries", "Water bottle and permitted snacks", "Lip balm, hair ties and anything that helps you feel settled"],
  "For baby": ["A few simple newborn and 0-3 month outfits", "Nappies and changing supplies if your unit asks you to bring them", "A blanket suitable for the journey home"],
  "For the support person": ["Phone charger, snacks, water and a change of clothes", "Parking or travel information", "A shared note of practical plans for childcare, pets and visitors"],
  "Before you leave": ["Call your maternity unit for advice if labour may have started", "Take your notes and regular medicines", "Use a correctly fitted car seat for a car journey home"]
}

for heading, items in sections.items():
    story.append(Paragraph(heading, styles["SectionLiora"]))
    data = [["□", Paragraph(item, styles["BodyLiora"])] for item in items]
    table = Table(data, colWidths=[9*mm, 155*mm])
    table.setStyle(TableStyle([("VALIGN", (0,0), (-1,-1), "TOP"), ("BOTTOMPADDING", (0,0), (-1,-1), 5)]))
    story.append(table)

story.extend([Spacer(1, 8), Paragraph("This checklist is educational and does not replace advice from your midwife, obstetrician or maternity unit. If you have concerns about labour, movements, bleeding, fluid loss or your health, contact your maternity team promptly.", styles["BodyLiora"]), Spacer(1, 6), Paragraph("liorabump.com", styles["BodyLiora"])])
doc.build(story)
