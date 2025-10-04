
from django.db import models
from core.models import User, Company
from admin_dashboard.models import ApprovalRule

class Expense(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    category = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)
    converted_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    expense_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    remarks = models.TextField(blank=True, null=True)
    rule = models.ForeignKey(ApprovalRule, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.amount} {self.currency} ({self.status})"


class ExpenseApproval(models.Model):
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name='approvals')
    approver = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')], default='Pending')
    comment = models.TextField(blank=True, null=True)
    step_order = models.PositiveIntegerField(default=1)
    acted_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('expense', 'approver')

    def __str__(self):
        return f"{self.approver.username} - {self.status}"
