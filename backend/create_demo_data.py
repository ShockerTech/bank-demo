import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from apps.banking.models import Account, Transaction, Beneficiary
from apps.accounts.models import Profile
from django.utils import timezone
from datetime import timedelta
import random

def create_demo_data():
    print("Creating demo data...")
    
    # Create demo users
    users_data = [
        {
            'username': 'john_doe',
            'email': 'john@example.com',
            'password': 'demo123',
            'first_name': 'John',
            'last_name': 'Doe'
        },
        {
            'username': 'jane_smith',
            'email': 'jane@example.com',
            'password': 'demo123',
            'first_name': 'Jane',
            'last_name': 'Smith'
        },
        {
            'username': 'demo_user',
            'email': 'demo@example.com',
            'password': 'demo123',
            'first_name': 'Demo',
            'last_name': 'User'
        }
    ]
    
    created_users = []
    for user_data in users_data:
        user, created = User.objects.get_or_create(
            username=user_data['username'],
            defaults={
                'email': user_data['email'],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name']
            }
        )
        if created:
            user.set_password(user_data['password'])
            user.save()
            print(f"✅ Created user: {user.username}")
        created_users.append(user)
    
    # Create accounts for each user
    account_types = ['CHECKING', 'SAVINGS', 'BUSINESS']
    initial_balances = [5000.00, 15000.00, 25000.00]
    
    all_accounts = []
    for user in created_users:
        for i, acc_type in enumerate(account_types[:2]):  # 2 accounts per user
            account, created = Account.objects.get_or_create(
                user=user,
                account_type=acc_type,
                defaults={'balance': Decimal(str(initial_balances[i]))}
            )
            if created:
                print(f"✅ Created {acc_type} account for {user.username}: {account.account_number}")
            all_accounts.append(account)
    
    # Create sample transactions
    print("\nCreating sample transactions...")
    transaction_descriptions = [
        'Salary deposit',
        'Rent payment',
        'Grocery shopping',
        'Online purchase',
        'Transfer to savings',
        'Restaurant bill',
        'Utility payment',
        'Car maintenance',
        'Insurance payment',
        'Investment',
    ]
    
    for i in range(30):  # Create 30 transactions
        from_account = random.choice(all_accounts)
        to_account = random.choice([acc for acc in all_accounts if acc != from_account])
        
        amount = Decimal(str(round(random.uniform(50, 1000), 2)))
        
        # Ensure sender has enough balance
        if from_account.balance >= amount:
            txn = Transaction.objects.create(
                from_account=from_account,
                to_account=to_account,
                amount=amount,
                transaction_type='TRANSFER',
                description=random.choice(transaction_descriptions),
                status='COMPLETED',
                completed_at=timezone.now() - timedelta(days=random.randint(0, 30))
            )
            
            # Update balances
            from_account.balance -= amount
            to_account.balance += amount
            from_account.save()
            to_account.save()
            
            if i % 5 == 0:
                print(f"✅ Created transaction: {txn.reference_number}")
    
    # Create beneficiaries
    print("\nCreating beneficiaries...")
    for user in created_users:
        other_accounts = [acc for acc in all_accounts if acc.user != user]
        for i, account in enumerate(other_accounts[:3]):  # 3 beneficiaries per user
            beneficiary, created = Beneficiary.objects.get_or_create(
                user=user,
                account_number=account.account_number,
                defaults={
                    'name': f"{account.user.first_name} {account.user.last_name}",
                    'nickname': f"{account.user.first_name}'s {account.account_type}",
                }
            )
            if created:
                print(f"✅ Created beneficiary for {user.username}")
    
    print("\n🎉 Demo data created successfully!")
    print("\n📝 Demo Accounts:")
    print("=" * 50)
    for user in created_users:
        print(f"\nUsername: {user.username}")
        print(f"Password: demo123")
        accounts = Account.objects.filter(user=user)
        for acc in accounts:
            print(f"  - {acc.account_type}: {acc.account_number} (${acc.balance})")

if __name__ == '__main__':
    create_demo_data()