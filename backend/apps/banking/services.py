from django.db import transaction
from django.utils import timezone
from decimal import Decimal
from .models import Account, Transaction
from rest_framework.exceptions import ValidationError

class BankingService:
    
    @staticmethod
    @transaction.atomic
    def create_transfer(from_account_id, to_account_number, amount, description='', user=None):
        """
        Create and execute a transfer between accounts
        """
        try:
            # Get source account
            from_account = Account.objects.select_for_update().get(id=from_account_id)
            
            # Verify ownership
            if user and from_account.user != user:
                raise ValidationError("You don't have permission to transfer from this account")
            
            # Check account status
            if from_account.status != 'ACTIVE':
                raise ValidationError("Source account is not active")
            
            # Check balance
            if from_account.balance < amount:
                raise ValidationError("Insufficient funds")
            
            # Get destination account
            try:
                to_account = Account.objects.select_for_update().get(account_number=to_account_number)
            except Account.DoesNotExist:
                raise ValidationError("Destination account not found")
            
            # Check destination account status
            if to_account.status != 'ACTIVE':
                raise ValidationError("Destination account is not active")
            
            # Cannot transfer to same account
            if from_account.id == to_account.id:
                raise ValidationError("Cannot transfer to the same account")
            
            # Create transaction
            txn = Transaction.objects.create(
                from_account=from_account,
                to_account=to_account,
                amount=amount,
                transaction_type='TRANSFER',
                description=description,
                status='PENDING'
            )
            
            # Execute transfer
            from_account.balance -= amount
            to_account.balance += amount
            
            from_account.save()
            to_account.save()
            
            # Mark transaction as completed
            txn.status = 'COMPLETED'
            txn.completed_at = timezone.now()
            txn.save()
            
            return txn
            
        except Account.DoesNotExist:
            raise ValidationError("Account not found")
        except Exception as e:
            raise ValidationError(str(e))
    
    @staticmethod
    @transaction.atomic
    def create_deposit(account_id, amount, description=''):
        """
        Deposit money into an account (for demo purposes)
        """
        try:
            account = Account.objects.select_for_update().get(id=account_id)
            
            if account.status != 'ACTIVE':
                raise ValidationError("Account is not active")
            
            # Create transaction
            txn = Transaction.objects.create(
                to_account=account,
                amount=amount,
                transaction_type='DEPOSIT',
                description=description,
                status='PENDING'
            )
            
            # Update balance
            account.balance += amount
            account.save()
            
            # Mark transaction as completed
            txn.status = 'COMPLETED'
            txn.completed_at = timezone.now()
            txn.save()
            
            return txn
            
        except Account.DoesNotExist:
            raise ValidationError("Account not found")