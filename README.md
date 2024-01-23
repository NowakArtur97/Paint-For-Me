# Paint-For-Me

## Table of Contents

- [General info](#general-info)
- [Features](#features)
- [Built With](#built-with)
- [Status](#status)

## General info

AWS CloudFormation template for creating resources for a static website on an S3 bucket with an application for painting drawings according to the selected topic, where it is checked whether the drawing coincides with the topic using Amazon Rekognition image analysis.

## Features

- Painting on canvas
- Changing the color of the brush
- Changing the size of the brush
- Cleaning the canvas
- Selecting a random topic to paint from a pool of topics
- Automatic copying of website files from the GitHub repository to the S3 bucket
- Replacing the API invoke URL in the JS script with the address from the API gateway
- Saving drawings in the S3 bucket
- Performing analysis through Amazon Rekognition on a image
- Returning Amazon Rekognition response using lambda function and API gateway
- Automatic cleaning of S3 buckets after deleting a CloudFormation template
- Collecting logs from the lambda functions

## Built With

CloudFormation resources:

- S3 Buckets
- Bucket Policy
- IAM Roles
- Lambda Permission
- Lambda Functions
- CloudFormation Custom Resources
- API Gateway Deployment
- API Gateway Stage
- API Gateway Rest API
- API Gateway Resource
- API Gateway Method

## Status

Project is: finished
