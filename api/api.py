from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from PyPDF2 import PdfReader
import os
import uuid

from dotenv import load_dotenv

from utils.smart_search import SmartResearcher
load_dotenv()

api_key = os.getenv('OPENAI_API_KEY')

app = Flask(__name__)
CORS(app)

# Ensure 'chats' directory exists
if not os.path.exists('chats'):
    os.makedirs('chats')

@app.route('/api/upload', methods=['POST'])
def upload_pdf():
    files = request.files.getlist('files')
    if not files:
        return jsonify({'error': 'No files provided'}), 400

    # Generate a unique chat code/id
    chat_id = str(uuid.uuid4())

    all_text = ""

    # Process each file
    for pdf_file in files:
        pdf_reader = PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        all_text += text

    # Split text
    chunks = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    ).split_text(text=all_text)

    # Save embeddings to a uniquely named file
    store_name = f"chats/{chat_id}.faiss"
    embeddings = OpenAIEmbeddings(api_key=api_key)
    vector_store = FAISS.from_texts(chunks, embedding=embeddings)
    vector_store.save_local(store_name)

    # Return the chat code/id to the frontend
    return jsonify({'chat_id': chat_id})

@app.route('/api/search', methods=['POST'])
def search_domain():
    data = request.json
    print('data: ', data)
    domain = data.get('domain')
    print(domain)
    if not domain:
        return jsonify({'error': 'No domain provided'}), 400

    # Fetch website data

    searcher = SmartResearcher(mode='search')
    url = "https://" + domain
    print('url to search: ', url)
    paragraphs = searcher.digest_article(url)

    print('paragraphs: ', paragraphs)

    # Generate a unique chat code/id
    chat_id = str(uuid.uuid4())

    all_text = ""

    for p in paragraphs:
        text = p.text.strip()
        if text:
            all_text += text
    
    # # Process each file
    # for pdf_file in files:
    #     pdf_reader = PdfReader(pdf_file)
    #     text = ""
    #     for page in pdf_reader.pages:
    #         text += page.extract_text()
    #     all_text += text

    # Split text
    chunks = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    ).split_text(text=all_text)

    # Save embeddings to a uniquely named file
    store_name = f"chats/{chat_id}.faiss"
    embeddings = OpenAIEmbeddings(api_key=api_key)
    vector_store = FAISS.from_texts(chunks, embedding=embeddings)
    vector_store.save_local(store_name)

    # Return the chat code/id to the frontend
    return jsonify({'chat_id': chat_id})


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json  # Use request.json to get the JSON payload
    chat_id = data.get('chat_id')
    question = data.get('question')

    if not chat_id or not question:
        return jsonify({'error': 'Chat ID and question are required'}), 400

    # Load the vector store using the chat_id
    store_name = f"chats/{chat_id}.faiss"
    if not os.path.exists(store_name):
        return jsonify({'error': 'Vector store not found for the given chat ID'}), 404

    try:
        vector_store = FAISS.load_local(store_name, embeddings=OpenAIEmbeddings(), allow_dangerous_deserialization=True)
    except ValueError as e:
        return jsonify({'error': str(e)}), 500

    # Perform similarity search
    docs = vector_store.similarity_search(query=question, k=3)

    # Answer the question
    llm = OpenAI()  # Initialize OpenAI model
    chain = load_qa_chain(llm=llm, chain_type="stuff")
    response = chain.run(input_documents=docs, question=question)

    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True, port=9999)
