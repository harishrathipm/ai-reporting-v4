# 📌 Task: Role Selection (Mocked) & Propagation

You're a full-stack coding agent.

📚 Use `DEV_GUIDELINE.md` for structure and code rules.
🧾 Use `README.md` only to check existing features. Do not duplicate.
📌 Implement only this task.

---

## ✅ Backend (FastAPI)

### 1. `GET /roles`
- Returns: `{ "roles": ["Executive", "DataAnalyst"] }`
- No input, no auth, just static list
- Add logging

### 2. Extend Chat Handler
- Accept: `{ "role": "Executive", "query": "..." }`
- Format system prompt:
  > "You are an Executive. Answer: {query}"
- Log role and query

---

## ✅ Frontend (React)

- On load, fetch `/roles` → show dropdown
- Store selected role in state
- On submit, send `{ role, query }` to backend
- Display LLM response inline

---

## 🧰 Integration

- Add `/roles` to frontend API config
- Enable CORS in FastAPI if needed

---

## 📘 README.md: One-Liner Summary

Append this to README under "Implemented Features":
