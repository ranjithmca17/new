'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState({ email: '', password: '', tenantId: '', role: 'user' });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const onLogin = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/api/users/login', user);
            toast.success("Login successful!");

            // Redirect based on user role
            const redirectPath = user.role === 'admin' ? '/Admin/Dashboard' : '/Dashboard/Filter';
            router.push(redirectPath);
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setButtonDisabled(!(user.email && user.password && user.tenantId));
    }, [user]);

    const onChangeVal = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold mb-4">{loading ? 'Logging in...' : 'Login'}</h1>
            <hr className="mb-4" />

            <input type="email" name="email" placeholder="Email" value={user.email} onChange={onChangeVal} required />
            <input type="password" name="password" placeholder="Password" value={user.password} onChange={onChangeVal} required />
            <input type="text" name="tenantId" placeholder="Tenant ID" value={user.tenantId} onChange={onChangeVal} required />
            <select name="role" value={user.role} onChange={onChangeVal} aria-label="Select role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <button onClick={onLogin} disabled={buttonDisabled || loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
            <p>Don't have an account? <Link href="/signup">Sign up here</Link></p>
        </div>
    );
}
