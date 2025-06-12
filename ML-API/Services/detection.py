import cv2
import mediapipe as mp
import numpy as np
from fastapi import UploadFile  # ✅ Add this

mp_pose = mp.solutions.pose
mp_face = mp.solutions.face_detection

pose = mp_pose.Pose()
face_detection = mp_face.FaceDetection(model_selection=1, min_detection_confidence=0.5)

def detect_faces_and_bodies(file: UploadFile):
    print('hi')
    contents = file.file.read()
    np_img = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    results_pose = pose.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    results_face = face_detection.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

    face_detected = results_face.detections is not None
    body_detected = results_pose.pose_landmarks is not None

    return {
        "faceDetected": face_detected,
        "bodyDetected": body_detected
    }
