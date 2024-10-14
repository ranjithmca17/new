// getDataFromToken.ts
import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';

export const getDataFromToken = (request: NextRequest) => {
    try {
        const Token_Secret = 'Secret_Key';
        const token = request.cookies.get('token')?.value || '';
        const decodedToken: any = jwt.verify(token, Token_Secret);
        return decodedToken.id;
    } catch (error) {
        console.error("Token decode error:", error);
        return null;
    }
}
