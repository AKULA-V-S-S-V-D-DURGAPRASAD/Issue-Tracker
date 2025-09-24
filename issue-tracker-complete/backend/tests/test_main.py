from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health():
    r = client.get('/health')
    assert r.status_code == 200
    assert r.json() == {'status': 'ok'}

def test_list_issues():
    r = client.get('/issues')
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_create_get_update():
    payload = {
        "title": "pytest issue",
        "description": "created by pytest",
        "status": "Open",
        "priority": "Medium",
        "assignee": "pytest"
    }
    r = client.post('/issues', json=payload)
    assert r.status_code == 201
    created = r.json()
    assert created['title'] == payload['title']
    iid = created['id']

    r2 = client.get(f'/issues/{iid}')
    assert r2.status_code == 200
    assert r2.json()['id'] == iid

    payload['status'] = 'In Progress'
    r3 = client.put(f'/issues/{iid}', json=payload)
    assert r3.status_code == 200
    assert r3.json()['status'] == 'In Progress'
