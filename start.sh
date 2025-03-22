#!/bin/bash

# Start the FastAPI backend
echo "Starting FastAPI backend..."
python -m uvicorn server:app --host 0.0.0.0 --port 8000 &

# Wait for the backend to start
sleep 2

# Start the Next.js frontend
echo "Starting Next.js frontend..."
npm run dev

