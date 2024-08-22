import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function PUT(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const updatedData = await req.json();

    const filePath = path.join(process.cwd(), "database", "user.json");
    const users = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const findIndex = users.findIndex((user: any) => user.id == +id);
    const emailExists = users.some(
      (user: { email: string, id: number }) => user.email === updatedData.email && user.id != +id
    );

    if (emailExists) {
      return NextResponse.json({ error: "Lỗi Email" }, { status: 400 });
    }

    if (findIndex !== -1) {
      users[findIndex] = {
        ...users[findIndex],
        ...updatedData,
      };

      fs.writeFileSync(filePath, JSON.stringify(users), "utf8");

      return NextResponse.json(users[findIndex]);
    } else {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Lỗi Sửa nhân viên" }, { status: 500 });
  }
}


export async function DELETE(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), "database", "user.json");
    const users = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const findIndex = users.findIndex((user: any) => user.id == +id);

    if (findIndex !== -1) {
      users.splice(findIndex, 1);

      fs.writeFileSync(filePath, JSON.stringify(users), "utf8");

      return NextResponse.json(users);
    } else {
      return NextResponse.json({ error: "Người dùng không tồn tại" });
    }
  } catch (error) {
    return NextResponse.json({error:"lỗi không xoá được người dùng"});
  }
}
