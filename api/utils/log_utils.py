import time
from functools import wraps


def log_time(custom_message="Function execution"):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            print(f"{custom_message}: Started at {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(start_time))}")

            result = func(*args, **kwargs)

            end_time = time.time()
            duration = end_time - start_time
            print(f"{custom_message}: Ended at {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(end_time))}")
            print(f"Duration: {duration:.2f} seconds")

            return result

        return wrapper

    return decorator