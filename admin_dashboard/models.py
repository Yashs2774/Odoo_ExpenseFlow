from django.db import models
from core.models import Company, User


class ApprovalRule(models.Model):
    """Defines the high-level approval rules set by an Admin."""
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_manager_default_approver = models.BooleanField(default=True, help_text="If true, the user's manager is automatically the first approver.")
    min_approval_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="e.g., 60.00. Percentage of approvers required to approve.")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class ApprovalFlowStep(models.Model):
    """Defines the individual steps and sequence for an approval rule."""
    rule = models.ForeignKey(ApprovalRule, on_delete=models.CASCADE, related_name='steps')
    approver_user = models.ForeignKey(User, on_delete=models.CASCADE, help_text="The user designated as an approver in this step.")
    step_order = models.PositiveIntegerField(help_text="The sequence of the approval, e.g., 1, 2, 3.")
    is_required = models.BooleanField(default=True)

    class Meta:
        ordering = ['step_order']
        unique_together = ('rule', 'step_order')

    def __str__(self):
        return f"{self.rule.name} - Step {self.step_order}: {self.approver_user.name}"
