from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=200)
    timestamp = serializers.DateTimeField(read_only=True)


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name"]
        read_only_fields = ["id", "email"]


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    last_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    password = serializers.CharField(write_only=True, required=True, min_length=8)

    def validate_email(self, value: str) -> str:
        if not value:
            raise serializers.ValidationError("Email is required.")
        normalized = value.strip().lower()
        # Ensure uniqueness by email and username fields
        if User.objects.filter(username__iexact=normalized).exists() or User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return normalized

    def validate_password(self, value: str) -> str:
        if value is None or len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value

    def create(self, validated_data):
        email = validated_data.get("email")
        first_name = validated_data.get("first_name") or ""
        last_name = validated_data.get("last_name") or ""
        password = validated_data.get("password")

        user = User(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name,
        )
        user.set_password(password)
        user.save()
        return user


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Accepts {"email": ..., "password": ...} and maps email to username for authentication.
    """

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        if email is None:
            raise serializers.ValidationError({"email": "This field is required."})
        if password is None:
            raise serializers.ValidationError({"password": "This field is required."})
        # Map to 'username' expected by base serializer
        attrs = {
            "username": (email or "").strip().lower(),
            "password": password,
        }
        return super().validate(attrs)
