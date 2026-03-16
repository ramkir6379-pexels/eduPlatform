# AI Engagement Service

This is a Python FastAPI microservice that analyzes student engagement through facial emotion detection.

## Setup

### 1. Install Python Dependencies

```bash
cd ai-service
pip install -r requirements.txt
```

### 2. Run the AI Service

```bash
uvicorn main:app --reload --port 8000
```

The service will start at `http://localhost:8000`

### 3. Health Check

To verify the service is running:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status": "AI service is running"}
```

## API Endpoints

### POST /analyze

Analyzes a video frame for emotion and engagement.

**Request:**
- Content-Type: multipart/form-data
- Parameter: `frame` (image file)

**Response:**
```json
{
  "emotion": "neutral",
  "engagement_score": 0.7
}
```

**Emotion to Engagement Score Mapping:**
- happy: 0.9
- neutral: 0.7
- surprise: 0.8
- sad: 0.3
- angry: 0.2
- fear: 0.2
- disgust: 0.2
- unknown: 0.5

## How It Works

1. Receives JPEG image frame from Node backend
2. Decodes image using OpenCV
3. Analyzes facial emotion using DeepFace
4. Maps emotion to engagement score
5. Returns score to backend

## Important Notes

- The AI service runs on port 8000 (separate from Node backend on port 5000)
- Frames are processed in memory and not stored
- First request may take longer as DeepFace models are loaded
- Ensure backend is configured to send frames to `http://localhost:8000/analyze`
