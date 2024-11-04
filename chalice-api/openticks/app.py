import base64
from chalice import Chalice, Response, CORSConfig
from chalicelib.bedrock_service import BedrockService

app = Chalice(app_name='openticks')
bedrock_service = BedrockService(region_name='us-west-2')


cors_config = CORSConfig(
    allow_origin="*",
    # allow_credentials=True,
    allow_headers = ["Content-Type", "X-Special-Header"],
    # allow_methods = ["POST", "GET", "OPTIONS"],
)

# @app.route('/')
# def index():
#     return {'hello': 'world'}

@app.route('/chat', methods=['POST'], cors=cors_config)
def chat_with_document():
    request = app.current_request
    # print(f"Request Headers: {request.headers}")
    # print(f"Request Body: {request.json_body.keys()}")

    question = request.json_body.get('question')
    # print(question)

    file_bytes = None
    file_name = None

    if 'files' in request.json_body.keys():
        if request.json_body.get('files'):
            file_data = request.json_body.get('files')

            print(file_data)
        
            # If file_data is a list, join it into a single base64 string
            if isinstance(file_data, list):
                file_data = "".join(map(str, file_data))
            
            # Add padding if necessary
            padding_needed = len(file_data) % 4
            if padding_needed:
                file_data += '=' * (4 - padding_needed)

            file_bytes = base64.b64decode(file_data)
            file_name = request.json_body.get('file_name')
         

    if not question:
        return Response(body={"error": "Missing 'chat_id' or 'question'"},
                        status_code=400)

    # Call the service function with the provided parameters
    response = bedrock_service.chat_with_document(question, file_bytes, file_name)
    print("response: ", response)

    if response:
        return {"message": "Chat processed successfully", "response": response}
    else:
        return Response(body={"error": "Failed to process chat"},
                        status_code=500)

