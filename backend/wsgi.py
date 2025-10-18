import os
from django.core.wsgi import get_wsgi_application

# Set the Django settings module to use the correct one
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()
