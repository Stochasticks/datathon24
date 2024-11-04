import boto3
from botocore.exceptions import ClientError

class BedrockService:
    def __init__(self, region_name='us-west-2'):
        self.client = boto3.client(service_name='bedrock-agent-runtime', region_name=region_name)

    def invoke_agent(self, agent_id, agent_alias_id, session_id, prompt):
        output_text = ""
        citations = []
        trace = {}

        try:
            response = self.client.invoke_agent(
                agentId=agent_id,
                agentAliasId=agent_alias_id,
                enableTrace=True,
                sessionId=session_id,
                inputText=prompt,
            )

            has_guardrail_trace = False
            for event in response.get("completion", []):
                # Combine the chunks to get the output text
                if "chunk" in event:
                    chunk = event["chunk"]
                    output_text += chunk["bytes"].decode()
                    if "attribution" in chunk:
                        citations += chunk["attribution"].get("citations", [])

                # Extract trace information from all events
                if "trace" in event:
                    for trace_type in ["guardrailTrace", "preProcessingTrace", "orchestrationTrace", "postProcessingTrace"]:
                        if trace_type in event["trace"]["trace"]:
                            mapped_trace_type = trace_type
                            if trace_type == "guardrailTrace":
                                if not has_guardrail_trace:
                                    has_guardrail_trace = True
                                    mapped_trace_type = "preGuardrailTrace"
                                else:
                                    mapped_trace_type = "postGuardrailTrace"
                            if mapped_trace_type not in trace:
                                trace[mapped_trace_type] = []
                            trace[mapped_trace_type].append(event["trace"]["trace"][trace_type])

        except ClientError as e:
            print(f"An error occurred: {e.response['Error']['Message']}")
            return None

        return {
            "output_text": output_text,
            "citations": citations,
            "trace": trace
        }

    def chat_with_document(self, session_id, question, document_bytes=None, document_name=None):
        # Construct the input text for the agent
        input_text = question
        
        # Call the invoke_agent method
        return self.invoke_agent(agent_id="HNQWJG3MP3", agent_alias_id="XXWAU1FAEJ", session_id=session_id, prompt=input_text)
