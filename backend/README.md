# Backend (FastAPI)

## 1) Create and activate virtual environment

macOS/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

## 2) Install dependencies

```bash
pip install -r requirements-dev.txt
```

## 3) Run development server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 4) Run tests

```bash
pytest
```

## API endpoints

- `GET /api/health` - health check
