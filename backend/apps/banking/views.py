from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Account, Transaction, Beneficiary
from .serializers import (AccountSerializer, TransactionSerializer, 
                          TransferSerializer, BeneficiarySerializer)
from .services import BankingService
from .utils import generate_statement_pdf
from django.http import HttpResponse
from datetime import datetime

# Account Views
class AccountListCreateView(generics.ListCreateAPIView):
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AccountDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_account_balance(request, account_id):
    try:
        account = Account.objects.get(id=account_id, user=request.user)
        return Response({
            'account_number': account.account_number,
            'balance': account.balance,
            'currency': account.currency
        })
    except Account.DoesNotExist:
        return Response({'error': 'Account not found'}, status=status.HTTP_404_NOT_FOUND)

# Transaction Views
class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        user_accounts = Account.objects.filter(user=user)
        
        # Get all transactions where user is sender or receiver
        queryset = Transaction.objects.filter(
            Q(from_account__in=user_accounts) | Q(to_account__in=user_accounts)
        ).select_related('from_account', 'to_account')
        
        # Filter by account if specified
        account_id = self.request.query_params.get('account_id')
        if account_id:
            queryset = queryset.filter(
                Q(from_account__id=account_id) | Q(to_account__id=account_id)
            )
        
        # Filter by type if specified
        txn_type = self.request.query_params.get('type')
        if txn_type:
            queryset = queryset.filter(transaction_type=txn_type)
        
        return queryset

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_transfer(request):
    serializer = TransferSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            transaction = BankingService.create_transfer(
                from_account_id=serializer.validated_data['from_account_id'],
                to_account_number=serializer.validated_data['to_account_number'],
                amount=serializer.validated_data['amount'],
                description=serializer.validated_data.get('description', ''),
                user=request.user
            )
            
            return Response(
                TransactionSerializer(transaction).data,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recent_transactions(request):
    user_accounts = Account.objects.filter(user=request.user)
    transactions = Transaction.objects.filter(
        Q(from_account__in=user_accounts) | Q(to_account__in=user_accounts)
    ).select_related('from_account', 'to_account')[:10]
    
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)

# Beneficiary Views
class BeneficiaryListCreateView(generics.ListCreateAPIView):
    serializer_class = BeneficiarySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Beneficiary.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BeneficiaryDeleteView(generics.DestroyAPIView):
    serializer_class = BeneficiarySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Beneficiary.objects.filter(user=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_statement(request, account_id):
    try:
        account = Account.objects.get(id=account_id, user=request.user)
        transactions = Transaction.objects.filter(
            Q(from_account=account) | Q(to_account=account)
        ).order_by('-created_at')[:50]
        
        # CORRECTION 1: Get the PDF content properly
        # The function should return bytes or a BytesIO object
        pdf_buffer = generate_statement_pdf(account, transactions)
        
        # CORRECTION 2: Handle BytesIO object properly
        # If generate_statement_pdf returns a BytesIO object, get its value
        if hasattr(pdf_buffer, 'getvalue'):
            pdf_content = pdf_buffer.getvalue()
        else:
            pdf_content = pdf_buffer
        
        # CORRECTION 3: Create response with proper content
        response = HttpResponse(pdf_content, content_type='application/pdf')
        
        # CORRECTION 4: Add Content-Length header for proper binary handling
        response['Content-Length'] = len(pdf_content)
        
        # CORRECTION 5: Use 'inline' to view in browser or 'attachment' to force download
        # Changed to 'inline' for easier testing
        response['Content-Disposition'] = f'inline; filename="statement_{account.account_number}.pdf"'
        
        # CORRECTION 6: Add cache control headers to prevent caching issues
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        
        return response
        
    except Account.DoesNotExist:
        # CORRECTION 7: Return proper HttpResponse for 404, not DRF Response
        return HttpResponse({'error': 'Account not found'}, status=404)