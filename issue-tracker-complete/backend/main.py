from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import json, os

DATA_FILE = os.path.join(os.path.dirname(__file__), "issues.json")

app = FastAPI(title="Issue Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200","http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IssueIn(BaseModel):
    title: str
    description: Optional[str] = ""
    status: Optional[str] = "Open"
    priority: Optional[str] = "Medium"
    assignee: Optional[str] = ""

class Issue(IssueIn):
    id: int
    createdAt: str
    updatedAt: str

def _load():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            json.dump([], f)
        return []
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def _save(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def _now_iso():
    return datetime.utcnow().isoformat() + 'Z'

_issues_cache = _load()
_next_id = (max((i['id'] for i in _issues_cache), default=0) + 1) if _issues_cache else 1

def _persist_cache():
    _save(_issues_cache)

@app.get('/health')
def health():
    return { "status": "ok" }

@app.get('/issues', response_model=List[Issue])
def list_issues(
    search: Optional[str] = Query(None, description="search title substring"),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    assignee: Optional[str] = Query(None),
    sortBy: Optional[str] = Query('updatedAt'),
    sortDir: Optional[str] = Query('desc'),
    page: Optional[int] = Query(1, ge=1),
    pageSize: Optional[int] = Query(10, ge=1, le=200),
):
    items = list(_issues_cache)

    if search:
        q = search.lower()
        items = [it for it in items if q in it.get('title','').lower()]

    if status:
        items = [it for it in items if str(it.get('status','')).lower() == status.lower()]
    if priority:
        items = [it for it in items if str(it.get('priority','')).lower() == priority.lower()]
    if assignee:
        items = [it for it in items if str(it.get('assignee','')).lower() == assignee.lower()]

    reverse = (str(sortDir).lower() == 'desc')
    try:
        items.sort(key=lambda x: x.get(sortBy) or '', reverse=reverse)
    except Exception:
        pass

    start = (page - 1) * pageSize
    end = start + pageSize
    return items[start:end]

@app.get('/issues/{issue_id}', response_model=Issue)
def get_issue(issue_id: int):
    for it in _issues_cache:
        if it['id'] == issue_id:
            return it
    raise HTTPException(status_code=404, detail='Issue not found')

@app.post('/issues', response_model=Issue, status_code=201)
def create_issue(payload: IssueIn):
    global _next_id
    new = payload.dict()
    now = _now_iso()
    issue = {
        'id': _next_id,
        'title': new.get('title',''),
        'description': new.get('description',''),
        'status': new.get('status','Open'),
        'priority': new.get('priority','Medium'),
        'assignee': new.get('assignee',''),
        'createdAt': now,
        'updatedAt': now,
    }
    _issues_cache.append(issue)
    _next_id += 1
    _persist_cache()
    return issue

@app.put('/issues/{issue_id}', response_model=Issue)
def update_issue(issue_id: int, payload: IssueIn):
    for idx, it in enumerate(_issues_cache):
        if it['id'] == issue_id:
            now = _now_iso()
            updated = it.copy()
            updated.update(payload.dict())
            updated['updatedAt'] = now
            _issues_cache[idx] = updated
            _persist_cache()
            return updated
    raise HTTPException(status_code=404, detail='Issue not found')

# seed sample data if empty
if not _issues_cache:
    sample = [
        {
            'id': 1,
            'title': 'Login button not working',
            'description': 'Clicking login yields 500',
            'status': 'Open',
            'priority': 'High',
            'assignee': 'Alice',
            'createdAt': _now_iso(),
            'updatedAt': _now_iso(),
        },
        {
            'id': 2,
            'title': 'Typo on About page',
            'description': 'Small typo in heading',
            'status': 'Closed',
            'priority': 'Low',
            'assignee': 'Bob',
            'createdAt': _now_iso(),
            'updatedAt': _now_iso(),
        }
    ]
    _issues_cache.extend(sample)
    _next_id = 3
    _persist_cache()
