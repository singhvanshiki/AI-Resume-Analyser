from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import get_settings

settings = get_settings()
RATE_LIMIT = f"{settings.rate_limit_per_minute}/minute"
limiter = Limiter(key_func=get_remote_address, default_limits=[RATE_LIMIT])
