import boto3
from botocore.exceptions import ClientError

class BedrockService:
    def __init__(self, region_name='us-west-2'):
        self.client = boto3.client(service_name='bedrock-runtime', region_name=region_name)

    def chat_with_document(self, question, document_bytes=None, document_name=None):
        # Structure the conversation input as required by AWS
        conversation = [
            {
                "role": "user",
                "content": []
            }
        ]

        # print("document_bytes: ", document_bytes)
        print("document_name: ", document_name)
        # Add document info if provided
        if document_bytes and document_name:
            document_info = {
                "document": {
                    "name": document_name.replace('.pdf', ''),  # You can customize this if needed
                    "format": "pdf",
                    "source": {
                        "bytes": document_bytes
                    }
                }
            }
            conversation[0]["content"].append(document_info)

        # Add user message
        conversation[0]["content"].append({
            "text": question
        })

        print("conversation: ", conversation)

        # Define the chatbot configurations
        model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"
        inference_config = {
            "maxTokens": 2000,
            "stopSequences": [],
            "temperature": 0,
            "topP": 0.999
        }
        additional_model_request_fields = {
            "top_k": 250
        }

        try:
            # Call the converse API with additional configurations
            response = self.client.converse(
                messages=conversation,
                modelId=model_id,
                inferenceConfig=inference_config,
                additionalModelRequestFields=additional_model_request_fields
            )
            return response
        except ClientError as e:
            print(f"An error occurred: {e.response['Error']['Message']}")
            return None
