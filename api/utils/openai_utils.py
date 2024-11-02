import json
import os
from enum import EnumType

import openai
from dotenv import load_dotenv
from openai import OpenAI
load_dotenv()

api_key = os.getenv('OPENAI_API_KEY')


class OpenAiHandler:
    # client = OpenAI(api_key=api_key)

    def __init__(self) -> None:
        print('===OpenAiHandler init===')

        self.client = OpenAI(api_key=api_key)
        # self.is_api_key_valid()

    def is_api_key_valid(self):
        try:
            print('===testing api key===')
            # time.sleep(2)
            response = openai.completions.create(
                model='davinci-002',
                prompt="This is a test.",
                max_tokens=5
            )
            print('response: ', response)
        except openai.AuthenticationError as e :
            print(e)
            self.valid_key=False
        else:
            self.valid_key=True

    def thread(self):
        return self.client.beta.threads.create()


    def query_assistant(self, thread_id, assistant_id, instructions=None):
        run = self.client.beta.threads.runs.create_and_poll(thread_id=thread_id,
                                                            assistant_id=assistant_id,
                                                            instructions=instructions
                                                            )
        if run.status == 'completed':
            messages = self.client.beta.threads.messages.list(
                thread_id=thread_id
            )
            return messages.data[0].content[0].text.value
        else:
            raise Exception(run.last_error.message)

    def load_task_handler(self, config_path):
        with open(config_path) as f:
            config = json.load(f)
            instructions_path = config["general_instructions_file"]
            with open(instructions_path) as instructions_file:
                return self.client.beta.assistants.create(
                    description=config['assistant_description'],
                    instructions=instructions_file.read(),
                    response_format=config['response_format'],
                    model=config["model"])

    def create_simple_assistant(self, description, instructions, response_format, model):
        return self.client.beta.assistants.create(
            description=description,
            instructions=instructions,
            response_format=response_format,
            model=model)

    def load_task_handler_advanced(self, config_path, resources):
        current_dir = os.getcwd()  # Get the current working directory
        print("==========================================================Current Working Directory:", current_dir)
        with open(config_path) as f:
            config = json.load(f)
            instructions_path = config["general_instructions_file"]
            with open(instructions_path) as instructions_file:
                return self.client.beta.assistants.create(
                    description=config['assistant_description'],
                    instructions=instructions_file.read(),
                    model=config["model"],
                    tools=config["tools"],
                    tool_resources=resources
                )

    def post_message(self, thread_id, data):
        self.client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=data
        )

    def post_file(self, binary_content, purpose='assistants'):
        return self.client.files.create(
            file=binary_content,
            purpose='assistants'
        ).id