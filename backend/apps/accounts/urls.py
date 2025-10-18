from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

app_name = 'accounts'

urlpatterns = [
    # 🔐 Authentication
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 👤 User management
    path('profile/', views.get_user_profile, name='get_user_profile'),
    path('profile/update/', views.update_profile, name='update_profile'),

    # 🖼️ PROFILE PICTURE ROUTES - ADD THESE 2 LINES
    path('profile/upload-picture/', views.upload_profile_picture, name='upload-profile-picture'),
    path('profile/delete-picture/', views.delete_profile_picture, name='delete-profile-picture'),
]