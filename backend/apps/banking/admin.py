from django.contrib import admin
from django.contrib import messages
from .models import Account, Transaction

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('user', 'account_number', 'account_type', 'balance', 'status')
    search_fields = ('user__username', 'account_number')
    actions = ['deposit_money']

    def deposit_money(self, request, queryset):
        """Add $1000 to selected accounts and create transaction record"""
        for account in queryset:
            deposit_amount = 1000  # Change this amount as you wish
            account.balance += deposit_amount
            account.save()

            # Create transaction record
            Transaction.objects.create(
                to_account=account,
                amount=deposit_amount,
                transaction_type='DEPOSIT',
                status='COMPLETED',
                description='Admin deposit'
            )

        messages.success(request, f"✅ Successfully deposited ${deposit_amount} to selected accounts.")

    deposit_money.short_description = "Deposit $1000 to selected accounts"
