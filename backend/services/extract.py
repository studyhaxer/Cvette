import pdfplumber
from docx import Document
from fastapi import HTTPException, UploadFile

SUPPORTED_PDF_TYPES = {"application/pdf"}
SUPPORTED_DOCX_TYPES = {
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}


def _extract_from_pdf(file_bytes: bytes) -> str:
    text_parts = []
    with pdfplumber.open(io_wrap(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n".join(text_parts).strip()


def _extract_from_docx(file_bytes: bytes) -> str:
    document = Document(io_wrap(file_bytes))
    paragraphs = [p.text for p in document.paragraphs if p.text.strip()]
    return "\n".join(paragraphs).strip()


def io_wrap(file_bytes: bytes):
    import io
    return io.BytesIO(file_bytes)


async def extract_text(file: UploadFile) -> str:
    """Dispatch to the right extractor based on content type, falling back
    to filename extension if content_type is missing or generic."""
    file_bytes = await file.read()

    content_type = (file.content_type or "").lower()
    filename = (file.filename or "").lower()

    is_pdf = content_type in SUPPORTED_PDF_TYPES or filename.endswith(".pdf")
    is_docx = content_type in SUPPORTED_DOCX_TYPES or filename.endswith(".docx")

    try:
        if is_pdf:
            text = _extract_from_pdf(file_bytes)
        elif is_docx:
            text = _extract_from_docx(file_bytes)
        else:
            raise HTTPException(
                status_code=422,
                detail="Unsupported file type. Please upload a PDF or DOCX file, or paste the text instead.",
            )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail="Could not read the uploaded file — try pasting the text instead.",
        ) from exc

    if not text:
        raise HTTPException(
            status_code=422,
            detail="The uploaded file appears to be empty or unreadable — try pasting the text instead.",
        )

    return text