import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest, rep: NextResponse) {
  try {
    const userRequest = await req.json();
    const filePath = path.join(process.cwd(), "database", "user.json");
    const users = JSON.parse(fs.readFileSync(filePath, "utf8"));
    users.push(userRequest);
    fs.writeFileSync(filePath, JSON.stringify(users), "utf8");
    return NextResponse.json("post");
  } catch (error) {
    return NextResponse.json(error);
  }
}
