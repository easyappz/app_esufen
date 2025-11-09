from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import (
    MessageSerializer,
    RegisterSerializer,
    UserSerializer,
    EmailTokenObtainPairSerializer,
)


class HelloView(APIView):
    """
    A simple API endpoint that returns a greeting message.
    """

    @extend_schema(
        responses={200: MessageSerializer}, description="Get a hello world message"
    )
    def get(self, request):
        data = {"message": "Hello!", "timestamp": timezone.now()}
        serializer = MessageSerializer(data)
        return Response(serializer.data)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=RegisterSerializer, responses={201: UserSerializer})
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = EmailTokenObtainPairSerializer


class RefreshView(TokenRefreshView):
    permission_classes = [AllowAny]


class MeView(APIView):
    """
    GET: Return current user profile.
    PUT/PATCH: Update first_name and last_name only.
    Uses per-request JWT authentication (no global settings).
    """

    def _authenticate(self, request):
        auth = JWTAuthentication()
        try:
            user_auth = auth.authenticate(request)
        except Exception:
            return None
        if user_auth is None:
            return None
        user, _token = user_auth
        request.user = user
        return user

    @extend_schema(responses={200: UserSerializer})
    def get(self, request):
        user = self._authenticate(request)
        if user is None:
            return Response({"detail": "Authentication credentials were not provided or are invalid."}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(UserSerializer(user).data)

    @extend_schema(request=UserSerializer, responses={200: UserSerializer})
    def put(self, request):
        user = self._authenticate(request)
        if user is None:
            return Response({"detail": "Authentication credentials were not provided or are invalid."}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = UserSerializer(user, data=request.data, partial=False)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data)

    @extend_schema(request=UserSerializer, responses={200: UserSerializer})
    def patch(self, request):
        user = self._authenticate(request)
        if user is None:
            return Response({"detail": "Authentication credentials were not provided or are invalid."}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data)
