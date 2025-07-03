# services/detection.py
import cv2, mediapipe as mp, numpy as np
from fastapi import UploadFile, HTTPException
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
from torchvision.models import MobileNet_V2_Weights



model = models.mobilenet_v2(pretrained=False)
model.classifier[1] = nn.Linear(model.last_channel, 4)  # 4 classes

model.load_state_dict(torch.load(r"C:\FAI\ML-API\models\skintone_detection.pth", map_location=torch.device('cpu')))
model.eval()


def predict_skintone(img , coords) :
    transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])
    
    class_names = ['dark', 'light', 'med-dark', 'mid-light']
    input_tensor = transform(img).unsqueeze(0).to('cpu')
    
    #Predict
    with torch.no_grad():
        output = model(input_tensor)
        _, predicted = torch.max(output, 1)
        predicted_class = class_names[predicted.item()]
    return predicted_class






def detect_faces_and_bodies(file: UploadFile) -> dict:
    contents = file.file.read()            # sync read OK for small files
    np_img   = np.frombuffer(contents, np.uint8)
    img      = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(400, "Unreadable image")

    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    skintone = ""

    with mp.solutions.pose.Pose(static_image_mode=True,
                                model_complexity=2,
                                min_detection_confidence=0.5) as pose, \
         mp.solutions.face_detection.FaceDetection(model_selection=1,
                                                   min_detection_confidence=0.5) as face_det:

        pose_res  = pose.process(rgb)
        face_res  = face_det.process(rgb)
        
        face_boxes = []

        if face_res.detections:
           h, w, _ = img.shape  # Get original image size
           for det in face_res.detections:
               bboxC = det.location_data.relative_bounding_box
               x = int(bboxC.xmin * w)
               y = int(bboxC.ymin * h)
               width = int(bboxC.width * w)
               height = int(bboxC.height * h)

               face_boxes.append({
            "x": x,
            "y": y,
            "width": width,
            "height": height
        })
               if len(face_boxes) == 1:
                   box = face_boxes[0]
                   x, y, w, h = box["x"], box["y"], box["width"], box["height"]

                   face_crop = rgb[y:y+h, x:x+w]
                   face_pil = Image.fromarray(face_crop)

                   skintone = predict_skintone(face_pil, box)
                   
              
                
               
               


        return {
            "faceDetected": len(face_res.detections) == 1 if face_res.detections else False,
            "bodyDetected": bool(pose_res.pose_landmarks) ,
            "skintone" : skintone
        }
