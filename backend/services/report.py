from io import BytesIO
from typing import List

from pydantic import BaseModel
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    ListFlowable,
    ListItem,
)


class ReportRequest(BaseModel):
    """
    ⚠️ ASSUMPTION: mirrors the /analyze response shape confirmed working
    on the frontend (match_score, missing_keywords, summary,
    suggested_bullets). If your actual AnalyzeResponse in schemas.py
    already defines this shape, consider importing and reusing that
    model here instead of duplicating it.
    """
    match_score: int
    missing_keywords: List[str] = []
    summary: str
    suggested_bullets: List[str] = []


def generate_report_pdf(data: ReportRequest) -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
    )
    styles = getSampleStyleSheet()
    brand_green = colors.HexColor("#153A2E")

    title_style = ParagraphStyle(
        "TitleStyle", parent=styles["Title"], textColor=brand_green
    )
    heading_style = ParagraphStyle(
        "HeadingStyle",
        parent=styles["Heading2"],
        textColor=brand_green,
        spaceBefore=16,
        spaceAfter=8,
    )
    score_style = ParagraphStyle(
        "ScoreStyle",
        parent=styles["Title"],
        fontSize=32,
        textColor=brand_green,
        alignment=1,  # center
        spaceAfter=2,
    )
    label_style = ParagraphStyle(
        "LabelStyle",
        parent=styles["Normal"],
        alignment=1,
        textColor=colors.grey,
        spaceAfter=24,
    )

    story = [
        Paragraph("Cvette — Resume Match Report", title_style),
        Spacer(1, 20),
        Paragraph(f"{data.match_score}%", score_style),
        Paragraph("Match Score", label_style),
        Paragraph("Summary", heading_style),
        Paragraph(data.summary, styles["BodyText"]),
    ]

    if data.missing_keywords:
        story.append(Paragraph("Missing Keywords", heading_style))
        story.append(Paragraph(", ".join(data.missing_keywords), styles["BodyText"]))

    if data.suggested_bullets:
        story.append(Paragraph("Suggested Bullet Points", heading_style))
        bullet_items = [
            ListItem(Paragraph(b, styles["BodyText"])) for b in data.suggested_bullets
        ]
        story.append(ListFlowable(bullet_items, bulletType="bullet"))

    doc.build(story)
    buffer.seek(0)
    return buffer