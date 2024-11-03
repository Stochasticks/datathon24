from chalice import Chalice, Response
from chalicelib.bedrock_service import BedrockService

app = Chalice(app_name='openticks')
bedrock_service = BedrockService(region_name='us-west-2')


@app.route('/api/chat', methods=['POST'], cors=True)
def chat_with_document():
    request = app.current_request
    # print(f"Request Headers: {request.headers}")
    # print(f"Request Body: {request.json_body.keys()}")

    question = request.json_body.get('question')
    # print(question)

    if 'files' in request.json_body.keys():
        file_data = request.json_body.get('files')
        file_name = request.json_body.get('file_name')
        
    else:
        file_data = None

    if not question:
        return Response(body={"error": "Missing 'chat_id' or 'question'"},
                        status_code=400)

    # Call the service function with the provided parameters
    response = bedrock_service.chat_with_document(question, file_data, file_name)
    print("response: ", response)

    if response:
        return {"message": "Chat processed successfully", "response": response}
    else:
        return Response(body={"error": "Failed to process chat"},
                        status_code=500)



# @app.route('/upload', methods=['POST'], content_types=['multipart/form-data'])
# def upload_document():
#     request = app.current_request

#     # Get the chat_id from query parameters
#     chat_id = request.query_params.get('chat_id')  # Get chat_id from query parameters

#     # Get the user message from the request body
#     user_message = request.json_body.get('message')  # Extract message from JSON body

#     # Get the uploaded file
#     file = request.raw_body if request.raw_body else None  # Use raw_body to access the file if present
#     document_format = "pdf"  # You can determine the format dynamically based on the uploaded file
#     document_name = "Document 1"  # Default or dynamic naming for the document

#     if not user_message or not chat_id:
#         return Response(body={"error": "Missing message or 'chat_id'"},
#                         status_code=400)

#     # Create an instance of your BedrockService
#     bedrock_service = BedrockService()

#     # Call chat_with_document; pass None for the document if not uploaded
#     response = bedrock_service.chat_with_document(chat_id, user_message, file, document_name, document_format)

#     if response:
#         return {"message": "Chat processed successfully", "response": response}
#     else:
#         return Response(body={"error": "Failed to process chat"},
#                         status_code=500)
    

# @app.route('/chat', methods=['POST'])
# def chat_with_document():
#     request = app.current_request
#     # Get chat_id and user_message from the JSON body
#     chat_id = request.json_body.get('chat_id')
#     user_message = request.json_body.get('user_message')
    
#     # Validate that chat_id and user_message are provided
#     if not chat_id or not user_message:
#         return Response(status_code=400, body={'error': 'chat_id and user_message are required.'})

#     # Create an instance of your BedrockService (make sure to define it)
#     bedrock_service = BedrockService()

#     # Call the chat_with_document method
#     response = bedrock_service.chat_with_document(chat_id, user_message)

#     # Return the response
#     return Response(status_code=200, body=response)
