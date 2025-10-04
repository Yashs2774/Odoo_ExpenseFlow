from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User, Company, Role
from .serializers import UserSerializer, MyTokenObtainPairSerializer, CompanySerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """
    Handles the creation of the first user (Admin) and their company.
    Subsequent signups are blocked.
    """
    if User.objects.exists():
        return Response(
            {'error': 'A company and admin already exist. New users must be created by an admin.'},
            status=status.HTTP_403_FORBIDDEN
        )

    data = request.data

    # Create Company
    company_data = {
        'name': data.get('company_name'),
        'base_currency_code': data.get('base_currency_code', 'USD'),
        'country': data.get('country')
    }
    company_serializer = CompanySerializer(data=company_data)
    if not company_serializer.is_valid():
        return Response(company_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    company = company_serializer.save()

    # Create Roles
    admin_role, _ = Role.objects.get_or_create(role_name='Admin')
    Role.objects.get_or_create(role_name='Manager')
    Role.objects.get_or_create(role_name='Employee')

    # Create Admin User
    user_data = {
        'email': data.get('email'),
        'name': data.get('name'),
        'password': data.get('password'),
        'company': company.id,
        'role': admin_role.id
    }

    try:
        user = User.objects.create_user(
            email=user_data['email'],
            name=user_data['name'],
            password=user_data['password'],
            company=company,
            role=admin_role,
            is_staff=True, # Admins can access the Django admin site
            is_superuser=True # For simplicity, first admin is superuser
        )
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Generate token and return response
    serializer = UserSerializer(user)
    token_serializer = MyTokenObtainPairSerializer.get_token(user)

    return Response({
        'user': serializer.data,
        'access': str(token_serializer.access_token),
        'refresh': str(token_serializer)
    }, status=status.HTTP_201_CREATED)


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Custom login view that uses the MyTokenObtainPairSerializer.
    """
    serializer_class = MyTokenObtainPairSerializer
