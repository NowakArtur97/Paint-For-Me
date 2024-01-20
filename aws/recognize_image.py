import json
import os
import boto3
import datetime
import base64

BUCKET_NAME = os.environ['BUCKET_NAME']
MAX_LABELS = os.environ['MAX_LABELS']
MIN_CONFIDENCE = os.environ['MIN_CONFIDENCE']

s3 = boto3.resource('s3')
rekognition = boto3.client('rekognition')

def save_to_s3(fileName, image):
    fileNameWithExtension = fileName + ".png"
    image = image.replace("data:image/png;base64,", "")
    s3.Object(BUCKET_NAME, fileNameWithExtension).put(Body=base64.b64decode(image))
    print("Successfully saved file: " + fileNameWithExtension + " to S3 bucket: " + BUCKET_NAME)
    return fileNameWithExtension

def analyze_image(fileNameWithExtension):
    return rekognition.detect_labels(Image = {"S3Object": {"Bucket": BUCKET_NAME, "Name": fileNameWithExtension}}, MaxLabels=int(MAX_LABELS), MinConfidence=int(MIN_CONFIDENCE))

def lambda_handler(event, context):
    print("Received request: ")
    print(json.loads(event['body']))
    data = json.loads(event['body'])
    image = data['image']
    now = datetime.datetime.now()
    fileName = f'rekognition_job_{now:%Y-%m-%d-%H-%M}'
    response = {}
    fileNameWithExtension = {}
    try:
        fileNameWithExtension = save_to_s3(fileName, image)
    except Exception as e:
        print("Exception when saving image to S3 bucket: " + BUCKET_NAME)
        print(e)
        response = {
            "statusCode": 500,
            "body": json.dumps( {"Status": "Failed"} )
        }
    try:
        response = analyze_image(fileNameWithExtension)
        print("Rekognition response: ")
        print(response)
    except Exception as e:
        print("Exception when calling Rekognition")
        print(e)
        response = {
            "statusCode": 500,
            "body": json.dumps( {"Status": "Failed"} )
        }
    return response