from rest_framework import serializers
from .models import Expense, ExpenseApproval

class ExpenseApprovalSerializer(serializers.ModelSerializer):
    approver_name = serializers.CharField(source='approver.username', read_only=True)

    class Meta:
        model = ExpenseApproval
        fields = ['id', 'approver', 'approver_name', 'status', 'comment', 'step_order', 'acted_at']


class ExpenseSerializer(serializers.ModelSerializer):
    approvals = ExpenseApprovalSerializer(many=True, read_only=True)
    user_details = serializers.SerializerMethodField()

    class Meta:
        model = Expense
        fields = [
            'id', 'user', 'user_details', 'company', 'category', 'description', 'amount', 'currency',
            'converted_amount', 'expense_date', 'status', 'remarks', 'rule', 'approvals',
            'created_at', 'updated_at'
        ]

    def get_user_details(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'email': obj.user.email
        }
