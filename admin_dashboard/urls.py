from django.urls import path
from . import views


urlpatterns = [
    # User Management
    path('users/', views.list_users, name='list_users'),
    path('users/create/', views.create_user, name='create_user'),
    path('users/<int:user_id>/delete/', views.delete_user, name='delete_user'),

    # Approval Rules
    path('rules/', views.list_approval_rules, name='list_approval_rules'),
    path('rules/create/', views.create_approval_rule, name='create_approval_rule'),
    path('rules/<int:rule_id>/update/', views.update_approval_rule, name='update_approval_rule'),
    path('rules/<int:rule_id>/delete/', views.delete_approval_rule, name='delete_approval_rule'),

]
