import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from apps.banking.models import Account, Transaction
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta

# Get or create test user
try:
    user = User.objects.get(username='testuser')
except User.DoesNotExist:
    user = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='test123',
        first_name='Test',
        last_name='User'
    )
    print("✅ Created test user")

# Delete existing accounts for this user
Account.objects.filter(user=user).delete()

# Create new accounts
account1 = Account.objects.create(
    user=user,
    account_type='CHECKING',
    balance=Decimal('5000.00')
)

account2 = Account.objects.create(
    user=user,
    account_type='SAVINGS',
    balance=Decimal('15000.00')
)

print(f"\n✅ Accounts created successfully!")
print(f"\nAccount 1:")
print(f"  ID: {account1.id}")
print(f"  Type: {account1.account_type}")
print(f"  Number: {account1.account_number}")
print(f"  Balance: ${account1.balance}")

print(f"\nAccount 2:")
print(f"  ID: {account2.id}")
print(f"  Type: {account2.account_type}")
print(f"  Number: {account2.account_number}")
print(f"  Balance: ${account2.balance}")

# Create some sample transactions
print("\n📝 Creating sample transactions...")

# Deposit to account 1
txn1 = Transaction.objects.create(
    to_account=account1,
    amount=Decimal('1000.00'),
    transaction_type='DEPOSIT',
    description='Initial deposit',
    status='COMPLETED',
    completed_at=timezone.now() - timedelta(days=10)
)

# Transfer from account1 to account2
account1.balance -= Decimal('500.00')
account2.balance += Decimal('500.00')
account1.save()
account2.save()

txn2 = Transaction.objects.create(
    from_account=account1,
    to_account=account2,
    amount=Decimal('500.00'),
    transaction_type='TRANSFER',
    description='Savings transfer',
    status='COMPLETED',
    completed_at=timezone.now() - timedelta(days=5)
)

# Payment from account1
account1.balance -= Decimal('150.00')
account1.save()

txn3 = Transaction.objects.create(
    from_account=account1,
    amount=Decimal('150.00'),
    transaction_type='PAYMENT',
    description='Utility bill payment',
    status='COMPLETED',
    completed_at=timezone.now() - timedelta(days=2)
)

print(f"✅ Created {Transaction.objects.filter(from_account=account1).count() + Transaction.objects.filter(to_account=account1).count()} transactions")

print("\n" + "="*50)
print("You can now login with:")
print("  Username: testuser")
print("  Password: test123")
print("="*50)