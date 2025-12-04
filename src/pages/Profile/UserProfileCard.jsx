import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Hash, MapPin, Database, Clock } from 'lucide-react';

const UserProfileCard = () => {
  const userData = useSelector((state) => state.user);

  if (!userData) {
    return (
      <Card className="w-80">
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-slate-500">No user data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getUserInitials = () => {
    if (userData?.first_name && userData?.last_name) {
      return userData.first_name.charAt(0) + userData.last_name.charAt(0);
    } else if (userData?.first_name) {
      return userData.first_name.charAt(0);
    } else if (userData?.email) {
      return userData.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <Card className="w-80 shadow-lg border-slate-200 overflow-hidden">
      <CardContent className="p-0">
        {/* Header with gradient blue background */}
        <div className="bg-gradient-to-r bg-[#4285B4] p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">
                {getUserInitials()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-white">
                {userData.first_name && userData.last_name 
                  ? `${userData.first_name} ${userData.last_name}` 
                  : userData.first_name || 'Unknown User'}
              </h3>
              <div className="flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                <span className="text-sm text-blue-100">
                  {userData.is_verified ? 'Verified Account' : 'Unverified Account'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="p-6 bg-white">
          {/* Email */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Mail className="h-4 w-4 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">EMAIL</p>
              <p className="text-sm text-slate-700 truncate">
                {userData.email || 'N/A'}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Phone className="h-4 w-4 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">PHONE</p>
              <p className="text-sm text-slate-700">
                {userData.phone_number || 'N/A'}
              </p>
            </div>
          </div>

          {/* User ID */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Hash className="h-4 w-4 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">USER ID</p>
              <p className="text-sm text-slate-700 font-mono">
                {userData.id ? userData.id.substring(0, 8) + '...' : 'N/A'}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <MapPin className="h-4 w-4 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">LOCATION</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-700">
                  {userData.country ? userData.country.toUpperCase() : 'N/A'}
                </span>
                {userData.currency && (
                  <>
                    <span className="text-slate-400">•</span>
                    <span className="text-sm text-slate-600">
                      {userData.currency.toUpperCase()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Schema */}
          {userData.schema_name && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Database className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">SCHEMA</p>
                <Badge className="bg-blue-100 text-blue-700 text-xs">
                  {userData.schema_name}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;