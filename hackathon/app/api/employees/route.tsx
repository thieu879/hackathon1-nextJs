import { NextResponse } from "next/server";
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