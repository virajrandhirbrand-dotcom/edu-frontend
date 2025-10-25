import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import api from '../api';
import './StudentDashboard.css';

const AdminDashboard = () => {
    // Sidebar ref for direct toggle control
    const sidebarRef = useRef(null);
    
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    
    // Handle sidebar collapse changes
    const handleCollapseChange = (isCollapsed) => {
        setSidebarCollapsed(isCollapsed);
    };

    // Handle hamburger button click - directly toggle sidebar via ref
    const handleHamburgerClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (sidebarRef.current) {
            sidebarRef.current.toggle();
        }
        return false;
    };
    
    // Dashboard stats
    const [stats, setStats] = useState(null);
    
    // User management
    const [users, setUsers] = useState([]);
    const [userPagination, setUserPagination] = useState({});
    const [userFilters, setUserFilters] = useState({
        page: 1,
        limit: 10,
        role: '',
        search: '',
        isActive: ''
    });
    
    // Course management
    const [courses, setCourses] = useState([]);
    const [coursePagination, setCoursePagination] = useState({});
    const [courseFilters, setCourseFilters] = useState({
        page: 1,
        limit: 10,
        search: '',
        instructor: ''
    });
    
    // System logs
    const [logs, setLogs] = useState(null);

    // Load dashboard stats
    const loadDashboardStats = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/dashboard');
            setStats(res.data);
        } catch (err) {
            console.error('Failed to load dashboard stats:', err);
            alert('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    // Load users
    const loadUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.entries(userFilters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            
            const res = await api.get(`/admin/users?${params}`);
            setUsers(res.data.users);
            setUserPagination(res.data.pagination);
        } catch (err) {
            console.error('Failed to load users:', err);
            alert('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    // Load courses
    const loadCourses = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.entries(courseFilters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            
            const res = await api.get(`/admin/courses?${params}`);
            setCourses(res.data.courses);
            setCoursePagination(res.data.pagination);
        } catch (err) {
            console.error('Failed to load courses:', err);
            alert('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    // Load system logs
    const loadSystemLogs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/logs');
            setLogs(res.data);
        } catch (err) {
            console.error('Failed to load system logs:', err);
            alert('Failed to load system logs');
        } finally {
            setLoading(false);
        }
    };

    // Update user
    const updateUser = async (userId, updates) => {
        try {
            await api.put(`/admin/users/${userId}`, updates);
            alert('User updated successfully');
            loadUsers();
        } catch (err) {
            console.error('Failed to update user:', err);
            alert('Failed to update user');
        }
    };

    // Delete user
    const deleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        try {
            await api.delete(`/admin/users/${userId}`);
            alert('User deleted successfully');
            loadUsers();
        } catch (err) {
            console.error('Failed to delete user:', err);
            alert('Failed to delete user');
        }
    };

    // Delete course
    const deleteCourse = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        
        try {
            await api.delete(`/admin/courses/${courseId}`);
            alert('Course deleted successfully');
            loadCourses();
        } catch (err) {
            console.error('Failed to delete course:', err);
            alert('Failed to delete course');
        }
    };

    // Load data based on active tab
    useEffect(() => {
        if (activeTab === 'dashboard') {
            loadDashboardStats();
        } else if (activeTab === 'users') {
            loadUsers();
        } else if (activeTab === 'courses') {
            loadCourses();
        } else if (activeTab === 'logs') {
            loadSystemLogs();
        }
    }, [activeTab]);

    // Reload data when filters change
    useEffect(() => {
        if (activeTab === 'users') {
            loadUsers();
        } else if (activeTab === 'courses') {
            loadCourses();
        }
    }, [userFilters, courseFilters]);

    const dashboardStyle = {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
    };

    const tabStyle = {
        display: 'flex',
        marginBottom: '20px',
        borderBottom: '2px solid #e0e0e0'
    };

    const tabButtonStyle = {
        padding: '10px 20px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        borderBottom: '3px solid transparent',
        fontSize: '16px',
        fontWeight: '500'
    };

    const activeTabStyle = {
        ...tabButtonStyle,
        borderBottomColor: '#007bff',
        color: '#007bff'
    };

    const cardStyle = {
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
    };

    const statsGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
    };

    const statCardStyle = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center'
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px'
    };

    const thStyle = {
        background: '#f8f9fa',
        padding: '12px',
        textAlign: 'left',
        borderBottom: '1px solid #dee2e6',
        fontWeight: '600'
    };

    const tdStyle = {
        padding: '12px',
        borderBottom: '1px solid #dee2e6'
    };

    const inputStyle = {
        padding: '8px 12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginRight: '10px',
        marginBottom: '10px'
    };

    const buttonStyle = {
        padding: '8px 16px',
        background: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '5px'
    };

    const dangerButtonStyle = {
        ...buttonStyle,
        background: '#dc3545'
    };

    return (
        <>
            {/* Dashboard Header with Hamburger */}
            <div className="dashboard-header">
                {/* Hamburger Button - Left Side */}
                <button 
                    className="header-hamburger-btn"
                    onClick={handleHamburgerClick}
                    onMouseDown={(e) => e.preventDefault()}
                    onTouchStart={(e) => e.preventDefault()}
                    title={sidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}
                    type="button"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
                
                <h1 className="header-title">Admin Dashboard</h1>
                <p className="header-subtitle">System Administration</p>
            </div>

            {/* Sidebar */}
            <Sidebar 
                ref={sidebarRef}
                onCollapseChange={handleCollapseChange}
                userType="admin" 
            />

            <div style={dashboardStyle}>
            
            {/* Navigation Tabs */}
            <div style={tabStyle}>
                <button 
                    style={activeTab === 'dashboard' ? activeTabStyle : tabButtonStyle}
                    onClick={() => setActiveTab('dashboard')}
                >
                    Dashboard
                </button>
                <button 
                    style={activeTab === 'users' ? activeTabStyle : tabButtonStyle}
                    onClick={() => setActiveTab('users')}
                >
                    User Management
                </button>
                <button 
                    style={activeTab === 'courses' ? activeTabStyle : tabButtonStyle}
                    onClick={() => setActiveTab('courses')}
                >
                    Course Management
                </button>
                <button 
                    style={activeTab === 'logs' ? activeTabStyle : tabButtonStyle}
                    onClick={() => setActiveTab('logs')}
                >
                    System Logs
                </button>
            </div>

            {loading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div>Loading...</div>
                </div>
            )}

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && stats && (
                <div>
                    <h2>System Overview</h2>
                    <div style={statsGridStyle}>
                        <div style={statCardStyle}>
                            <h3>{stats.overview.totalUsers}</h3>
                            <p>Total Users</p>
                        </div>
                        <div style={statCardStyle}>
                            <h3>{stats.overview.activeUsers}</h3>
                            <p>Active Users</p>
                        </div>
                        <div style={statCardStyle}>
                            <h3>{stats.overview.totalCourses}</h3>
                            <p>Total Courses</p>
                        </div>
                        <div style={statCardStyle}>
                            <h3>{stats.overview.totalInternships}</h3>
                            <p>Internships</p>
                        </div>
                        <div style={statCardStyle}>
                            <h3>{stats.overview.totalPublications}</h3>
                            <p>Publications</p>
                        </div>
                        <div style={statCardStyle}>
                            <h3>{stats.overview.recentUsers}</h3>
                            <p>New Users (7 days)</p>
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>User Distribution</h3>
                        {stats.userStats.map((stat, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <strong>{stat._id}:</strong> {stat.count} users
                            </div>
                        ))}
                    </div>

                    <div style={cardStyle}>
                        <h3>Recent Activity</h3>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>User</th>
                                    <th style={thStyle}>Role</th>
                                    <th style={thStyle}>Last Login</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentActivity.map((user, index) => (
                                    <tr key={index}>
                                        <td style={tdStyle}>
                                            {user.firstName} {user.lastName} ({user.email})
                                        </td>
                                        <td style={tdStyle}>{user.role}</td>
                                        <td style={tdStyle}>
                                            {new Date(user.lastLogin).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div>
                    <h2>User Management</h2>
                    
                    {/* Filters */}
                    <div style={cardStyle}>
                        <h3>Filters</h3>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={userFilters.search}
                            onChange={(e) => setUserFilters({...userFilters, search: e.target.value, page: 1})}
                            style={inputStyle}
                        />
                        <select
                            value={userFilters.role}
                            onChange={(e) => setUserFilters({...userFilters, role: e.target.value, page: 1})}
                            style={inputStyle}
                        >
                            <option value="">All Roles</option>
                            <option value="student">Student</option>
                            <option value="ug">Undergraduate</option>
                            <option value="pg">Postgraduate</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                        </select>
                        <select
                            value={userFilters.isActive}
                            onChange={(e) => setUserFilters({...userFilters, isActive: e.target.value, page: 1})}
                            style={inputStyle}
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>

                    {/* Users Table */}
                    <div style={cardStyle}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Name</th>
                                    <th style={thStyle}>Email</th>
                                    <th style={thStyle}>Role</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={thStyle}>Created</th>
                                    <th style={thStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td style={tdStyle}>
                                            {user.firstName} {user.lastName}
                                        </td>
                                        <td style={tdStyle}>{user.email}</td>
                                        <td style={tdStyle}>{user.role}</td>
                                        <td style={tdStyle}>
                                            <span style={{ 
                                                color: user.isActive ? 'green' : 'red',
                                                fontWeight: 'bold'
                                            }}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={tdStyle}>
                                            <button
                                                style={buttonStyle}
                                                onClick={() => updateUser(user._id, { 
                                                    isActive: !user.isActive 
                                                })}
                                            >
                                                {user.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                style={dangerButtonStyle}
                                                onClick={() => deleteUser(user._id)}
                                                disabled={user.role === 'admin'}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {userPagination.totalPages > 1 && (
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <button
                                    style={buttonStyle}
                                    onClick={() => setUserFilters({...userFilters, page: userFilters.page - 1})}
                                    disabled={!userPagination.hasPrev}
                                >
                                    Previous
                                </button>
                                <span style={{ margin: '0 20px' }}>
                                    Page {userPagination.currentPage} of {userPagination.totalPages}
                                </span>
                                <button
                                    style={buttonStyle}
                                    onClick={() => setUserFilters({...userFilters, page: userFilters.page + 1})}
                                    disabled={!userPagination.hasNext}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
                <div>
                    <h2>Course Management</h2>
                    
                    {/* Filters */}
                    <div style={cardStyle}>
                        <h3>Filters</h3>
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={courseFilters.search}
                            onChange={(e) => setCourseFilters({...courseFilters, search: e.target.value, page: 1})}
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            placeholder="Filter by instructor..."
                            value={courseFilters.instructor}
                            onChange={(e) => setCourseFilters({...courseFilters, instructor: e.target.value, page: 1})}
                            style={inputStyle}
                        />
                    </div>

                    {/* Courses Table */}
                    <div style={cardStyle}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Course Name</th>
                                    <th style={thStyle}>Code</th>
                                    <th style={thStyle}>Instructor</th>
                                    <th style={thStyle}>Credits</th>
                                    <th style={thStyle}>Semester</th>
                                    <th style={thStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course._id}>
                                        <td style={tdStyle}>{course.name}</td>
                                        <td style={tdStyle}>{course.code}</td>
                                        <td style={tdStyle}>{course.instructor}</td>
                                        <td style={tdStyle}>{course.credits}</td>
                                        <td style={tdStyle}>{course.semester}</td>
                                        <td style={tdStyle}>
                                            <button
                                                style={dangerButtonStyle}
                                                onClick={() => deleteCourse(course._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {coursePagination.totalPages > 1 && (
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <button
                                    style={buttonStyle}
                                    onClick={() => setCourseFilters({...courseFilters, page: courseFilters.page - 1})}
                                    disabled={!coursePagination.hasPrev}
                                >
                                    Previous
                                </button>
                                <span style={{ margin: '0 20px' }}>
                                    Page {coursePagination.currentPage} of {coursePagination.totalPages}
                                </span>
                                <button
                                    style={buttonStyle}
                                    onClick={() => setCourseFilters({...courseFilters, page: courseFilters.page + 1})}
                                    disabled={!coursePagination.hasNext}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Logs Tab */}
            {activeTab === 'logs' && logs && (
                <div>
                    <h2>System Logs</h2>
                    
                    <div style={cardStyle}>
                        <h3>Recent Logins</h3>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>User</th>
                                    <th style={thStyle}>Role</th>
                                    <th style={thStyle}>Last Login</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.recentLogins.map((user, index) => (
                                    <tr key={index}>
                                        <td style={tdStyle}>
                                            {user.firstName} {user.lastName} ({user.email})
                                        </td>
                                        <td style={tdStyle}>{user.role}</td>
                                        <td style={tdStyle}>
                                            {new Date(user.lastLogin).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={cardStyle}>
                        <h3>Recent Course Creations</h3>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Course Name</th>
                                    <th style={thStyle}>Code</th>
                                    <th style={thStyle}>Instructor</th>
                                    <th style={thStyle}>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.recentCourses.map((course, index) => (
                                    <tr key={index}>
                                        <td style={tdStyle}>{course.name}</td>
                                        <td style={tdStyle}>{course.code}</td>
                                        <td style={tdStyle}>{course.instructor}</td>
                                        <td style={tdStyle}>
                                            {new Date(course.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default AdminDashboard;

