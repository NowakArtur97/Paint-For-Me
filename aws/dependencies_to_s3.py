import os
import urllib.request
import boto3
from urllib.parse import urlparse
import cfnresponse

s3 = boto3.resource('s3')
BUCKET = os.environ['BUCKET_NAME']
DEPENDENCIES_URL = os.environ['DEPENDENCIES_URL']

def save_to_local(url):
    urlPath = urlparse(url).path
    fileName = os.path.basename(urlPath)
    filePath = '/tmp/' + fileName
    urllib.request.urlretrieve(url, filePath)
    return filePath

def copy_to_s3(url):
    filePath = save_to_local(url)
    fileName = os.path.basename(filePath)
    s3.meta.client.upload_file(filePath, BUCKET, fileName)
    s3.Object(BUCKET, fileName).put(Body=open(filePath, 'rb'), ContentType="application/zip")

def lambda_handler(event, context):
    responseData = {}
    requestType = event['RequestType']
    try:
        if requestType == 'Create':
            copy_to_s3(DEPENDENCIES_URL)
            print("Successfully copied file from url: " + DEPENDENCIES_URL + " to bucket: " + BUCKET)
        cfnresponse.send(event, context, cfnresponse.SUCCESS, responseData)
    except Exception as e:
        print("Exception")
        print(e)
        cfnresponse.send(event, context, cfnresponse.FAILED, responseData)