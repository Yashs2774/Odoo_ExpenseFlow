from rest_framework import serializers
from .models import User, Company, Role
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'role_name']

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'base_currency_code', 'country']

class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    company = CompanySerializer(read_only=True)
    manager = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role', 'company', 'manager', 'is_active']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['name'] = user.name
        if user.role:
            token['role'] = user.role.role_name
        if user.company:
            token['company_id'] = user.company.id
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add user data to the response
        data['user'] = UserSerializer(self.user).data
        return data
