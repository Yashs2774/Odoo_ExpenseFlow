from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_expenses, name='list_expenses'),
    path('create/', views.create_expense, name='create_expense'),
    path('<int:expense_id>/submit/', views.submit_expense, name='submit_expense'),
    path('<int:expense_id>/action/', views.act_on_expense, name='act_on_expense'),
]
