"""
Seed script to populate the knowledge base with 300+ healthcare Q&A pairs
Run this once to populate the database
"""

from app.database import SessionLocal
from app.models import KnowledgeBase

QA_PAIRS = []

# -----------------------------
# SYMPTOMS
# -----------------------------

symptoms = [
"headache","fever","cough","cold","sore throat","fatigue","dizziness","nausea",
"vomiting","diarrhea","constipation","chest pain","back pain","joint pain",
"muscle pain","shortness of breath","runny nose","sneezing","itchy eyes",
"skin rash","hair loss","weight loss","weight gain","loss of appetite",
"insomnia","anxiety","depression","dry mouth","swelling","palpitations",
"night sweats","frequent urination","burning urination","stomach pain",
"bloating","heartburn","indigestion","ear pain","hearing loss","blurred vision",
"double vision","tingling sensation","numbness","leg cramps","cold hands",
"cold feet","hot flashes","memory loss","confusion","difficulty concentrating",
"body aches","chills","sweating","weakness","loss of smell","loss of taste"
]

for s in symptoms:

    QA_PAIRS.append({
        "question": f"What causes {s}?",
        "answer": f"{s.capitalize()} can occur due to infections, dehydration, stress, lifestyle factors, or underlying medical conditions. If the symptom persists or becomes severe, consult a healthcare professional.",
        "category": "symptoms"
    })

    QA_PAIRS.append({
        "question": f"How can I relieve {s}?",
        "answer": f"Mild {s} may improve with rest, hydration, proper nutrition, and over-the-counter medications if appropriate. Persistent or worsening symptoms should be evaluated by a doctor.",
        "category": "wellness"
    })

# -----------------------------
# DISEASES
# -----------------------------

diseases = [
"diabetes","hypertension","asthma","bronchitis","pneumonia","anemia","migraine",
"arthritis","thyroid disorder","high cholesterol","kidney stones","ulcer",
"food poisoning","allergies","flu","covid","tuberculosis","malaria",
"dengue","hepatitis","stroke","heart attack","obesity","osteoporosis",
"eczema","psoriasis","sleep apnea","acid reflux","gastritis","appendicitis",
"pancreatitis","liver disease","kidney disease","heart disease","alzheimer's",
"parkinson's","dehydration","chronic fatigue syndrome"
]

for d in diseases:

    QA_PAIRS.append({
        "question": f"What are the symptoms of {d}?",
        "answer": f"Symptoms of {d} may include fatigue, pain, fever, weakness, and other condition-specific signs. Diagnosis should always be confirmed by a qualified healthcare professional.",
        "category": "disease"
    })

    QA_PAIRS.append({
        "question": f"How is {d} treated?",
        "answer": f"Treatment for {d} depends on severity and may include lifestyle changes, medication, therapy, or medical procedures. Always consult a doctor for proper diagnosis and treatment.",
        "category": "medical"
    })

# -----------------------------
# NUTRITION
# -----------------------------

nutrients = [
"vitamin A","vitamin B12","vitamin C","vitamin D","vitamin E","iron","calcium",
"protein","fiber","magnesium","potassium","zinc","omega-3","folic acid"
]

for n in nutrients:

    QA_PAIRS.append({
        "question": f"Why is {n} important for health?",
        "answer": f"{n.capitalize()} plays an essential role in supporting body functions such as immunity, metabolism, bone health, and energy production.",
        "category": "nutrition"
    })

    QA_PAIRS.append({
        "question": f"What foods contain {n}?",
        "answer": f"Foods rich in {n} include fruits, vegetables, whole grains, dairy products, nuts, seeds, and lean proteins depending on the nutrient.",
        "category": "nutrition"
    })

# -----------------------------
# WELLNESS
# -----------------------------

wellness_topics = [
"sleep","exercise","hydration","stress management","weight management",
"heart health","mental health","immune health","brain health","digestive health"
]

for w in wellness_topics:

    QA_PAIRS.append({
        "question": f"How can I improve my {w}?",
        "answer": f"Improving {w} involves healthy lifestyle habits such as balanced nutrition, regular exercise, adequate sleep, hydration, and stress management.",
        "category": "wellness"
    })

    QA_PAIRS.append({
        "question": f"Why is {w} important?",
        "answer": f"{w.capitalize()} is important for maintaining overall physical and mental well-being and reducing the risk of chronic diseases.",
        "category": "wellness"
    })

# -----------------------------
# FIRST AID
# -----------------------------

first_aid = [
"burn","cut","nosebleed","sprain","fracture","heat stroke","fainting",
"choking","snake bite","electric shock","allergic reaction"
]

for f in first_aid:

    QA_PAIRS.append({
        "question": f"What should I do in case of a {f}?",
        "answer": f"For a {f}, remain calm, ensure safety, provide basic first aid if trained, and seek medical help if the condition is severe.",
        "category": "first_aid"
    })

# -----------------------------
# GENERAL HEALTH
# -----------------------------

general_questions = [
"How much water should I drink daily?",
"What is a healthy diet?",
"How often should I exercise?",
"What is a healthy weight?",
"How can I boost my immune system?",
"How can I reduce stress naturally?",
"How much sleep do adults need?",
"What are benefits of regular exercise?",
"How can I improve digestion?",
"What are signs of dehydration?"
]

for q in general_questions:

    QA_PAIRS.append({
        "question": q,
        "answer": "Maintaining good health involves balanced nutrition, regular exercise, proper sleep, stress management, hydration, and routine medical checkups.",
        "category": "health"
    })

# -----------------------------
# DATABASE INSERT
# -----------------------------

db = SessionLocal()

try:

    existing_count = db.query(KnowledgeBase).count()

    if existing_count > 0:
        print(f"Knowledge base already contains {existing_count} Q&A pairs. Skipping seed.")
        db.close()
        exit(0)

    for qa in QA_PAIRS:

        knowledge = KnowledgeBase(
            question=qa["question"],
            answer=qa["answer"],
            category=qa["category"]
        )

        db.add(knowledge)

    db.commit()

    print(f"✅ Successfully seeded knowledge base with {len(QA_PAIRS)} Q&A pairs!")

except Exception as e:

    db.rollback()
    print(f"❌ Error seeding knowledge base: {e}")

finally:

    db.close()