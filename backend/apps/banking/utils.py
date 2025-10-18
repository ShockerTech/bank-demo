from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO
from datetime import datetime

def generate_statement_pdf(account, transactions):
    """Generate PDF statement for an account"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
    elements = []
    styles = getSampleStyleSheet()
    
    # Title
    title_text = f"<b>ACCOUNT STATEMENT</b>"
    title = Paragraph(title_text, styles['Title'])
    elements.append(title)
    elements.append(Spacer(1, 0.3*inch))
    
    # Account Information
    account_info = f"""
    <b>Account Number:</b> {account.account_number}<br/>
    <b>Account Type:</b> {account.account_type}<br/>
    <b>Account Holder:</b> {account.user.get_full_name() or account.user.username}<br/>
    <b>Current Balance:</b> ${account.balance}<br/>
    <b>Currency:</b> {account.currency}<br/>
    <b>Statement Date:</b> {datetime.now().strftime('%B %d, %Y')}<br/>
    """
    account_para = Paragraph(account_info, styles['Normal'])
    elements.append(account_para)
    elements.append(Spacer(1, 0.5*inch))
    
    # Transaction History Header
    txn_header = Paragraph("<b>TRANSACTION HISTORY</b>", styles['Heading2'])
    elements.append(txn_header)
    elements.append(Spacer(1, 0.2*inch))
    
    # Transactions Table
    if transactions:
        # Table headers
        data = [['Date', 'Type', 'Description', 'Amount', 'Status']]
        
        # Add transaction rows
        for txn in transactions:
            # Determine if money in or out
            is_incoming = txn.to_account == account if txn.to_account else False
            amount_str = f"+${txn.amount}" if is_incoming else f"-${txn.amount}"
            
            data.append([
                txn.created_at.strftime('%Y-%m-%d %H:%M'),
                txn.transaction_type,
                txn.description[:30] if txn.description else '-',
                amount_str,
                txn.status
            ])
        
        # Create table
        table = Table(data, colWidths=[1.5*inch, 1*inch, 2*inch, 1*inch, 1*inch])
        table.setStyle(TableStyle([
            # Header styling
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563eb')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('TOPPADDING', (0, 0), (-1, 0), 12),
            
            # Body styling
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('TOPPADDING', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
            
            # Alternate row colors
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
        ]))
        
        elements.append(table)
    else:
        no_txn = Paragraph("<i>No transactions found for this account.</i>", styles['Normal'])
        elements.append(no_txn)
    
    elements.append(Spacer(1, 0.5*inch))
    
    # Footer
    footer_text = """
    <i>This is an official statement from DemoBank.<br/>
    For questions, please contact adeolaoluwashocker@gmail.com</i><br/><br/>
    <b>⚠️ DEMO APPLICATION - This is a demonstration only. No real money or transactions.</b>
    """
    footer = Paragraph(footer_text, styles['Normal'])
    elements.append(footer)
    
    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer