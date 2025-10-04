from django.contrib import admin
from .models import ApprovalRule, ApprovalFlowStep
# Register your models here.
admin.site.register(ApprovalRule)
admin.site.register(ApprovalFlowStep)
