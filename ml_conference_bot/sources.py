# Curated sources checked daily by the agent.
# Each entry has a url and a hint so Claude knows what to look for.

SOURCES: list[dict] = [
    # ── Bio-ML conferences ────────────────────────────────────────────────────
    {
        "url": "https://www.mlforhc.org/",
        "hint": "ML for Healthcare conference – find submission/registration deadlines",
    },
    {
        "url": "https://chil.acm.org/",
        "hint": "ACM Conference on Health, Inference, and Learning – deadlines and dates",
    },
    {
        "url": "https://www.iscb.org/iscb-conferences",
        "hint": "ISCB conferences: ISMB, ECCB, RECOMB – find all upcoming events",
    },
    {
        "url": "https://recomb.org/",
        "hint": "RECOMB conference – find registration and abstract deadlines",
    },
    {
        "url": "https://psb.stanford.edu/",
        "hint": "Pacific Symposium on Biocomputing – submission and registration dates",
    },
    {
        "url": "https://www.biomedcentral.com/collections",
        "hint": "BMC conference collections – find upcoming computational biology events",
    },
    # ── Major ML conferences ──────────────────────────────────────────────────
    {
        "url": "https://neurips.cc/",
        "hint": "NeurIPS – find workshop deadlines, registration open dates, travel grants",
    },
    {
        "url": "https://icml.cc/",
        "hint": "ICML – submission deadlines, registration, workshops on health/bio",
    },
    {
        "url": "https://iclr.cc/",
        "hint": "ICLR – deadlines, workshops, financial assistance",
    },
    {
        "url": "https://aaai.org/aaai-conference/",
        "hint": "AAAI – deadlines, student programs, workshop on health AI",
    },
    # ── Summer schools ────────────────────────────────────────────────────────
    {
        "url": "https://mlss.cc/",
        "hint": "Machine Learning Summer School – application deadlines, locations, scholarships",
    },
    {
        "url": "https://meetings.cshl.edu/courses.aspx",
        "hint": "Cold Spring Harbor Laboratory courses – genomics, computational biology, application dates",
    },
    {
        "url": "https://www.broadinstitute.org/education",
        "hint": "Broad Institute education programs – summer institutes, workshops",
    },
    {
        "url": "https://simons.berkeley.edu/programs",
        "hint": "Simons Institute programs – ML theory, computational biology workshops",
    },
    {
        "url": "https://www.sanger.ac.uk/about/study/",
        "hint": "Wellcome Sanger courses – open to international students, genomics",
    },
    # ── Hackathons ────────────────────────────────────────────────────────────
    {
        "url": "https://devpost.com/hackathons?themes[]=Healthcare&themes[]=Machine+Learning&status[]=upcoming",
        "hint": "Devpost hackathons – health + ML theme, prizes, deadlines",
    },
    {
        "url": "https://mlh.io/seasons/",
        "hint": "Major League Hacking – upcoming hackathons open to students",
    },
    {
        "url": "https://www.aihackathon.org/",
        "hint": "AI hackathon listings – health and bio focus",
    },
    # ── Fellowships / Training programs ──────────────────────────────────────
    {
        "url": "https://www.training.nih.gov/programs/",
        "hint": "NIH training programs – find programs open to grad students and postdocs",
    },
    {
        "url": "https://www.nigms.nih.gov/training/",
        "hint": "NIGMS training – bioinformatics, computational biology grants and programs",
    },
    {
        "url": "https://www.genome.gov/careers-training/",
        "hint": "NHGRI genomics training opportunities",
    },
]
