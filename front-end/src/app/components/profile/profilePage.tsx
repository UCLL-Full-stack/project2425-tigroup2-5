"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import subscriptionService from '../../../../service/subscriptionService';
import enrollmentService from '../../../../service/enrollmentService';
import authService from '../../../../service/authService';

// Types for subscriptions and enrollments
interface Subscription {
    id: number;
    name: string;
    description: string;
    price: number;
    duration: number; // in days
}

interface Enrollment {
    id: number;
    enrollmentDate: string;
    expirationDate: string;
    subscription?: {
        id: number;
        name: string;
        price: number;
    };
    club?: {
        id: number;
        name: string;
    };
    region?: {
        id: number;
        name: string;
    };
}

const ProfilePage = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [dataLoading, setDataLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        firstname: '',
        surname: '',
        email: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstname: user.firstname || '',
                surname: user.surname || '',
                email: user.email || '',
            });
            
            // Fetch member-specific data if the user is a member
            if (user.role === 'member') {
                fetchMemberData();
            }
        }
    }, [user]);

    const fetchMemberData = async () => {
        if (!user || user.role !== 'member') return;
        
        setDataLoading(true);
        
        try {
            // Fetch subscriptions and enrollments in parallel
            const [subscriptionsData, enrollmentsData] = await Promise.all([
                subscriptionService.getMemberSubscriptions(user.id) as Promise<Subscription[]>,
                enrollmentService.getMemberEnrollments(user.id) as Promise<Enrollment[]>
            ]);
            
            setSubscriptions(subscriptionsData);
            setEnrollments(enrollmentsData);
        } catch (error) {
            console.error('Error fetching member data:', error);
            setMessage({
                text: 'Failed to load your membership data. Please try again later.',
                type: 'error'
            });
        } finally {
            setDataLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleEdit = () => {
        setMessage(null);
        setIsEditing(prev => !prev);
        
        // If canceling edit, reset form data
        if (isEditing && user) {
            setFormData({
                firstname: user.firstname || '',
                surname: user.surname || '',
                email: user.email || '',
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        
        try {
            // In a real application, you'd call an API endpoint to update the user profile
            // await userService.updateProfile(formData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setMessage({
                text: 'Profile updated successfully!',
                type: 'success'
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            setMessage({
                text: 'Failed to update profile. Please try again.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="py-8 text-center text-gray-500">
                Loading user information...
            </div>
        );
    }

    const userRole = user.role === 'admin' ? 'Administrator' : 
                     user.role === 'employee' ? 'Employee' : 
                     'Member';

    // Format date to be more readable
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            {message && (
                <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                </div>
            )}
            
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <button 
                    onClick={toggleEdit} 
                    className="btn btn-secondary"
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                        <div>
                            <h3 className="text-text-light text-sm font-medium mb-1">Full Name</h3>
                            <p className="font-medium">{user.firstname} {user.surname}</p>
                        </div>
                        
                        <div>
                            <h3 className="text-text-light text-sm font-medium mb-1">Email Address</h3>
                            <p className="font-medium">{user.email}</p>
                        </div>
                        
                        <div>
                            <h3 className="text-text-light text-sm font-medium mb-1">User Type</h3>
                            <p className="font-medium">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {userRole}
                                </span>
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-text-light text-sm font-medium mb-1">User ID</h3>
                            <p className="font-medium">#{user.id}</p>
                        </div>
                    </div>
                    
                    {user.role === 'member' && (
                        <div className="border-t border-gray-200 mt-8 pt-8">
                            <h2 className="text-xl font-semibold mb-6">Membership Information</h2>
                            
                            {dataLoading ? (
                                <div className="text-center py-8">
                                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                                    <p className="mt-2 text-gray-500">Loading your membership data...</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-medium mb-4">Your Active Enrollments</h3>
                                        {enrollments && enrollments.length > 0 ? (
                                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                <table className="min-w-full divide-y divide-gray-300">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Subscription</th>
                                                            <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Location</th>
                                                            <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Start Date</th>
                                                            <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">End Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200 bg-white">
                                                        {enrollments.map(enrollment => (
                                                            <tr key={enrollment.id}>
                                                                <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                                                                    {enrollment.subscription?.name || "Standard Membership"}
                                                                </td>
                                                                <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                                                                    {enrollment.club?.name || enrollment.region?.name || "All Locations"}
                                                                </td>
                                                                <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                                                                    {formatDate(enrollment.enrollmentDate)}
                                                                </td>
                                                                <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                                                                    {formatDate(enrollment.expirationDate)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                                                <p className="text-gray-500">You don't have any active enrollments.</p>
                                                <button className="mt-4 btn btn-primary">
                                                    Browse Available Subscriptions
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-lg font-medium mb-4">Subscription Options</h3>
                                        {subscriptions && subscriptions.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {subscriptions.map(subscription => (
                                                    <div key={subscription.id} className="border rounded-lg overflow-hidden">
                                                        <div className="p-4 bg-gray-50 border-b">
                                                            <h4 className="font-semibold">{subscription.name}</h4>
                                                        </div>
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-600 mb-4">{subscription.description}</p>
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <span className="font-bold text-lg">${subscription.price}</span>
                                                                    <span className="text-sm text-gray-500">{' / '}{subscription.duration / 30} month(s)</span>
                                                                </div>
                                                                <button className="btn btn-sm btn-outline-primary">
                                                                    Details
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                                                <p className="text-gray-500">No subscription options available at this time.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {(user.role === 'employee' || user.role === 'admin') && (
                        <div className="border-t border-gray-200 mt-8 pt-8">
                            <h2 className="text-xl font-semibold mb-6">Employment Information</h2>
                            
                            <p className="text-center py-4 text-text-light">
                                {user.role === 'admin' ? 'Administrator' : 'Employee'} access level
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProfilePage;