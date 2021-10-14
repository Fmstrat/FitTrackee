from datetime import timedelta
from typing import Optional, Union


def convert_km_to_m(value: str) -> float:
    ret = round(value * 0.62137119223733, 2) if value else None
    return ret
