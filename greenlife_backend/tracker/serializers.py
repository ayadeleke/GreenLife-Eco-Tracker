from rest_framework import serializers
from .models import TreeEntry
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
import re

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={"input_type": "password"},
    )
    confirm_password = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )  # confirm password

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "username",
            "email",
            "password",
            "confirm_password",
        )

    # Validate and create user
    def validate(self, attrs):
        username = attrs.get("username")
        email = attrs.get("email")
        password = attrs.get("password")
        confirm_password = attrs.get("confirm_password")

        errors = {}

        # Duplicate checks
        if User.objects.filter(username=username).exists():
            errors["username"] = "A user with that username already exists."

        if User.objects.filter(email=email).exists():
            errors["email"] = "A user with that email already exists."

        # Password checks
        password_errors = []

        if password != confirm_password:
            password_errors.append("Passwords do not match.")
        if len(password) < 8:
            password_errors.append("Password must be at least 8 characters long.")
        if not re.search(r"[A-Za-z]", password):
            password_errors.append("Password must include at least one letter.")
        if not re.search(r"\d", password):
            password_errors.append("Password must include at least one number.")
        if not re.search(r"[^A-Za-z0-9]", password):
            password_errors.append("Password must include at least one symbol.")

        if password_errors:
            errors["password"] = password_errors

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    # Create user instance
    def create(self, validated_data):
        user = User.objects.create(
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            username=validated_data["username"],
            email=validated_data["email"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "username", "email")


class TreeEntrySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = TreeEntry
        fields = "__all__"
        read_only_fields = ["user", "created_at"]

    def validate(self, attrs):
        latitude = attrs.get("latitude")
        longitude = attrs.get("longitude")
        if latitude is not None and not (-90 <= latitude <= 90):
            raise serializers.ValidationError("Latitude must be between -90 and 90.")
        if longitude is not None and not (-180 <= longitude <= 180):
            raise serializers.ValidationError("Longitude must be between -180 and 180.")
        request = self.context.get("request")
        user = request.user if request else None
        species = attrs.get("species")
        latitude = attrs.get("latitude")
        longitude = attrs.get("longitude")
        date_planted = attrs.get("date_planted")

        if (
            user
            and TreeEntry.objects.filter(
                user=user,
                species=species,
                latitude=latitude,
                longitude=longitude,
                date_planted=date_planted,
            ).exists()
        ):
            raise serializers.ValidationError(
                "You have already added a tree of this species"
                "at this location on this date."
            )
        return attrs
