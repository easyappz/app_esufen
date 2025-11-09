# Note: Project-level config/urls.py includes path('api/', include('api.urls')).
# If this is not present, the routes below will not be reachable under /api/.
from django.urls import path
from .views import HelloView, RegisterView, LoginView, RefreshView, MeView

urlpatterns = [
    path("hello/", HelloView.as_view(), name="hello"),

    # Auth endpoints
    path("auth/register", RegisterView.as_view(), name="auth-register"),
    path("auth/login", LoginView.as_view(), name="auth-login"),
    path("auth/refresh", RefreshView.as_view(), name="auth-refresh"),
    path("auth/me", MeView.as_view(), name="auth-me"),
]
