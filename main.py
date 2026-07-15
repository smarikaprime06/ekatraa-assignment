from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import math

app = FastAPI(title="Ekatraa AI Planner")

# Allows your future React frontend to talk to this Python file
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. WHAT WE EXPECT FROM THE USER
class EventRequest(BaseModel):
    event_type: str
    city: str
    guests: int
    budget: float
    event_date: str

# 2. THE KNOWLEDGE BASE (Rule Engine)
EVENT_RULES = {
    "wedding": {
        "services": ["Banquet Hall", "Decoration", "Catering", "Photography", "Makeup", "DJ", "Invitation Cards"],
        "budget_weights": {"Venue & Hall": 0.35, "Catering": 0.30, "Decoration": 0.15, "Photography": 0.10, "Miscellaneous": 0.10}
    },
    "corporate": {
        "services": ["Conference Hall", "AV Equipment", "Catering", "Keynote Speaker", "Badges & Printing", "Photography"],
        "budget_weights": {"Venue & AV": 0.40, "Catering": 0.25, "Marketing & Print": 0.15, "Speakers": 0.10, "Buffer": 0.10}
    },
    "birthday": {
        "services": ["Party Hall", "Theme Decor", "Catering", "Cake Designer", "Entertainment", "Photography"],
        "budget_weights": {"Venue & Cake": 0.25, "Catering": 0.35, "Decor & Theme": 0.20, "Entertainment": 0.10, "Gifts": 0.10}
    }
}

# 3. THE API ENDPOINT
@app.post("/api/v1/predict-plan")
def get_event_plan(req: EventRequest):
    # Normalize input
    event_key = req.event_type.lower().strip()
    if event_key not in EVENT_RULES:
        event_key = "wedding" # Default fallback
        
    rules = EVENT_RULES[event_key]
    
    # --- AI LOGIC 1: Dynamic Services based on scale ---
    final_services = list(rules["services"])
    if req.guests > 300:
        final_services.append("Valet Parking")
        final_services.append("Security & Crowd Control")
    if req.guests > 100:
        final_services.append("Live Food Counters")

    # --- AI LOGIC 2: Budget Distribution ---
    budget_distribution = []
    for category, weight in rules["budget_weights"].items():
        allocated = req.budget * weight
        budget_distribution.append({
            "category": category, 
            "allocated": round(allocated, 2),
            "percentage": int(weight * 100)
        })

    # --- AI LOGIC 3: Timeline Generator (Bonus Feature) ---
    try:
        event_date_obj = datetime.strptime(req.event_date, "%Y-%m-%d")
        timeline = [
            {"task": "Book Venue & Caterer", "date": (event_date_obj - timedelta(days=90)).strftime("%Y-%m-%d")},
            {"task": "Finalize Decor & DJ", "date": (event_date_obj - timedelta(days=60)).strftime("%Y-%m-%d")},
            {"task": "Send Invitations", "date": (event_date_obj - timedelta(days=30)).strftime("%Y-%m-%d")},
            {"task": "Final Headcount", "date": (event_date_obj - timedelta(days=7)).strftime("%Y-%m-%d")}
        ]
    except:
        timeline = []

    return {
        "message": f"Successfully planned your {req.event_type} in {req.city}!",
        "required_services": final_services,
        "budget_distribution": budget_distribution,
        "timeline": timeline
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)