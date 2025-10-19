@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_picture(request):
    """
    Upload or update user profile picture
    """
    try:
        user = request.user
        profile = user.profile
        
        if 'profile_picture' not in request.FILES:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        profile_picture = request.FILES['profile_picture']
        
        # ========== DEBUG LOGGING ==========
        print(f"🚀 DEBUG UPLOAD STARTED")
        print(f"📁 Original filename: {profile_picture.name}")
        print(f"📊 Content type: {profile_picture.content_type}")
        print(f"📏 File size: {profile_picture.size}")
        # ===================================
        
        # Validate file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
        if profile_picture.content_type not in allowed_types:
            return Response(
                {'error': 'Invalid file type. Only JPEG, PNG, and GIF are allowed.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file size (max 5MB)
        if profile_picture.size > 5 * 1024 * 1024:
            return Response(
                {'error': 'File too large. Maximum size is 5MB.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Delete old picture if exists
        if profile.profile_picture:
            if default_storage.exists(profile.profile_picture.name):
                default_storage.delete(profile.profile_picture.name)
        
        # ========== DEBUG BEFORE SAVE ==========
        print(f"💾 About to save file...")
        # =======================================
        
        # Save new picture
        profile.profile_picture = profile_picture
        profile.save()
        
        # ========== DEBUG AFTER SAVE ==========
        print(f"✅ File saved successfully!")
        print(f"📝 Database filename: {profile.profile_picture.name}")
        print(f"📍 File path: {profile.profile_picture.path}")
        print(f"🌐 File URL: {profile.profile_picture.url}")
        # ======================================
        
        return Response({
            'message': 'Profile picture uploaded successfully',
            'profile_picture': profile.profile_picture.url,
            'profile': ProfileSerializer(profile).data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"❌ DEBUG ERROR: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)