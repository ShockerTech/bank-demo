from rest_framework import serializers
from .models import Account, Transaction, Beneficiary
from django.contrib.auth.models import User

class AccountSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Account
        fields = ['id', 'account_number', 'account_type', 'balance', 'currency', 'status', 'username', 'created_at']
        read_only_fields = ['id', 'account_number', 'balance', 'created_at']

class TransactionSerializer(serializers.ModelSerializer):
    from_account_number = serializers.CharField(source='from_account.account_number', read_only=True)
    to_account_number = serializers.CharField(source='to_account.account_number', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'from_account', 'to_account', 'from_account_number', 'to_account_number', 
                  'amount', 'transaction_type', 'status', 'description', 'reference_number', 
                  'created_at', 'completed_at']
        read_only_fields = ['id', 'reference_number', 'status', 'created_at', 'completed_at']

class TransferSerializer(serializers.Serializer):
    from_account_id = serializers.IntegerField()
    to_account_number = serializers.CharField(max_length=12)
    amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    description = serializers.CharField(required=False, allow_blank=True)
    
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value

class BeneficiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficiary
        fields = ['id', 'name', 'account_number', 'bank_name', 'nickname', 'created_at']
        read_only_fields = ['id', 'created_at']