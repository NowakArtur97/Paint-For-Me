import json
import os
import boto3
import datetime
import base64

DATA_ARN = os.environ['DATA_ARN']
LANGUAGE_CODE = os.environ['LANGUAGE_CODE']
BUCKET_NAME = os.environ['BUCKET_NAME']

s3 = boto3.resource('s3')
comprehend = boto3.client('comprehend')

def save_to_s3(fileName, image):
    fileNameWithExtension = fileName + ".png"
    image = image.replace("data:image/png;base64,", "")
    s3.Object(BUCKET_NAME, fileNameWithExtension).put(Body=base64.b64decode(image))
    print("Successfully saved file: " + fileNameWithExtension + " to S3 bucket: " + BUCKET_NAME)
    return fileNameWithExtension

def get_file_location_from_s3(fileName):
    location = boto3.client('s3').get_bucket_location(Bucket=BUCKET_NAME)['LocationConstraint']
    return "https://%s.s3-%s.amazonaws.com/%s" % (BUCKET_NAME,location, fileName)

def lambda_handler(event, context):
    print("Received request: ")
    print(json.loads(event['body']))
    data = json.loads(event['body'])
    image = data['image']

    now = datetime.datetime.now()
    jobName = f'comprehend_job_{now:%Y-%m-%d-%H-%M}'

    try:
        fileNameWithExtension = save_to_s3(jobName, image)
        print(fileNameWithExtension)
        location = get_file_location_from_s3(fileNameWithExtension)
        print(location)
        response = {
            "statusCode": 200,
            "body": json.dumps( {"Status": "Success"} )
        }
        return response
    except Exception as e:
        print("Exception when saving image to S3 bucket: " + BUCKET_NAME)
        print(e)
        response = {
            "statusCode": 500,
            "body": json.dumps( {"Status": "Failed"} )
        }
        return response