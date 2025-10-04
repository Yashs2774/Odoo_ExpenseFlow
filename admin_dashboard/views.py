from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from core.models import User
from .serializers import AdminUserSerializer
from .models import ApprovalRule, ApprovalFlowStep
from .serializers import ApprovalRuleSerializer, ApprovalFlowStepSerializer

# Helper to ensure only Admins can access
def is_admin(user):
    return user.role == 'Admin'


# ✅ List all users in the Admin’s company
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    if not is_admin(request.user):
        return Response({'error': 'Only Admins can view users.'}, status=403)

    users = User.objects.filter(company=request.user.company)
    serializer = AdminUserSerializer(users, many=True)
    return Response(serializer.data, status=200)


# ✅ Create a new user (Manager or Employee)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user(request):
    if not is_admin(request.user):
        return Response({'error': 'Only Admins can create users.'}, status=403)

    data = request.data
    role = data.get('role', 'Employee')

    if role == 'Admin':
        return Response({'error': 'Cannot create another Admin user.'}, status=400)

    # Hash the password before creating the user
    from django.contrib.auth.hashers import make_password
    hashed_password = make_password(data.get('password'))

    new_user = User.objects.create(
        username=data.get('username'),
        email=data.get('email'),
        role=role,
        company=request.user.company,
        manager_id=data.get('manager_id'),
        password=hashed_password
    )

    serializer = AdminUserSerializer(new_user)
    return Response(serializer.data, status=201)


# ✅ Delete a user from the same company
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    if not is_admin(request.user):
        return Response({'error': 'Only Admins can delete users.'}, status=403)

    try:
        user = User.objects.get(id=user_id, company=request.user.company)
    except User.DoesNotExist:
        return Response({'error': 'User not found or not in your company.'}, status=404)

    if user.role == 'Admin':
        return Response({'error': 'Cannot delete Admin accounts.'}, status=400)

    user.delete()
    return Response({'message': 'User deleted successfully.'}, status=200)


# ✅ List all approval rules for the admin’s company
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_approval_rules(request):
    if request.user.role != 'Admin':
        return Response({'error': 'Only Admins can view approval rules.'}, status=403)

    rules = ApprovalRule.objects.filter(company=request.user.company)
    serializer = ApprovalRuleSerializer(rules, many=True)
    return Response(serializer.data, status=200)


# ✅ Create a new approval rule
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_approval_rule(request):
    if request.user.role != 'Admin':
        return Response({'error': 'Only Admins can create approval rules.'}, status=403)

    data = request.data
    rule = ApprovalRule.objects.create(
        company=request.user.company,
        name=data.get('name'),
        description=data.get('description', ''),
        is_manager_default_approver=data.get('is_manager_default_approver', True),
        min_approval_percentage=data.get('min_approval_percentage')
    )

    # Optional: Add approval steps if provided
    steps_data = data.get('steps', [])
    for step in steps_data:
        approver_id = step.get('approver')
        step_order = step.get('step_order')
        is_required = step.get('is_required', True)
        ApprovalFlowStep.objects.create(
            rule=rule,
            approver_id=approver_id,
            step_order=step_order,
            is_required=is_required
        )

    serializer = ApprovalRuleSerializer(rule)
    return Response(serializer.data, status=201)


# ✅ Update an existing approval rule
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_approval_rule(request, rule_id):
    if request.user.role != 'Admin':
        return Response({'error': 'Only Admins can update approval rules.'}, status=403)

    try:
        rule = ApprovalRule.objects.get(id=rule_id, company=request.user.company)
    except ApprovalRule.DoesNotExist:
        return Response({'error': 'Rule not found.'}, status=404)

    data = request.data
    rule.name = data.get('name', rule.name)
    rule.description = data.get('description', rule.description)
    rule.is_manager_default_approver = data.get('is_manager_default_approver', rule.is_manager_default_approver)
    rule.min_approval_percentage = data.get('min_approval_percentage', rule.min_approval_percentage)
    rule.save()

    # Update or create approval steps if provided
    if not rule.is_manager_default_approver and 'steps' in data:
        # Remove existing steps
        rule.steps.all().delete()

        # Add new steps
        steps_data = data.get('steps', [])
        for step in steps_data:
            approver_id = step.get('approver')
            step_order = step.get('step_order')
            is_required = step.get('is_required', True)
            ApprovalFlowStep.objects.create(
                rule=rule,
                approver_id=approver_id,
                step_order=step_order,
                is_required=is_required
            )

    serializer = ApprovalRuleSerializer(rule)
    return Response(serializer.data, status=200)


# ✅ Delete a rule
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_approval_rule(request, rule_id):
    if request.user.role != 'Admin':
        return Response({'error': 'Only Admins can delete approval rules.'}, status=403)

    try:
        rule = ApprovalRule.objects.get(id=rule_id, company=request.user.company)
    except ApprovalRule.DoesNotExist:
        return Response({'error': 'Rule not found.'}, status=404)

    rule.delete()
    return Response({'message': 'Approval rule deleted successfully.'}, status=200)
