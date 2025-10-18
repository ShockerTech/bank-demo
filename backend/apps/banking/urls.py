from django.urls import path
from . import views

urlpatterns = [
    # Accounts
    path('accounts/', views.AccountListCreateView.as_view(), name='account-list'),
    path('accounts/<int:pk>/', views.AccountDetailView.as_view(), name='account-detail'),
    path('accounts/<int:account_id>/balance/', views.get_account_balance, name='account-balance'),
    # ADD THIS LINE FOR STATEMENT DOWNLOAD:
    path('accounts/<int:account_id>/statement/', views.download_statement, name='download-statement'),
    
    # Transactions
    path('transactions/', views.TransactionListView.as_view(), name='transaction-list'),
    path('transactions/transfer/', views.create_transfer, name='create-transfer'),
    path('transactions/recent/', views.get_recent_transactions, name='recent-transactions'),
    
    # Beneficiaries
    path('beneficiaries/', views.BeneficiaryListCreateView.as_view(), name='beneficiary-list'),
    path('beneficiaries/<int:pk>/', views.BeneficiaryDeleteView.as_view(), name='beneficiary-delete'),
]