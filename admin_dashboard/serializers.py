from rest_framework import serializers
from core.models import User
from .models import ApprovalRule, ApprovalFlowStep

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'manager', 'company']
        read_only_fields = ['company']

class ApprovalFlowStepSerializer(serializers.ModelSerializer):
    approver_name = serializers.CharField(source='approver.username', read_only=True)

    class Meta:
        model = ApprovalFlowStep
        fields = ['id', 'approver', 'approver_name', 'step_order', 'is_required']


class ApprovalRuleSerializer(serializers.ModelSerializer):
    steps = ApprovalFlowStepSerializer(many=True, read_only=True)

    class Meta:
        model = ApprovalRule
        fields = [
            'id', 'name', 'description', 'is_manager_default_approver',
            'min_approval_percentage', 'created_at', 'steps'
        ]
