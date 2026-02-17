from django import template
from django.utils.safestring import mark_safe
import re

register = template.Library()

@register.filter
def highlight(text, query):
    if not query or not text:
        return text
    
    regex = re.compile(re.escape(query), re.IGNORECASE)
    highlighted = regex.sub(f'<span class="highlight">\\g<0></span>', str(text))
    return mark_safe(highlighted)

@register.filter(name='contains')
def contains(value, arg):
    return arg.lower() in value.lower()