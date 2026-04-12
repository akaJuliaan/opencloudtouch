"""Entry point for running opencloudtouch as module."""

import uvicorn

from opencloudtouch.core.config import get_config
from opencloudtouch.main import app

if __name__ == "__main__":
    cfg = get_config()
    uvicorn.run(app, host=cfg.host, port=cfg.port)  # nosec B104
