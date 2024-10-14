import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import UserVal from "@/models/UserModel";

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const user = await UserVal.findById(userId).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User found", data: user });
    } catch (error) {
        console.error("Fetch user error:", error);
        return NextResponse.json({ error: "An error occurred." }, { status: 400 });
    }
}
