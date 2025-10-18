import React from 'react';

const ProfilePicture = ({ user, size = 40, className = '' }) => {
  const getProfilePictureUrl = () => {
    if (user?.profile?.profile_picture) {
      console.log('Raw profile picture URL:', user.profile.profile_picture); // Debug
      
      // Handle different URL formats
      let pictureUrl = user.profile.profile_picture;
      
      // If it's already a full URL, use it as-is
      if (pictureUrl.startsWith('http')) {
        return pictureUrl;
      }
      
      // If it starts with /media/, add the backend URL
      if (pictureUrl.startsWith('/media/')) {
        return `http://localhost:8000${pictureUrl}`;
      }
      
      // If it's just a filename, construct the full URL
      return `http://localhost:8000/media/profiles/${pictureUrl}`;
    }
    return null;
  };

  const getInitials = () => {
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const profilePictureUrl = getProfilePictureUrl();
  
  console.log('Final profile picture URL:', profilePictureUrl); // Debug

  return (
    <div 
      className={`profile-picture ${className}`}
      style={{ 
        width: size, 
        height: size, 
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: profilePictureUrl ? 'transparent' : '#3b82f6',
        color: 'white',
        fontSize: size * 0.4,
        fontWeight: 'bold',
        border: profilePictureUrl ? 'none' : '2px solid #e5e7eb'
      }}
    >
      {profilePictureUrl ? (
        <img 
          src={profilePictureUrl} 
          alt={`${user?.username}'s profile`}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }}
          onError={(e) => {
            console.error('Image failed to load:', profilePictureUrl);
            e.target.style.display = 'none';
          }}
          onLoad={() => {
            console.log('Image loaded successfully:', profilePictureUrl);
          }}
        />
      ) : (
        <span>{getInitials()}</span>
      )}
    </div>
  );
};

export default ProfilePicture;