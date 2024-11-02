import csv
import json
import os
import uuid
import tempfile
import requests
from bs4 import BeautifulSoup
import time

from dotenv import load_dotenv
from openai import OpenAI

from utils.openai_utils import OpenAiHandler
from utils.log_utils import log_time

load_dotenv()

api_key = os.getenv('OPENAI_API_KEY')


class SmartResearcher:
    def __init__(self, topic='', insights='', mode='QA'):
        self.mode = mode
        if mode == 'QA':
            self.topic = topic
            self.insights = insights
            self.openai_handler = OpenAiHandler()
            self.assistant = self.openai_handler.create_simple_assistant("You are a research assistant responsible of helping users in their internet research.",
                                                    "The user provides a topic and key insights or questions, your task is to analyze web pages found on the internet and extract relevant information to the topic and insights as quotes. Once all quotes are extracted, provide a summary of what you learned through the article. Everything should be in json.",
                                                    {"type": "json_object"},
                                                    "gpt-4o"
                                                    )

    def digest_article(self, link):

        response = requests.get(link)
        print('response: ', response)
        soup = BeautifulSoup(response.text, "html.parser")

        @log_time("Batch send to OpenAI assistant")
        def batch_send_paragraphs(paragraphs, thread_id, batch_size):
            """Send paragraphs in batches to OpenAI handler."""
            print("batching")
            contents = []
            batch = []

            for p in paragraphs:
                text = p.text.strip()
                if text:
                    batch.append(text)
                    contents.append(text)

                    # When batch size is reached, send the batch
                    if len(batch) >= batch_size:
                        self._send_batch(thread_id, batch)
                        batch.clear()  # Clear the batch after sending

            # Send any remaining paragraphs if the batch is not empty
            if batch:
                self._send_batch(thread_id, batch)

            return contents

        paragraphs = soup.find_all('p')
        if self.mode != 'QA':
            return paragraphs
        thread = self.openai_handler.thread()
        self.openai_handler.post_message(thread.id, f"topic: {self.topic}, insights: {self.insights}")
        batch_send_paragraphs(paragraphs, thread.id, 10)
        result = self.openai_handler.query_assistant(thread.id, self.assistant.id)
        print(result)

    def _send_batch(self, thread_id, batch):
        """Helper function to send a batch of paragraphs as a single message."""
        message_content = "\n\n".join(batch)  # Combine paragraphs with line breaks
        self.openai_handler.post_message(thread_id, message_content)


if __name__ == "__main__":
    searcher = SmartResearcher("Monetisation of browser extensions", ["ways to monetize browser extensions", "how much cash flow to expect", "process to get validated on stores", "how many users would pay"])
    searcher.digest_article("https://www.codefuel.com/blog/how-to-monetize-your-browser-extension/")