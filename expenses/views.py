
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from core.models import User
from admin_dashboard.models import ApprovalRule, ApprovalFlowStep
from .models import Expense, ExpenseApproval
from .serializers import ExpenseSerializer
from django.db import transaction


# ✅ Create a new expense
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_expense(request):
    user = request.user
    if user.role not in ['Employee', 'Manager']:
        return Response({'error': 'Only employees or managers can create expenses.'}, status=status.HTTP_403_FORBIDDEN)

    data = request.data.copy() # Make a mutable copy
    data['user'] = user.id
    data['company'] = user.company.id

    # Find a matching rule
    # This is a simplified logic. You might want a more sophisticated way to match rules.
    rule = ApprovalRule.objects.filter(company=user.company).first()
    if rule:
        data['rule'] = rule.id

    serializer = ExpenseSerializer(data=data)
    if serializer.is_valid():
        expense = serializer.save()

        # If a rule is applied, create the approval steps
        if expense.rule:
            if expense.rule.is_manager_default_approver:
                if user.manager:
                    ExpenseApproval.objects.create(expense=expense, approver=user.manager, step_order=1)
            else:
                steps = ApprovalFlowStep.objects.filter(rule=expense.rule).order_by('step_order')
                for step in steps:
                    ExpenseApproval.objects.create(expense=expense, approver=step.approver, step_order=step.step_order)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Employee submits an expense
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_expense(request, expense_id):
    try:
        expense = Expense.objects.get(id=expense_id, user=request.user)
    except Expense.DoesNotExist:
        return Response({'error': 'Expense not found.'}, status=status.HTTP_404_NOT_FOUND)

    if expense.status != 'Draft':
        return Response({'error': 'Only draft expenses can be submitted.'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if there are any approvers
    if not expense.approvals.exists():
        return Response({'error': 'This expense has no approval flow. Please contact an admin.'}, status=status.HTTP_400_BAD_REQUEST)

    expense.status = 'Pending'
    expense.save()

    serializer = ExpenseSerializer(expense)
    return Response(serializer.data, status=status.HTTP_200_OK)



# ✅ Approver approves/rejects an expense
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def act_on_expense(request, expense_id):
    user = request.user
    action = request.data.get('action')
    comment = request.data.get('comment', '')

    try:
        approval = ExpenseApproval.objects.get(expense_id=expense_id, approver=user)
    except ExpenseApproval.DoesNotExist:
        return Response({'error': 'No approval record found for you.'}, status=404)

    if approval.status != 'Pending':
        return Response({'error': 'You already acted on this expense.'}, status=400)

    with transaction.atomic():
        approval.status = 'Approved' if action == 'approve' else 'Rejected'
        approval.comment = comment
        approval.save()

        # Check if all required approvals are done
        expense = approval.expense
        approvals = expense.approvals.all()

        if any(a.status == 'Rejected' for a in approvals):
            expense.status = 'Rejected'
        elif all(a.status == 'Approved' for a in approvals):
            expense.status = 'Approved'

        expense.save()

    serializer = ExpenseSerializer(expense)
    return Response(serializer.data, status=200)


# ✅ Get expenses visible to the user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_expenses(request):
    user = request.user
    if user.role == 'Admin':
        expenses = Expense.objects.filter(company=user.company)
    elif user.role == 'Manager':
        team_ids = list(user.team_members.values_list('id', flat=True))
        expenses = Expense.objects.filter(user_id__in=team_ids + [user.id])
    else:
        expenses = Expense.objects.filter(user=user)

    serializer = ExpenseSerializer(expenses, many=True)
    return Response(serializer.data, status=200)
