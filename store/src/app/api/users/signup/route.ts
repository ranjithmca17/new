// // signup.ts
// import { Connect } from "@/dbConfig/dbConfig";
// import UserVal from "@/models/UserModel";
// import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from 'bcryptjs';

// export async function POST(request: NextRequest) {
//     try {
//         const reqBody = await request.json();
//         const { username, email, password, tenantId } = reqBody;

//         if (!tenantId) {
//             return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 });
//         }

//         await Connect(tenantId);

//         const userExists = await UserVal.findOne({ email });

//         if (userExists) {
//             return NextResponse.json({ error: "User already exists" }, { status: 400 });
//         }

//         const salt = await bcryptjs.genSalt(10);
//         const hashedPassword = await bcryptjs.hash(password, salt);

//         const newUser = new UserVal({
//             username,
//             password: hashedPassword,
//             email,
//             tenantId,
//         });

//         await newUser.save();
//         return NextResponse.json({
//             message: 'User created successfully',
//             success: true,
//         });
//     } catch (error) {
//         console.error("Signup error:", error);
//         return NextResponse.json({ error: "An error occurred during signup." }, { status: 500 });
//     }
// }





import { Connect } from "@/dbConfig/dbConfig";
import UserVal from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password, tenantId, role } = reqBody;

        // Validate required fields
        if (!tenantId) {
            return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 });
        }
        if (!username || !email || !password || !role) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Connect to the database
        await Connect(tenantId);

        // Check if user already exists
        const userExists = await UserVal.findOne({ email });
        if (userExists) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new UserVal({
            username,
            password: hashedPassword,
            email,
            tenantId,
            role, // Store the role (e.g., user or admin)
        });

        await newUser.save();

        return NextResponse.json({
            message: 'User created successfully',
            success: true,
        });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "An error occurred during signup." }, { status: 500 });
    }
}
