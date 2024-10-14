// // signup.tsx
// 'use client';
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// export default function SignUpPage() {
//     const router = useRouter();
//     const [user, setUser] = useState({
//         email: '',
//         password: '',
//         username: '',
//         tenantId: '',
//     });

//     const [buttonDisabled, setButtonDisabled] = useState(true);
//     const [loading, setLoading] = useState(false);

//     const onSignup = async () => {
//         try {
//             setLoading(true);
//             await axios.post("/api/users/signup", user);
//             toast.success("Signup successful!");
//             router.push('/login');
//         } catch (error) {
//             toast.error("Signup failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         setButtonDisabled(!(user.email && user.password && user.username && user.tenantId));
//     }, [user]);

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen py-2">
//             <h1 className="text-2xl font-bold mb-4">{loading ? 'Processing...' : 'Sign Up'}</h1>
//             <hr className="mb-4" />

//             <input type="text" placeholder="Username" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />
//             <input type="email" placeholder="Email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
//             <input type="password" placeholder="Password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
//             <input type="text" placeholder="Tenant ID" value={user.tenantId} onChange={(e) => setUser({ ...user, tenantId: e.target.value })} />

//             <button onClick={onSignup} disabled={buttonDisabled || loading}>{loading ? "Signing Up..." : "Sign Up"}</button>
//             <p>Already have an account? <Link href="/login">Login here</Link></p>
//         </div>
//     );
// }








// SignUpPage.tsx
'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SignUpPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: '',
        password: '',
        username: '',
        tenantId: '',
        role:'user'
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const onSignup = async () => {
        try {
            console.log(user);
            
            setLoading(true);
            await axios.post("/api/users/signup", user);
            toast.success("Signup successful!");
            router.push('/login');
        } catch (error) {
            toast.error("Signup failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setButtonDisabled(!(user.email && user.password && user.username && user.tenantId));
    }, [user]);

    const onChangeValue=(e)=>{
        const {name,value}=e.target;
        setUser((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold mb-4">{loading ? 'Processing...' : 'Sign Up'}</h1>
            <hr className="mb-4" />

            <input type="text" placeholder="Username" name="username" value={user.username} onChange={onChangeValue}/>
            <input type="email" placeholder="Email" name="email" value={user.email} onChange={onChangeValue} />
            <input type="password" placeholder="Password" name="password" value={user.password} onChange={onChangeValue} />
            <input type="text" placeholder="Tenant ID" name="tenantId" value={user.tenantId} onChange={onChangeValue} />
<select name="role" onChange={onChangeValue} value={user.role} aria-label="val"  id="">
    <option value="user">User</option>
    <option value="admin">Admin</option>
</select>
            <button onClick={onSignup} disabled={buttonDisabled || loading}>{loading ? "Signing Up..." : "Sign Up"}</button>
            <p>Already have an account? <Link href="/login">Login here</Link></p>
        </div>
    );
}
