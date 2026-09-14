# Parser script to process OCR text from the 30 pages of the user's PDF
import re
import json

known_categories = [
    "AUTOMAÇÃO E CONTROLE",
    "CABOS E CONECTORES",
    "COMANDO E MANOBRA ELÉTRICA",
    "FERRAMENTAS E UTENSÍLIOS",
    "FILTROS",
    "FIXAÇÃO",
    "FONTES E ELETRÔNICA",
    "FUSÍVEIS E PROTEÇÃO ELÉTRICA",
    "GRAXAS E CONSUMÍVEIS",
    "GASES E CONSUMÍVEIS",
    "HIDRÁULICA",
    "ILUMINAÇÃO",
    "MOTORES E TRANSMISSÃO",
    "OUTROS / REPOSIÇÃO",
    "PEÇAS DE MÁQUINA / REPOSIÇÃO",
    "PNEUMÁTICA",
    "RESISTÊNCIAS E AQUECIMENTO",
    "ROLAMENTOS",
    "SENSORES E INSTRUMENTAÇÃO",
    "VEDAÇÃO",
    "ABRASIVOS"
]

def clean_text(t):
    return ' '.join(t.split()).strip()

print("Ready to process")
