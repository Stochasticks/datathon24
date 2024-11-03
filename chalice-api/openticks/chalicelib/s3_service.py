import boto3
import uuid
import os

class S3Service:
    def __init__(self, bucket_name):
        self.s3_client = boto3.client('s3')
        self.bucket_name = bucket_name

    def upload_file(self, file_data, content_type):
        # Generate a unique file name
        file_name = f"{uuid.uuid4()}.pdf"
        
        # Upload the file to S3
        self.s3_client.put_object(
            Bucket=self.bucket_name,
            Key=file_name,
            Body=file_data,
            ContentType=content_type
        )

        # Return the S3 file URL
        return f"s3://{self.bucket_name}/{file_name}"
