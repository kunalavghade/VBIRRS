import sys
sys.path.insert(0, './Yolo/')

import time
from pathlib import Path
import cv2
import torch
import numpy as np
from numpy import random
from models.experimental import attempt_load
from utils.general import check_img_size, check_requirements, check_imshow, non_max_suppression, apply_classifier, \
    scale_coords, xyxy2xywh, strip_optimizer, set_logging, increment_path
from utils.plots import plot_one_box


yolo = None
names = None
half = False
names = None
colors = None
imgsz = None
device = None
with torch.no_grad():
    weights = './Yolo/best.pt'
    device = torch.device('cpu')
    yolo  = attempt_load(weights, map_location= device)
    stride = int(yolo.stride.max())
    imgsz =  check_img_size(640, s = stride)
    names = yolo.module.names if hasattr(yolo, 'module') else yolo.names
    colors = [[random.randint(0, 255) for _ in range(3)] for _ in names],
    if device.type != 'cpu':
        yolo(torch.zeros(1, 3, imgsz, imgsz).to(device).type_as(next(yolo.parameters())))

def time_synchronized():
    if torch.cuda.is_available():
        torch.cuda.synchronize()
    return time.time()

def letterbox(
    img,
    new_shape=(640, 640),
    color=(114, 114, 114),
    auto=True,
    scaleFill=False,
    scaleup=True,
    stride=32,
):
    # Resize and pad image while meeting stride-multiple constraints
    shape = img.shape[:2]  # current shape [height, width]
    if isinstance(new_shape, int):
        new_shape = (new_shape, new_shape)

    # Scale ratio (new / old)
    r = min(new_shape[0] / shape[0], new_shape[1] / shape[1])
    if not scaleup:  # only scale down, do not scale up (for better test mAP)
        r = min(r, 1.0)

    # Compute padding
    ratio = r, r  # width, height ratios
    new_unpad = int(round(shape[1] * r)), int(round(shape[0] * r))
    dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1]  # wh padding
    if auto:  # minimum rectangle
        dw, dh = np.mod(dw, stride), np.mod(dh, stride)  # wh padding
    elif scaleFill:  # stretch
        dw, dh = 0.0, 0.0
        new_unpad = (new_shape[1], new_shape[0])
        ratio = new_shape[1] / shape[1], new_shape[0] / shape[0]  # width, height ratios

    dw /= 2  # divide padding into 2 sides
    dh /= 2

    if shape[::-1] != new_unpad:  # resize
        img = cv2.resize(img, new_unpad, interpolation=cv2.INTER_LINEAR)
    top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
    left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
    img = cv2.copyMakeBorder(
        img, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color
    )  # add border
    return img, ratio, (dw, dh)

def detect(path):
    veggies = []
    with torch.no_grad():
        img0 = cv2.imread('./Yolo/Data.jpg')
        img = letterbox(img0, 640, stride=2)[0]
        img = img[:, :, ::-1].transpose(2, 0, 1)  # BGR to RGB, to 3x416x416
        img = np.ascontiguousarray(img)
        img = torch.from_numpy(img).to(device)
        img = img.half() if half else img.float()  # uint8 to fp16/32
        img /= 255.0  # 0 - 255 to 0.0 - 1.0
        if img.ndimension() == 3:
            img = img.unsqueeze(0)

        t1 = time_synchronized()
        pred = yolo(img, augment=False)[0]

        pred = non_max_suppression(pred, 0.25, 0.45, agnostic=False)
        t2 = time_synchronized()
        for i, det in enumerate(pred):
            s = ""
            s += "%gx%g " % img.shape[2:]  # print string
            gn = torch.tensor(img0.shape)[[1, 0, 1, 0]]
            if len(det):
                det[:, :4] = scale_coords(img.shape[2:], det[:, :4], img0.shape).round()

            for c in det[:, -1].unique():
                n = (det[:, -1] == c).sum()  # detections per class
                s += f"{n} {names[int(c)]}{'s' * (n > 1)}, "  # add to string

            for *xyxy, conf, cls in reversed(det):
                if names[int(cls)] not in veggies:
                    veggies.append(names[int(cls)])
                label = f"{names[int(cls)]} {conf:.2f}"
                plot_one_box(xyxy, img0, label=label, line_thickness=1)

        cv2.imwrite("./Yolo/filename.jpg", img0)
    return sorted(veggies)