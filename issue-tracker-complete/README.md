# Issue Tracker — Complete (FastAPI + Angular)

This package contains a full backend (FastAPI) and a polished-looking Angular frontend (scaffold).
Run backend:
```
cd backend
python -m venv .venv
source .venv/bin/activate   # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```
Run frontend:
```
cd frontend
npm install
npm start
```
Import `backend/postman_collection.json` into Postman to run sample requests.

Run backend tests:
```
cd backend
pytest -q
```

To publish to GitHub, initialize git and push as usual (README contains example commands).
