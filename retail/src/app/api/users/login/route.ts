import { Connect } from "@/dbConfig/dbConfig";
import UserVal from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const TOKEN_SECRET = 'Secret_Key'; 

export async function POST(request: NextRequest) {
    try {
        const { email, password, tenantId } = await request.json();

        if (!tenantId) {
            return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 });
        }

        await Connect(tenantId);

        const user = await UserVal.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        const tokenData = { 
            id: user._id, 
            username: user.username, 
            email: user.email, 
            tenantId: user.tenantId,
            role: user.role // Include role in the token
        };
        const token = jwt.sign(tokenData, TOKEN_SECRET, { expiresIn: "1d" });

        const response = NextResponse.json({ message: "Login successful", success: true });
        response.cookies.set("token", token, { httpOnly: true });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "An error occurred during login." }, { status: 500 });
    }
}
