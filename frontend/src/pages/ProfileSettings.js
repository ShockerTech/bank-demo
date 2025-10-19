import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfilePicture from '../components/ProfilePicture';
import authService from '../services/authService';

const ProfileSettings = () => {
  const { user, loadUser } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      setUploading(true);
      
      const response = await fetch('https://bank-demo-production.up.railway.app/api/auth/profile/upload-picture/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      // RELOAD USER DATA TO REFRESH PROFILE PICTURE
      await loadUser();
      alert('Profile picture updated successfully!');
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePicture = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    try {
      const response = await fetch('https://bank-demo-production.up.railway.app/api/auth/profile/delete-picture/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      // RELOAD USER DATA AFTER DELETION
      await loadUser();
      alert('Profile picture deleted successfully!');
      
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete profile picture');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
          
          {/* Profile Picture Section */}
          <div className="flex items-center space-x-6 mb-8">
            <ProfilePicture user={user} size={80} />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.username}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                {user?.profile?.profile_picture ? 'Profile picture set' : 'No profile picture'}
              </p>
              {/* REMOVED THE DEBUG URL DISPLAY */}
            </div>
          </div>

          {/* Profile Picture Upload */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Update Profile Picture
            </label>
            <div className="space-y-3">
              <div>
                <label htmlFor="profile-picture-upload" className="sr-only">
                  Choose profile picture
                </label>
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  aria-describedby="file-upload-help"
                  title="Choose a profile picture file"
                />
              </div>
              <p id="file-upload-help" className="text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </p>
              
              {user?.profile?.profile_picture && (
                <button
                  onClick={handleDeletePicture}
                  className="text-red-600 text-sm hover:text-red-800 font-medium"
                >
                  Remove profile picture
                </button>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <p className="mt-1 text-sm text-gray-900">{user?.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.profile?.phone_number || 'Not set'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">KYC Status</label>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.profile?.kyc_verified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;