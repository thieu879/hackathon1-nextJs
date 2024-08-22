import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "database", "user.json");
    const data = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(data);
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userRequest = await req.json();
    const filePath = path.join(process.cwd(), "database", "user.json");
    const users = JSON.parse(fs.readFileSync(filePath, "utf8"));
    console.log(users);
    
    if (
      !userRequest.name ||
      !userRequest.dob ||
      !userRequest.email ||
      !userRequest.image
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const emailExists = users.some(
      (user: { email: string }) => user.email === userRequest.email
    );
    if (emailExists) {
      return NextResponse.json(
        { error: "Email đã tồn tại." },
        { status: 400 }
      );
    }

    const newUser = {...userRequest };

    users.push(newUser);

    fs.writeFileSync(filePath, JSON.stringify(users), "utf8");

    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({error:"Lỗi thêm nhân viên"});
  }
}